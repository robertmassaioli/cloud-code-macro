import React, { useEffect, useState } from 'react';
import { view } from '@forge/bridge';
import { useConfig } from '@forge/react';
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
  padding: 16px;
  border: 1px solid #d73a49;
  border-radius: 6px;
  background-color: #ffeef0;
  color: #d73a49;
  
  strong {
    font-weight: 600;
  }
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

// Helper function to extract snippet info from Bitbucket URL
function parseSnippetUrl(snippetUrl) {
  try {
    const url = new URL(snippetUrl);
    if (url.hostname !== 'bitbucket.org' || !url.pathname.includes('/snippets/')) {
      throw new Error('Invalid Bitbucket snippet URL');
    }

    const pathParts = url.pathname.split('/').filter(part => part);
    // Expected format: /snippets/{username}/{snippet_id} or /snippets/{username}/{snippet_id}/{revision}
    if (pathParts.length < 3 || pathParts[0] !== 'snippets') {
      throw new Error('Invalid snippet URL format');
    }

    return {
      username: pathParts[1],
      snippetId: pathParts[2],
      revision: pathParts[3] || null
    };
  } catch (error) {
    console.error('Error parsing snippet URL:', error);
    throw error;
  }
}

function App() {
  const [snippetData, setSnippetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [context, setContext] = useState(null);

  const fetchSnippetData = async (snippetUrl) => {
    try {
      const { username, snippetId } = parseSnippetUrl(snippetUrl);

      // Bitbucket API v2.0 endpoint for snippets
      const apiUrl = `https://api.bitbucket.org/2.0/snippets/${username}/${snippetId}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch snippet: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Fetch file contents for each file in the snippet
      const filesWithContent = await Promise.all(
        Object.keys(data.files || {}).map(async (filename) => {
          const file = data.files[filename];
          try {
            const fileResponse = await fetch(file.links.self.href, {
              method: 'GET',
              headers: {
                'Accept': 'text/plain'
              }
            });

            if (fileResponse.ok) {
              const content = await fileResponse.text();
              return {
                filename,
                content,
                htmlUrl: file.links.html.href,
                size: file.size
              };
            } else {
              console.warn(`Failed to fetch content for file ${filename}`);
              return {
                filename,
                content: '// Failed to load file content',
                htmlUrl: file.links.html.href,
                size: file.size
              };
            }
          } catch (error) {
            console.error(`Error fetching file ${filename}:`, error);
            return {
              filename,
              content: '// Error loading file content',
              htmlUrl: file.links.html.href,
              size: file.size || 0
            };
          }
        })
      );

      return {
        title: data.title || 'Untitled Snippet',
        description: data.description || '',
        language: data.language || 'text',
        isPrivate: data.is_private || false,
        createdOn: data.created_on,
        updatedOn: data.updated_on,
        owner: data.owner ? {
          displayName: data.owner.display_name,
          username: data.owner.username
        } : null,
        files: filesWithContent,
        htmlUrl: data.links?.html?.href || snippetUrl
      };

    } catch (error) {
      console.error('Error fetching snippet data:', error);
      throw new Error(`Failed to fetch snippet: ${error.message}`);
    }
  };

  useEffect(() => {
    view.getContext().then((value) => {
      setContext(value)
    });
  }, [view.getContext]);

  console.log("context", context)

  const url = (context?.extension?.config?.snippetUrl && context?.extension?.config?.snippetUrl.trim()) || context?.extension?.autoConvertLink;

  useEffect(() => {
    const loadSnippet = async () => {
      if (!url) {
        setError('No snippet URL provided');
        setLoading(false);
        return;
      }

      try {
        const data = await fetchSnippetData(url);
        setSnippetData(data);
      } catch (err) {
        console.error('Error loading snippet:', err);
        setError(err.message || 'Failed to load snippet');
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      loadSnippet();
    } else {
      setLoading(false);
    }
  }, [url]);

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