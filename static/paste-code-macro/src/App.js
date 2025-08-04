import React, { useState, useEffect, useRef } from 'react';
import { view } from '@forge/bridge';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // Default theme

function App() {
  const [config, setConfig] = useState({});
  const [macroBody, setMacroBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const codeRef = useRef(null);

  // Convert theme name to CSS-friendly format
  const convertThemeName = (themeName) => {
    return themeName.replace(/\s+/g, '-').toLowerCase();
  };

  // Load theme CSS dynamically
  const loadTheme = (themeName) => {
    // Remove existing theme stylesheets
    const existingThemes = document.querySelectorAll('link[data-theme]');
    existingThemes.forEach(link => link.remove());

    if (themeName && themeName !== 'Default') {
      const themeUrl = convertThemeName(themeName);
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${themeUrl}.min.css`;
      link.setAttribute('data-theme', themeUrl);
      document.head.appendChild(link);
    }
  };

  // Copy to clipboard functionality
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(macroBody);
      // Could add a toast notification here
      console.log('Code copied to clipboard');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  useEffect(() => {
    const loadMacroData = async () => {
      try {
        const context = await view.getContext();
        
        // Get configuration from context
        const macroConfig = context.extension?.config || {};
        setConfig(macroConfig);

        // Get macro body content (the code to display)
        // In Forge, get the macro body using view.getMacroBody()
        try {
          const macroBody = await view.getMacroBody();
          const codeContent = macroBody || '// No code content provided\n// Please add code to the macro body';
          setMacroBody(codeContent);
        } catch (err) {
          console.warn('Could not get macro body, using placeholder:', err);
          const codeContent = '// No code content provided\n// Please add code to the macro body';
          setMacroBody(codeContent);
        }

      } catch (err) {
        console.error('Error loading macro data:', err);
        setError(err.message || 'Failed to load macro data');
      } finally {
        setLoading(false);
      }
    };

    loadMacroData();
  }, []);

  useEffect(() => {
    // Apply syntax highlighting when content or language changes
    if (codeRef.current && macroBody) {
      const language = config.language || 'javascript';
      
      // Set the language class
      codeRef.current.className = `language-${language}`;
      codeRef.current.textContent = macroBody;
      
      // Apply highlighting
      hljs.highlightElement(codeRef.current);
    }
  }, [macroBody, config.language]);

  useEffect(() => {
    // Load theme when theme changes
    const theme = config.theme || 'Github Gist';
    loadTheme(theme);
  }, [config.theme]);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading code block...
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

  const title = config.title;
  const language = config.language || 'javascript';

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      margin: '10px 0'
    }}>
      <div style={{
        border: '1px solid #d1d9e0',
        borderRadius: '6px',
        overflow: 'hidden'
      }}>
        {title && (
          <div style={{
            backgroundColor: '#f6f8fa',
            padding: '10px 15px',
            borderBottom: '1px solid #d1d9e0',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {title}
          </div>
        )}
        
        <div style={{ position: 'relative' }}>
          <button
            onClick={copyToClipboard}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#f6f8fa',
              border: '1px solid #d1d9e0',
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '12px',
              cursor: 'pointer',
              zIndex: 1
            }}
            title="Copy to clipboard"
          >
            📋 Copy
          </button>
          
          <pre style={{ 
            margin: 0, 
            padding: '15px',
            paddingTop: '40px', // Make room for copy button
            overflow: 'auto',
            backgroundColor: '#f6f8fa'
          }}>
            <code 
              ref={codeRef}
              className={`language-${language}`}
              style={{
                fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                fontSize: '13px',
                lineHeight: '1.45'
              }}
            >
              {macroBody}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;