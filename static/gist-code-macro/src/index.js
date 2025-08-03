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
        name="gistUrl" 
        label="Gist URL" 
        placeholder="https://gist.github.com/username/gist_id"
      />
    </Form>
  );
};

ForgeReconciler.render(<App />);

ForgeReconciler.addConfig(<Config />);