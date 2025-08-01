import React from 'react';
import { ForgeReconciler } from '@forge/bridge';
import ForgeUI, { Form, TextField } from '@forge/ui';
import App from './App';

const Config = () => {
  const onSubmit = async (formData) => {
    return formData;
  };

  return (
    <Form onSubmit={onSubmit}>
      <TextField 
        name="snippetUrl" 
        label="Snippet URL" 
        placeholder="https://bitbucket.org/snippets/username/snippet_id"
      />
    </Form>
  );
};

ForgeReconciler.render(<App />);

ForgeReconciler.addConfig(<Config />);