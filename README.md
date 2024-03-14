# UVexplorer LucidChart Integration

## Overview
- This LucidChart extension imports network data from a UVexplorer server and generates a configurable network diagram within the LucidChart editor. 

## Prerequisites to run
- An enterprise level Lucid account
- An active UVexplorer server

## How to Run Locally
1. Create a .env file in the editorextensions/UVexplorer-integration directory with these two values:

| variable          | value                        |
|-------------------|------------------------------|
| UVX_API_KEY       | (Your UVexplorer API key)    |
| UVX_BASE_URL      | (Your UVexplorer server URL) |

2. Inside the root directory, run:
   ```shell
   npm run test-editor-extension
   ```
   This should automatically detect and start the Angular UI server as well as bundle/run the extension server.


3. Unlock developer tools on your Lucid account by following the instructions [here](https://developer.lucid.co/guides/#unlocking-developer-tools).


4. You can then enable loading of your local code in the Developer menu in Lucidchart by clicking "Load local extension". The page will refresh and your editor extension code will run.
   > **Note**
   > "Load local extension" is not supported in Safari.

## How to Test/Lint Locally

1. Inside the editorextensions/UVexplorer-integration directory, run:
   ```shell
   npm run lint
   npm run test
   ```

## How to Deploy
   TBD

## Architectural Overview
[Link to Diagram](https://lucid.app/lucidchart/c9caa411-c85a-41bd-961e-63756b18271d/edit?invitationId=inv_8606bdfe-aec2-41dd-a096-781a7a78c1aa&page=0_0#)

## Relevant Dependencies & Documentation
 - [lucid-extension-sdk](https://www.npmjs.com/package/lucid-extension-sdk)
 - UVexplorer API
