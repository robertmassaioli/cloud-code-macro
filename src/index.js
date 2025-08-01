import ForgeUI, { MacroConfig, Select, Option, render } from '@forge/ui';
import Resolver from '@forge/resolver';
import { MONACO_LANGUAGES } from '../static/hello-world/src/languages';

const resolver = new Resolver();

resolver.define('getText', (req) => {
  console.log(req);

  return 'Hello, world!';
});

export const handler = resolver.getDefinitions();

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

export const config = render(<Config />);
