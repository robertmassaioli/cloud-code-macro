import React, { useEffect, useState } from 'react';
import { view } from '@forge/bridge';
import styled from 'styled-components';

const Container = styled.div`
  background-color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  padding: 20px;
`;

const DeprecationNotice = styled.div`
  padding: 20px;
  border: 1px solid #ff7452;
  border-radius: 8px;
  background-color: #fff4e6;
  text-align: center;
`;

const DeprecationTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #bf2600;
  font-size: 18px;
  font-weight: 600;
`;

const DeprecationMessage = styled.p`
  margin: 0 0 16px 0;
  color: #6b778c;
  font-size: 14px;
  line-height: 1.5;
`;

const LinkButton = styled.a`
  display: inline-block;
  padding: 8px 16px;
  background-color: #0052cc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;

  &:hover {
    background-color: #0065ff;
    text-decoration: none;
  }
`;

function App() {
  const [context, setContext] = useState(null);

  useEffect(() => {
    view.getContext().then((value) => {
      setContext(value)
    });
  }, []);

  const url = (context?.extension?.config?.snippetUrl && context?.extension?.config?.snippetUrl.trim()) || context?.extension?.autoConvertLink;

  return (
    <Container>
      <DeprecationNotice>
        <DeprecationTitle>Bitbucket Snippet Macro No Longer Supported</DeprecationTitle>
        <DeprecationMessage>
          This macro has been deprecated and will no longer display snippet content.
        </DeprecationMessage>
        <DeprecationMessage>
          To view your snippet content, please visit the original Bitbucket page directly:
        </DeprecationMessage>
        {url && (
          <LinkButton href={url} target="_blank" rel="noopener noreferrer">
            View Snippet on Bitbucket
          </LinkButton>
        )}
      </DeprecationNotice>
    </Container>
  );
}

export default App;
