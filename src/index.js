import ForgeUI, { Macro, Text } from '@forge/ui';
import Resolver from '@forge/resolver';
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

