import ForgeUI, { MacroConfig, Select, Option, TextField, render } from '@forge/ui';
import Resolver from '@forge/resolver';
import { MONACO_LANGUAGES } from '../static/hello-world/src/languages';
import { handler as bitbucketSnippetHandler } from './bitbucket-snippet-resolver';

const resolver = new Resolver();

resolver.define('getText', (req) => {
  console.log(req);

  return 'Hello, world!';
});

// Merge the bitbucket snippet resolver handlers
const combinedHandlers = {
  ...resolver.getDefinitions(),
  ...bitbucketSnippetHandler
};

export const handler = combinedHandlers;

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
  return (
    <MacroConfig>
      <TextField name="snippetUrl" label="Snippet URL" placeholder="https://bitbucket.org/snippets/username/snippet_id" />
    </MacroConfig>
  );
};

export const config = render(<Config />);
export const bitbucketSnippetConfig = render(<BitbucketSnippetConfig />);
