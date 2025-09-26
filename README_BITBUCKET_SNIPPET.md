# Bitbucket Snippet Forge Module

This document describes the new Bitbucket Snippet Forge module that replicates the functionality of the existing Connect module.

## Overview

The Bitbucket Snippet Forge module allows users to embed Bitbucket code snippets directly into Confluence pages. It provides the same functionality as the existing Connect module but uses Forge architecture.

## Features

- **Automatic URL Detection**: Automatically converts Bitbucket snippet URLs into embedded macros
- **Multiple File Support**: Displays all files within a snippet
- **Syntax Highlighting**: Code is displayed with proper formatting
- **Responsive Design**: Works well on different screen sizes
- **Error Handling**: Graceful error handling for invalid URLs or network issues

## Architecture

### Components

1. **Forge Resolver** (`src/bitbucket-snippet-resolver.js`)
   - Handles API calls to Bitbucket's REST API
   - Fetches snippet metadata and file contents
   - Provides error handling and data transformation

2. **React Frontend** (`static/bitbucket-snippet/src/`)
   - Displays the snippet data in a user-friendly format
   - Handles loading states and error messages
   - Styled to match Atlassian design guidelines

3. **Configuration** 
   - Manifest configuration for the macro
   - Autoconvert patterns for URL detection
   - Resource definitions for the static assets

### API Integration

The module uses Bitbucket's API v2.0:
- **Snippet Metadata**: `https://api.bitbucket.org/2.0/snippets/{username}/{snippet_id}`
- **File Contents**: Individual file URLs from the snippet metadata

### Supported URL Patterns

- `https://bitbucket.org/snippets/{username}/{snippet_id}`
- `https://bitbucket.org/snippets/{username}/{snippet_id}/{revision}`

## Installation & Development

### Prerequisites

- Node.js and npm
- Forge CLI
- dhall-to-yaml-ng (for manifest generation)

### Setup

1. Install dependencies:
   ```bash
   npm install
   cd static/bitbucket-snippet && npm install
   ```

2. Build the React app:
   ```bash
   npm run build:bitbucket-snippet
   ```

3. Generate manifest and deploy:
   ```bash
   npm run deploy:local
   ```

### Development Workflow

1. Make changes to the React app in `static/bitbucket-snippet/src/`
2. Build the app: `npm run build:bitbucket-snippet`
3. Deploy: `npm run deploy:local`

## Usage

### Manual Insertion

1. Insert a macro in Confluence
2. Search for "Bitbucket Snippet (Forge)"
3. Enter the Bitbucket snippet URL
4. Save the page

### Automatic Conversion

Simply paste a Bitbucket snippet URL into a Confluence page, and it will automatically be converted to the macro.

## Differences from Connect Module

### Advantages of Forge Version

- **Better Security**: Runs in Atlassian's secure environment
- **Improved Performance**: Better caching and resource management
- **Modern Architecture**: Uses React and modern web technologies
- **Easier Maintenance**: Simplified deployment and updates

### Technical Differences

- Uses Forge's `@forge/api` instead of direct HTTP calls
- React-based frontend instead of Mustache templates
- Integrated with Forge's configuration system
- Uses Forge's resource system for static assets

## Error Handling

The module includes comprehensive error handling:

- **Invalid URLs**: Clear error messages for malformed URLs
- **Network Issues**: Graceful handling of API failures
- **Missing Content**: Fallback content for files that can't be loaded
- **Rate Limiting**: Proper handling of API rate limits

## Future Enhancements

Potential improvements for future versions:

1. **Caching**: Implement caching for better performance
2. **Syntax Highlighting**: Add proper syntax highlighting for different languages
3. **Theme Support**: Multiple color themes for code display
4. **Line Numbers**: Optional line number display
5. **Copy to Clipboard**: Easy copying of code snippets

## Troubleshooting

### Common Issues

1. **Snippet not loading**: Check if the URL is valid and publicly accessible
2. **Build failures**: Ensure all dependencies are installed
3. **Deployment issues**: Verify Forge CLI is properly configured

### Debug Mode

Enable debug logging by setting environment variables in the Forge app configuration.