# Google Workspace AI Assistant
An intelligent Google Docs add-on that leverages Google's Gemini 2.0 to analyze documents and integrate with Google Chat for enhanced collaboration.

## Features
- 📊 Real-time document analysis using Gemini 2.0
- 💬 Google Chat integration for collaborative context
- 🎯 Smart summarization and insights
- 🔄 Seamless Google Workspace integration
- 🛡️ Secure OAuth authentication

## Prerequisites
Before you begin, ensure you have:

- A Google Workspace account 
- Access to Google Cloud Console 
- Google AI Studio API key 
- Google Chat API enabled (for chat integration features) 
- Google Apps Script editor access 

## Quick Start

1. Clone this repository:

`git clone https://github.com/hhermine/workspace-ai-assistant`

2. Set up your Google Cloud Project and enable required APIs:

- Google Chat API
- Google Docs API
- Google Apps Script API


3. Configure your Google AI Studio API key:

- Visit AI Studio
- Create a new API key
- Add it to your Apps Script project properties as `GOOGLE_AI_KEY`


4. Deploy the add-on:

- Open Google Apps Script editor
- Copy the contents of `Code.js`, `appsscript.json` and `sidebar.html`
- Deploy as a new deployment
- Configure OAuth consent screen
