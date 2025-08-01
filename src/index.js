import ForgeUI, { MacroConfig, Select, Option, TextField, render, Macro, Text, Code, useConfig } from '@forge/ui';
import Resolver from '@forge/resolver';
import { MONACO_LANGUAGES } from '../static/hello-world/src/languages';
import { handler as bitbucketSnippetHandler } from './bitbucket-snippet-resolver';

// Main resolver for the existing code editor functionality
const mainResolver = new Resolver();

mainResolver.define('getText', (req) => {
  console.log(req);

  return 'Hello, world!';
});

// Export separate handlers for different functions
export const handler = mainResolver.getDefinitions();
export const fetchSnippetData = bitbucketSnippetHandler.fetchSnippetData;

const Config = () => {
  return (
    <MacroConfig>
      {/* Form components */}
      <Select name="language" label="Language">
        {MONACO_LANGUAGES.map(language => (
          <Option label={language} value={language} />
        ))}
      </Select>
    </MacroConfig>
  );
};

const BitbucketSnippetConfig = () => {
  const config = useConfig();
  
  // Get the autoconvert URL if available, otherwise use empty string
  const defaultUrl = config?.autoConvertLink || '';
  
  return (
    <MacroConfig>
      <TextField 
        name="snippetUrl" 
        label="Snippet URL" 
        placeholder="https://bitbucket.org/snippets/username/snippet_id"
        defaultValue={defaultUrl}
      />
    </MacroConfig>
  );
};

export const config = render(<Config />);
export const bitbucketSnippetConfig = render(<BitbucketSnippetConfig />);
