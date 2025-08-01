import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();

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

// Fetch snippet data from Bitbucket API
resolver.define('fetchSnippetData', async (req) => {
  const { snippetUrl } = req.payload;
  
  if (!snippetUrl) {
    throw new Error('Snippet URL is required');
  }
  
  try {
    const { username, snippetId } = parseSnippetUrl(snippetUrl);
    
    // Bitbucket API v2.0 endpoint for snippets
    const apiUrl = `https://api.bitbucket.org/2.0/snippets/${username}/${snippetId}`;
    
    const response = await api.fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch snippet: ${response.status} ${response.statusText}`);
    }
    
    const snippetData = await response.json();
    
    // Fetch file contents for each file in the snippet
    const filesWithContent = await Promise.all(
      Object.keys(snippetData.files || {}).map(async (filename) => {
        const file = snippetData.files[filename];
        try {
          const fileResponse = await api.fetch(file.links.self.href, {
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
      title: snippetData.title || 'Untitled Snippet',
      description: snippetData.description || '',
      language: snippetData.language || 'text',
      isPrivate: snippetData.is_private || false,
      createdOn: snippetData.created_on,
      updatedOn: snippetData.updated_on,
      owner: snippetData.owner ? {
        displayName: snippetData.owner.display_name,
        username: snippetData.owner.username
      } : null,
      files: filesWithContent,
      htmlUrl: snippetData.links?.html?.href || snippetUrl
    };
    
  } catch (error) {
    console.error('Error fetching snippet data:', error);
    throw new Error(`Failed to fetch snippet: ${error.message}`);
  }
});

export const handler = resolver.getDefinitions();