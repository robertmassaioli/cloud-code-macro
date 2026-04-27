import React from "react";
import { Label, Textfield } from "@forge/react";

const Config = () => {
  return (
    <>
      <Label>Snippet URL</Label>
      <Textfield
        name="snippetUrl"
        placeholder="https://bitbucket.org/{workspace}/workspace/snippets/{snippet_id}/title"
      />
    </>
  );
};

export default Config;
