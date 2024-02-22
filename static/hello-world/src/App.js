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

function App() {
  const [data, setData] = useState(null);
  const [context, setContext] = useState(null);

  useEffect(async () => {
    setContext(await view.getContext());
  }, []);

  useEffect(() => {
    invoke('getText', { example: 'my-invoke-variable' }).then(setData);
  }, []);

  if (!isPresent(context)) {
    return <Container>Loading...</Container>;
  }

  console.log(context);

  const macroId = context.localId;
  const pageId = context.extension.content.id;

  const onUpdate = (value) => {
    console.log(`Value changed to`, value);
    const response = requestConfluence(`/wiki/api/v2/pages/${pageId}/properties`, {
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
    });
  };

  const debouncedOnUpdate = debounce(2000, onUpdate);

  return (
    <Container>
      <Editor height="600px" defaultLanguage="javascript" defaultValue="// your code here" onChange={debouncedOnUpdate} />
    </Container>
  );
}

export default App;