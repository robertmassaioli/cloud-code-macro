import React, { useState, useEffect, useRef } from 'react';
import { useConfig } from '@forge/react';
import hljs from 'highlight.js';
import { HIGHLIGHT_THEMES } from './languages';
// Default theme will be loaded dynamically

function App() {
  // Use Forge UI Kit hook to get macro configuration
  // https://developer.atlassian.com/platform/forge/ui-kit/hooks/use-config/
  const config = useConfig() || {};
  const [macroBody, setMacroBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const codeRef = useRef(null);

  // HIGHLIGHT_THEMES is now a map from human names to filenames
  const themeMapping = HIGHLIGHT_THEMES;

  // Load theme CSS dynamically
  const loadTheme = (themeName) => {
    // Remove existing theme stylesheets
    const existingThemes = document.querySelectorAll('link[data-theme]');
    existingThemes.forEach(link => link.remove());

    if (themeName && themeName !== 'Default') {
      const themeConfig = themeMapping[themeName] || themeMapping['GitHub'];
      console.log('Loading theme:', themeName, '→', themeConfig.themeName);

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = themeConfig.themeUrl;
      link.setAttribute('data-theme', themeConfig.themeName);

      // Add error handling
      link.onerror = () => {
        console.error('Failed to load theme:', themeConfig.themeName);
        // Fallback to GitHub theme
        if (themeConfig.themeName !== 'github') {
          const fallbackTheme = themeMapping['GitHub'];
          const fallbackLink = document.createElement('link');
          fallbackLink.rel = 'stylesheet';
          fallbackLink.href = fallbackTheme.themeUrl;
          fallbackLink.setAttribute('data-theme', fallbackTheme.themeName);
          document.head.appendChild(fallbackLink);
        }
      };
      link.onload = () => console.log('Theme loaded successfully:', themeConfig.themeName);

      document.head.appendChild(link);
    }
  };

  // Copy to clipboard functionality
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(macroBody);
      console.log('Code copied to clipboard');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  useEffect(() => {
    const loadMacroData = () => {
      try {
        // In Forge, get the macro body content from config
        // Priority: codeContent (new Forge macros) -> __bodyContent (migrated Connect macros) -> fallback
        const codeContent = config.codeContent || config.__bodyContent || '// No code content provided\n// Please add code content in the macro configuration';
        setMacroBody(codeContent);
      } catch (err) {
        console.error('Error loading macro data:', err);
        setError(err.message || 'Failed to load macro data');
      } finally {
        setLoading(false);
      }
    };

    loadMacroData();
  }, [config]);

  useEffect(() => {
    // Apply syntax highlighting when content or language changes
    if (codeRef.current && macroBody) {
      const language = config.language || 'javascript';

      // Clear existing content and classes
      codeRef.current.className = '';
      codeRef.current.removeAttribute('data-highlighted');

      // Set the language class and content (include hljs class for theme support)
      codeRef.current.className = `language-${language} hljs`;
      codeRef.current.textContent = macroBody;

      // Configure highlight.js for this element
      hljs.configure({
        ignoreUnescapedHTML: true,
        classPrefix: 'hljs-'
      });

      // Apply highlighting
      try {
        hljs.highlightElement(codeRef.current);
        console.log('Code highlighted successfully with language:', language);
      } catch (error) {
        console.error('Error highlighting code:', error);
        // Fallback: try auto-detection
        try {
          const result = hljs.highlightAuto(macroBody);
          codeRef.current.innerHTML = result.value;
          codeRef.current.className = `hljs ${result.language ? 'language-' + result.language : ''}`;
          console.log('Code highlighted with auto-detection:', result.language);
        } catch (autoError) {
          console.error('Auto-detection also failed:', autoError);
        }
      }
    }
  }, [macroBody, config.language]);

  useEffect(() => {
    // Load theme when theme changes
    const theme = config.theme || 'GitHub';
    loadTheme(theme);
  }, [config.theme]);

  // Load default theme on initial render
  useEffect(() => {
    if (!config.theme) {
      loadTheme('GitHub');
    }
  }, []);

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
        overflow: 'hidden'
      }}>
        {title && (
          <div style={{
            backgroundColor: '#f6f8fa',
            padding: '10px 15px',
            borderBottom: '1px solid #d1d9e0',
            fontWeight: 'bold',
            fontSize: '14px',
            color: 'black',
            borderTopLeftRadius: '6px',
            borderTopRightRadius: '6px'
          }}>
            {title}
          </div>
        )}

        <div style={{
          position: 'relative',
          border: '1px solid #d1d9e0',
          borderRadius: title ? '0 0 6px 6px' : '6px'
        }}>
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

          <pre className="hljs" style={{
            margin: 0,
            overflow: 'auto',
            borderBottomLeftRadius: '6px',
            borderBottomRightRadius: '6px',
            borderTopLeftRadius: title ? '0' : '6px',
            borderTopRightRadius: title ? '0' : '6px',
            minHeight: '52px'
          }}>
            <code
              ref={codeRef}
              className={`language-${language} hljs`}
              style={{
                fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
                fontSize: '13px',
                lineHeight: '1.45',
                display: 'block',
                padding: '10px',
                margin: 0
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
