import React from 'react';
import { Label, Select, Textfield, TextArea } from '@forge/react';
import { HIGHLIGHT_LANGUAGES, HIGHLIGHT_THEMES } from './languages';
import { useTranslate } from '../useTranslate';

const Config = () => {
  const { t } = useTranslate();
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
      <Label>{t('config.codeBlock.codeContent.label')}</Label>
      <TextArea
        name="codeContent"
        placeholder={t('config.codeBlock.codeContent.placeholder')}
        rows={10}
      />

      <Label>{t('config.language.label')}</Label>
      <Select
        name="language"
        defaultValue="javascript"
        options={languageOptions}
      />

      <Label>{t('config.codeBlock.title.label')}</Label>
      <Textfield
        name="title"
        placeholder={t('config.codeBlock.title.placeholder')}
      />

      <Label>{t('config.codeBlock.theme.label')}</Label>
      <Select
        name="theme"
        defaultValue="Github Gist"
        options={themeOptions}
      />
    </>
  );
};

export default Config;
