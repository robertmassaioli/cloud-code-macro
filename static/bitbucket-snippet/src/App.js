import React, { useEffect, useState } from 'react';
import { view } from '@forge/bridge';
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

    // Handle both URL formats:
    // Old format: /snippets/{workspace}/{encoded_id}
    // New format: /{workspace}/workspace/snippets/{encoded_id}/{title}

    let workspace, encoded_id, revision = null;

    if (pathParts[0] === 'snippets') {
      // Old format: /snippets/{workspace}/{encoded_id}
      if (pathParts.length < 3) {
        throw new Error('Invalid snippet URL format');
      }
      workspace = pathParts[1];
      encoded_id = pathParts[2];
      revision = pathParts[3] || null;
    } else if (pathParts.length >= 4 && pathParts[1] === 'workspace' && pathParts[2] === 'snippets') {
      // New format: /{workspace}/workspace/snippets/{encoded_id}/{title}
      workspace = pathParts[0];
      encoded_id = pathParts[3];
      revision = pathParts[4] || null;
    } else {
      throw new Error('Invalid snippet URL format');
    }

    return {
      workspace,
      encoded_id,
      revision
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
  const [fileLoadingProgress, setFileLoadingProgress] = useState({ loaded: 0, total: 0 });

  const fetchSnippetData = async (snippetUrl) => {
    try {
      const { workspace, encoded_id } = parseSnippetUrl(snippetUrl);

      // Generate the api url using the same structure as the original connect version
      const url = new URL(snippetUrl);
      const apiUrl = `${url.origin}/!api/2.0/snippets/${workspace}/${encoded_id}`;

      console.log('Fetching snippet metadata from:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'omit' // Similar to withCredentials: false in original
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch snippet: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Snippet metadata received:', data);

      // Following the pattern from the original implementation:
      // Request all of the contents of all of the files and save their data
      const fileKeys = Object.keys(data.files || {});
      console.log('Found files:', fileKeys);
      
      // Update progress tracking
      setFileLoadingProgress({ loaded: 0, total: fileKeys.length });
      
      const rawRequests = [];
      const rawData = [];

      // Create individual requests for each file, similar to original implementation
      fileKeys.forEach((filename, i) => {
        const thisFile = data.files[filename];
        console.log(`Fetching content for file ${i + 1}/${fileKeys.length}: ${filename}`);
        
        const rawDataRequest = fetch(thisFile.links.self.href, {
          method: 'GET',
          headers: {
            'Accept': 'text/plain'
          },
          credentials: 'omit'
        }).then(async (fileResponse) => {
          if (fileResponse.ok) {
            const rawFileContents = await fileResponse.text();
            console.log(`Successfully loaded content for ${filename} (${rawFileContents.length} characters)`);
            
            // Store data in the same structure as original
            rawData[i] = {
              filename: filename,
              htmlHref: thisFile.links.html.href,
              contents: rawFileContents,
              size: thisFile.size
            };
            
            // Update progress
            setFileLoadingProgress(prev => ({ 
              loaded: prev.loaded + 1, 
              total: prev.total 
            }));
            
            return rawData[i];
          } else {
            console.warn(`Failed to fetch content for file ${filename}: ${fileResponse.status}`);
            rawData[i] = {
              filename: filename,
              htmlHref: thisFile.links.html.href,
              contents: '// Failed to load file content',
              size: thisFile.size || 0
            };
            
            // Update progress even for failed files
            setFileLoadingProgress(prev => ({ 
              loaded: prev.loaded + 1, 
              total: prev.total 
            }));
            
            return rawData[i];
          }
        }).catch(error => {
          console.error(`Error fetching file ${filename}:`, error);
          rawData[i] = {
            filename: filename,
            htmlHref: thisFile.links.html.href,
            contents: '// Error loading file content',
            size: thisFile.size || 0
          };
          
          // Update progress even for errored files
          setFileLoadingProgress(prev => ({ 
            loaded: prev.loaded + 1, 
            total: prev.total 
          }));
          
          return rawData[i];
        });

        rawRequests.push(rawDataRequest);
      });

      // Wait for all file requests to complete (similar to $.when.apply in original)
      console.log('Waiting for all file content requests to complete...');
      await Promise.all(rawRequests);
      
      console.log('All file contents loaded. Processing results...');
      
      // Filter out any undefined entries and sort by original order
      const filesWithContent = rawData
        .filter(item => item !== undefined)
        .map(item => ({
          filename: item.filename,
          content: item.contents,
          htmlUrl: item.htmlHref,
          size: item.size
        }));

      console.log(`Successfully processed ${filesWithContent.length} files`);

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
        <LoadingContainer>
          {fileLoadingProgress.total > 0 ? (
            <>
              Loading snippet files... ({fileLoadingProgress.loaded}/{fileLoadingProgress.total})
              <div style={{ marginTop: '8px', fontSize: '11px' }}>
                Fetching individual file contents from Bitbucket API
              </div>
            </>
          ) : (
            'Loading snippet...'
          )}
        </LoadingContainer>
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

      {snippetData.files && snippetData.files.length > 0 && (
        <>
          {snippetData.files.map((file, index) => (
            <FileContainer key={index}>
              <FileHeader>
                <a href={file.htmlUrl} target="_blank" rel="noopener noreferrer">
                  {file.filename}
                </a>
                {file.size && (
                  <span style={{ float: 'right', fontSize: '11px', color: '#6b778c' }}>
                    {file.size} bytes
                  </span>
                )}
              </FileHeader>
              <FileContent>
                <pre><code>{file.content}</code></pre>
              </FileContent>
            </FileContainer>
          ))}
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#6b778c', textAlign: 'center' }}>
            Displayed {snippetData.files.length} file{snippetData.files.length !== 1 ? 's' : ''} from snippet
          </div>
        </>
      )}
    </Container>
  );
}

export default App;