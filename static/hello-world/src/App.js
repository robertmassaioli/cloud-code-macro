import React, { useEffect, useState } from 'react';
import { invoke, requestConfluence, view } from '@forge/bridge';
import Editor from '@monaco-editor/react';
import styled from 'styled-components';
import { debounce } from 'throttle-debounce';
import { isPresent } from 'ts-is-present';

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
  const [data, setData] = useState(null);
  const [context, setContext] = useState(null);

  useEffectAsync(async () => {
    setContext(await view.getContext());
  }, [])

  useEffectAsync(async () => {
    if (isPresent(context)) {
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
        console.log(responsePayload);
        if (responsePayload.results.length === 1) {
          const property = responsePayload.results[0];
          console.log(property);
          setData(property);
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
  }, [context]);

  if (!isPresent(context)) {
    return <Container>Loading context...</Container>;
  }

  if (!isPresent(data)) {
    return <Container>Loading data...</Container>;
  }

  const macroId = context.localId;
  const pageId = context.extension.content.id;
  const { language } = context.extension.config;

  const onUpdate = (value) => {
    //console.log(`Value changed to`, value);
    if (isPresent(data.id)) {
      requestConfluence(`/wiki/api/v2/pages/${pageId}/properties/${data.id}`, {
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
      }).then(response => response.json()).then(property => setData(property));
      //todo: what happens if concurrent editing happens? How do I should those errors to the user and put them back in a position such that they keep writing?
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
      <Editor height="600px" defaultLanguage={language} defaultValue={data.value.data} onChange={debouncedOnUpdate} />
    </Container>
  );
}

export default App;