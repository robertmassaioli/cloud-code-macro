import React from "react";
import { Label, Textfield } from "@forge/react";

const Config = () => {
  return (
    <>
      <Label>Gist URL</Label>
      <Textfield
        name="gistUrl"
        placeholder="https://gist.github.com/username/gist_id"
      />
    </>
  );
};

export default Config;
