import React from "react";
import { Label, Textfield } from "@forge/react";
import { useTranslate } from "../useTranslate";

const Config = () => {
  const { t } = useTranslate();
  return (
    <>
      <Label>{t('config.gist.url.label')}</Label>
      <Textfield
        name="gistUrl"
        placeholder="https://gist.github.com/username/gist_id"
      />
    </>
  );
};

export default Config;
