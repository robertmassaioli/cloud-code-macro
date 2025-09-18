import React from 'react';

const Config = () => {
  const onSubmit = async (formData) => {
    return formData;
  };

  return (
    <>
      <label htmlFor="snippetUrl">Snippet URL</label>
      <input
        id="snippetUrl"
        name="snippetUrl"
        type="text"
        placeholder="https://bitbucket.org/snippets/username/snippet_id"
        style={{ 
          width: '100%', 
          padding: '8px', 
          margin: '4px 0',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
    </>
  );
};

export default Config;