import React from 'react';
import ReactDOM from 'react-dom';
import ForgeReconciler from '@forge/react';
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

ReactDOM.render(<App />, document.getElementById("root"));

ForgeReconciler.addConfig(<Config />);