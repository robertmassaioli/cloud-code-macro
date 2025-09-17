import React, { useState, useEffect } from 'react';
import { view, useConfig } from '@forge/react';

function App() {
  const [gistUrl, setGistUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const context = useConfig();

  console.log("context", context)

  if(context) {
    const url = context?.extension?.config?.gistUrl || context.extension?.config?.autoConvertLink;

    if (!url) {
      throw new Error('No gist URL provided');
    }

    return (
    <div style={{ padding: '10px' }}>
      <div id="gist-container">{url}
        {/* GitHub gist will be injected here */}
      </div>
    </div>
  );
  }

  // useEffect(() => {
  //   if (gistUrl && !loading && !error) {
  //     // Create and inject the GitHub gist script
  //     const script = document.createElement('script');
  //     script.src = gistUrl;
  //     script.async = true;

  //     // Clear any existing gist content
  //     const container = document.getElementById('gist-container');
  //     if (container) {
  //       container.innerHTML = '';
  //       container.appendChild(script);
  //     }
  //   }
  // }, [gistUrl, loading, error]);

  return (
    <div style={{ padding: '10px' }}>
      <div id="gist-container">Could not load the URL.
        {/* GitHub gist will be injected here */}
      </div>
    </div>
  );
}

export default App;