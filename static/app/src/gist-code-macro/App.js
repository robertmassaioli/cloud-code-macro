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

  const url = (context?.extension?.config?.gistUrl && context?.extension?.config?.gistUrl.trim()) || context?.extension?.autoConvertLink;

  useEffect(() => {
    if (url) {
      // Ensure the URL ends with .js for the gist script
      const scriptUrl = url.endsWith('.js') ? url : `${url}.js`;

      const container = document.getElementById('gist-container');
      if (container) {
        // Clear any existing gist content
        container.innerHTML = '';

        // Override document.write to capture gist output
        const originalWrite = document.write;
        const originalWriteln = document.writeln;

        document.write = function(content) {
          container.innerHTML += content;
        };

        document.writeln = function(content) {
          container.innerHTML += content + '\n';
        };

        // Create and inject the GitHub gist script
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;

        script.onload = () => {
          // Restore original document.write methods
          document.write = originalWrite;
          document.writeln = originalWriteln;
        };

        script.onerror = () => {
          // Restore original document.write methods on error
          document.write = originalWrite;
          document.writeln = originalWriteln;
          container.innerHTML = '<div style="color: red; padding: 10px;">Error loading gist</div>';
        };

        document.head.appendChild(script);
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
