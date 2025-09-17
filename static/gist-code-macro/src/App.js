import React, { useState, useEffect } from 'react';
import { view } from "@forge/bridge";
import { useConfig } from '@forge/react';

function App() {
  const [context, setContext] = useState(null);

  useEffect(() => {
    view.getContext().then((value) => {
      setContext(value)
    });
  }, [view.getContext]);

  console.log("context", context)

  const url = context?.extension?.config?.gistUrl || context?.extension?.autoConvertLink;

  useEffect(() => {
    if (url) {
      // Ensure the URL ends with .js for the gist script
      const scriptUrl = url.endsWith('.js') ? url : `${url}.js`;

      // Create and inject the GitHub gist script
      const script = document.createElement('script');
      script.src = scriptUrl;
      script.async = true;

      //<script src="https://gist.github.com/katagaki/e36a856aabf03dde2a66e7b20421701f.js"></script>

      // Clear any existing gist content
      const container = document.getElementById('gist-container');
      if (container) {
        container.innerHTML = '';
        container.appendChild(script);
      }
    }
  }, [url]);

  return (
    <div style={{ padding: '10px' }}>
      <div id="gist-container">{url}
        {/* GitHub gist will be injected here */}
      </div>
    </div>
  );
}

export default App;