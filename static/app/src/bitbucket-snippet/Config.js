import React from "react";
import { Label, Textfield } from "@forge/react";
import { useTranslate } from "../useTranslate";

const Config = () => {
  const { t } = useTranslate();
  return (
    <>
      <Label>{t('config.bitbucketSnippet.url.label')}</Label>
      <Textfield
        name="snippetUrl"
        placeholder="https://bitbucket.org/{workspace}/workspace/snippets/{snippet_id}/title"
      />
    </>
  );
};

export default Config;
