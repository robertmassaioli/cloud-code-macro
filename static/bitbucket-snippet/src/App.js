import React, { useEffect, useState } from 'react';
import { invoke, view } from '@forge/bridge';
import styled from 'styled-components';

const Container = styled.div`
  background-color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const FileContainer = styled.div`
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FileHeader = styled.div`
  border-radius: 3px 3px 0 0;
  border: 1px solid #d1d9e0;
  background-color: #f1f3f4;
  padding: 10px;
  
  a {
    color: #6b778c;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const FileContent = styled.div`
  border-radius: 0 0 3px 3px;
  border-left: 1px solid #d1d9e0;
  border-right: 1px solid #d1d9e0;
  border-bottom: 1px solid #d1d9e0;
  padding: 10px;
  
  pre {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
    font-size: 12px;
    line-height: 1.45;
    
    code {
      background: transparent;
      border: none;
      padding: 0;
    }
  }
`;

const LoadingContainer = styled.div`
  padding: 20px;
  text-align: center;
  color: #6b778c;
`;

const ErrorContainer = styled.div`
  padding: 20px;
  background-color: #ffebe6;
  border: 1px solid #ff8f73;
  border-radius: 3px;
  color: #bf2600;
`;

const SnippetTitle = styled.h3`
  margin: 0 0 10px 0;
  color: #172b4d;
  font-size: 16px;
  font-weight: 600;
`;

const SnippetMeta = styled.div`
  margin-bottom: 15px;
  font-size: 12px;
  color: #6b778c;
`;

function App() {
  const [snippetData, setSnippetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [context, setContext] = useState(null);

  useEffect(() => {
    const loadSnippet = async () => {
      try {
        const viewContext = await view.getContext();
        setContext(viewContext);
        
        const snippetUrl = viewContext.extension?.config?.snippetUrl;
        if (!snippetUrl) {
          throw new Error('No snippet URL provided');
        }

        const data = await invoke('fetchSnippetData', { snippetUrl });
        setSnippetData(data);
      } catch (err) {
        console.error('Error loading snippet:', err);
        setError(err.message || 'Failed to load snippet');
      } finally {
        setLoading(false);
      }
    };

    loadSnippet();
  }, []);

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading snippet...</LoadingContainer>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <strong>Error loading snippet:</strong> {error}
        </ErrorContainer>
      </Container>
    );
  }

  if (!snippetData) {
    return (
      <Container>
        <ErrorContainer>No snippet data available</ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      {snippetData.title && (
        <SnippetTitle>{snippetData.title}</SnippetTitle>
      )}
      
      {snippetData.owner && (
        <SnippetMeta>
          By {snippetData.owner.displayName} (@{snippetData.owner.username})
          {snippetData.updatedOn && (
            <> • Updated {new Date(snippetData.updatedOn).toLocaleDateString()}</>
          )}
        </SnippetMeta>
      )}
      
      {snippetData.files && snippetData.files.map((file, index) => (
        <FileContainer key={index}>
          <FileHeader>
            <a href={file.htmlUrl} target="_blank" rel="noopener noreferrer">
              {file.filename}
            </a>
          </FileHeader>
          <FileContent>
            <pre><code>{file.content}</code></pre>
          </FileContent>
        </FileContainer>
      ))}
    </Container>
  );
}

export default App;