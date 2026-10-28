import React, { useEffect, useState } from 'react';
import { invoke, requestConfluence, view } from '@forge/bridge';
import Editor from '@monaco-editor/react';
import styled from 'styled-components';
import { debounce } from 'throttle-debounce';
import { isPresent } from 'ts-is-present';
import SectionMessage, { SectionMessageAction } from '@atlaskit/section-message';
import { useTranslate } from '../useTranslate';

const radius = 3;

const Container = styled.div`
  border-style: solid;
  border-width: 1px;
  border-color: black;
  padding: 2px;

  -webkit-border-radius: ${radius}px;
  -moz-border-radius: ${radius}px;
  border-radius: ${radius}px;
`;

function getBodyId(macroId) {
  return `cloud-code-macro.${macroId}.body`;
}

function useEffectAsync(callback, context) {
  useEffect(() => {
    (async () => {
      await callback();
    })();
  }, context);
}

function App() {
  const { t } = useTranslate();
  const [data, setData] = useState(null);
  const [context, setContext] = useState(null);
  const [showRefresh, setShowRefresh] = useState(false);

  useEffectAsync(async () => {
    setContext(await view.getContext());
  }, [])

  async function refreshData() {
    const response = await requestConfluence(`/wiki/api/v2/pages/${context.extension.content.id}/properties?key=${encodeURIComponent(getBodyId(context.localId))}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    let gotResults = false;
    if (response.ok) {
      const responsePayload = await response.json();
      if (responsePayload.results.length === 1) {
        const property = responsePayload.results[0];
        setData(property);
        setShowRefresh(false);
        gotResults = true;
      }
    }

    if (!gotResults) {
      console.log(`No body found for macro ${context.localId}...setting to default.`);
      setData({
        value: {
          data: `// Start writing your text here`
        }
      });
    }
  }

  useEffectAsync(async () => {
    if (isPresent(context)) {
      await refreshData();
    }
  }, [context]);

  if (!isPresent(context)) {
    return <Container>{t('view.codeEditor.loadingContext')}</Container>;
  }

  if (!isPresent(data)) {
    return <Container>{t('view.codeEditor.loadingData')}</Container>;
  }

  const macroId = context.localId;
  const pageId = context.extension.content.id;
  const language = context.extension?.config?.language;

  const onUpdate = async (value) => {
    if (isPresent(data.id)) {
      try {
        const response = await requestConfluence(`/wiki/api/v2/pages/${pageId}/properties/${data.id}`, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            key: getBodyId(macroId),
            version: {
              number: data.version.number + 1
            },
            value: {
              data: value
            }
          })
        });

        if (response.ok) {
          setData(await response.json());
        } else {
          console.error(`Response failed...`);
          setShowRefresh(true);
        }
      } catch (e) {
        console.error(e);
        setShowRefresh(true);
      }
    } else {
      requestConfluence(`/wiki/api/v2/pages/${pageId}/properties`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: getBodyId(macroId),
          value: {
            data: value
          }
        })
      }).then(response => response.json()).then(property => setData(property));
    }
  };

  const debouncedOnUpdate = debounce(2000, onUpdate);

  return (
    <Container>
      {showRefresh && (
        <SectionMessage
          title={t('view.codeEditor.outOfSync.title')}
          appearance="warning"
          actions={[
            <SectionMessageAction href="#" onClick={() => refreshData()}>{t('view.codeEditor.refresh')}</SectionMessageAction>
          ]}>
          <>
            <p>{t('view.codeEditor.outOfSync.intro')}</p>
            <ul>
              <li>{t('view.codeEditor.outOfSync.reasonSomebodyElse')}</li>
              <li>{t('view.codeEditor.outOfSync.reasonAnotherTab')}</li>
            </ul>
          </>
        </SectionMessage>
      )}
      {!showRefresh && (
        <Editor height="600px" defaultLanguage={language} defaultValue={data.value.data} onChange={debouncedOnUpdate} />
      )}
    </Container>
  );
}

export default App;
