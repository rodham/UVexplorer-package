# UVexplorer LucidChart Integration

## Overview
- This LucidChart extension imports network data from a UVexplorer server and generates a configurable network diagram within the LucidChart editor. 

## Depends On
- [lucid-extension-sdk](https://www.npmjs.com/package/lucid-extension-sdk)
- [lucid-package](https://www.npmjs.com/package/lucid-package)
- UvExplorerServer Rest API V1

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
   > **Note**
   > As of February 2024, the way lucid-package spins up the Angular app as a child process does not work on Windows systems.
   > 
   > One workaround for this issue is to change the name of the 'start' script in the control-panel's package.json to another name such as 'serve'. Then it will not be auto-detected, and can be run separately.
   >
   > We have spoken with Lucid about the need to better support development on Windows systems.

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

## Technical Blog Post
#### This is a draft of a technical blog post detailing the experience of building an integration for Lucid's marketplace
- [Link to Document](https://docs.google.com/document/d/1TTArW3etZ29cks0m_ZpEnttTc-yExpRJlKvg10EYeoA/edit?usp=sharing)

## Use Case Document
#### This is an attempt to document some of the logical & programmatic flows through common use-cases
- [Link to Document](https://docs.google.com/document/d/1hQIJcVTswCay3QhHjSc7OA-mq5yNKEcDoYUm88GxEts/edit?usp=sharing)

## Known defects
- When syncing a map with a manual layout and a dynamic filter, currently displayed devices are updated, but new devices matching the filter are not drawn.
- When adding/removing connected devices, the option for a dynamic device selection is available because the devices component is reused. This functionality does not work, and should be hidden or implemented.
- When the device label setting to show 'ip-address' is selected, the label is still displaying the 'host name'.
- When selecting devices, if you make selection changes, then switch to updating map settings, then return to device selection, your previous selection changes are reset.