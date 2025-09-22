import React from 'react';
import { ForgeReconciler } from '@forge/bridge';
import ForgeUI, { Form, Select, Option } from '@forge/ui';
import App from './App';
import { MONACO_LANGUAGES } from './languages';

import '@atlaskit/css-reset';

const Config = () => {
  const onSubmit = async (formData) => {
    return formData;
  };

  return (
    <Form onSubmit={onSubmit}>
      <Select name="language" label="Language" defaultValue="javascript">
        {MONACO_LANGUAGES.map(language => (
          <Option key={language} label={language} value={language} />
        ))}
      </Select>
    </Form>
  );
};

ForgeReconciler.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

ForgeReconciler.addConfig(<Config />);
