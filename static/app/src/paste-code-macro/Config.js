import React from 'react';
import { Label, Select, Textfield, TextArea } from '@forge/react';
import { HIGHLIGHT_LANGUAGES, HIGHLIGHT_THEMES } from './languages';

const Config = () => {
  // Transform arrays into options format for Forge UI Kit Select component
  const languageOptions = HIGHLIGHT_LANGUAGES.map(language => ({
    label: language,
    value: language
  }));

  const themeOptions = Object.keys(HIGHLIGHT_THEMES).map(theme => ({
    label: theme,
    value: theme
  }));

  return (
    <>
      <Label>Code Content</Label>
      <TextArea
        name="codeContent"
        placeholder="Paste your code here..."
        rows={10}
      />

      <Label>Language</Label>
      <Select
        name="language"
        defaultValue="javascript"
        options={languageOptions}
      />

      <Label>Title</Label>
      <Textfield
        name="title"
        placeholder="Optional title for your code block"
      />

      <Label>Theme</Label>
      <Select
        name="theme"
        defaultValue="Github Gist"
        options={themeOptions}
      />
    </>
  );
};

export default Config;
