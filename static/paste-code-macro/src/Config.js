import React from 'react';
import ForgeUI, { Form, Select, Option, TextField } from '@forge/ui';
import { HIGHLIGHT_LANGUAGES, HIGHLIGHT_THEMES } from './languages';

const Config = () => {
  const onSubmit = async (formData) => {
    return formData;
  };

  return (
    <Form onSubmit={onSubmit}>
      <Select name="language" label="Language" defaultValue="javascript">
        {HIGHLIGHT_LANGUAGES.map(language => (
          <Option key={language} label={language} value={language} />
        ))}
      </Select>
      <TextField 
        name="title" 
        label="Title" 
        placeholder="Optional title for your code block"
      />
      <Select name="theme" label="Theme" defaultValue="Github Gist">
        {HIGHLIGHT_THEMES.map(theme => (
          <Option key={theme} label={theme} value={theme} />
        ))}
      </Select>
    </Form>
  );
};

export default Config;