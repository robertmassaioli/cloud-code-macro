import React from 'react';
import { Label, Select } from '@forge/react';
import { MONACO_LANGUAGES } from './languages';

const Config = () => {
  // Transform array into options format for Forge UI Kit Select component
  const languageOptions = MONACO_LANGUAGES.map(language => ({
    label: language,
    value: language
  }));

  return (
    <>
      <Label>Language</Label>
      <Select 
        name="language" 
        defaultValue="javascript"
        options={languageOptions}
      />
    </>
  );
};

export default Config;