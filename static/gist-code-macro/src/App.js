import React, { useState, useEffect } from 'react';
import { view } from '@forge/bridge';

function App() {
  const [gistUrl, setGistUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGist = async () => {
      try {
        const context = await view.getContext();
        
        // Get gist URL from config (manual entry) or autoConvertLink (autoconvert)
        const url = context.extension?.config?.gistUrl || context.extension?.config?.autoConvertLink;
        
        if (!url) {
          throw new Error('No gist URL provided');
        }

        setGistUrl(url);
      } catch (err) {
        console.error('Error loading gist:', err);
        setError(err.message || 'Failed to load gist');
      } finally {
        setLoading(false);
      }
    };

    loadGist();
  }, []);

  useEffect(() => {
    if (gistUrl && !loading && !error) {
      // Create and inject the GitHub gist script
      const script = document.createElement('script');
      script.src = gistUrl;
      script.async = true;
      
      // Clear any existing gist content
      const container = document.getElementById('gist-container');
      if (container) {
        container.innerHTML = '';
        container.appendChild(script);
      }
    }
  }, [gistUrl, loading, error]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading GitHub gist...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        Error: {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '10px' }}>
      <div id="gist-container">
        {/* GitHub gist will be injected here */}
      </div>
    </div>
  );
}

export default App;