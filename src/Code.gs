function onOpen() {
  DocumentApp.getUi()
    .createMenu('AI Assistant')
    .addItem('Open Assistant', 'showSidebar')
    .addToUi();
}

function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('AI Assistant');
  DocumentApp.getUi().showSidebar(html);
}

const AI_CONFIG = {
  API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
};

function callGeminiAI(prompt) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GOOGLE_AI_KEY');
  
  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(requestBody),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(
      `${AI_CONFIG.API_ENDPOINT}?key=${apiKey}`, 
      options
    );
    return JSON.parse(response.getContentText());
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// function analyzeDocument() {
//   const doc = DocumentApp.getActiveDocument();
//   const text = doc.getBody().getText();
  
//   const prompt = `Analyze this document and provide key insights:\n\n${text}`;
//   const analysis = callGeminiAI(prompt);
  
//   if (analysis?.candidates?.[0]?.content?.parts?.[0]?.text) {
//     return analysis.candidates[0].content.parts[0].text;
//   }
//   return 'No analysis results available.';
// }

function analyzeBoth() {
  const doc = DocumentApp.getActiveDocument();
  const text = doc.getBody().getText();
  
  // Get chat messages
  const chatService = new SimpleChatService();
  const messages = chatService.getMessages();
  
  // Analyze document with context from chat
  const prompt = `
    Analyze this document and find connections with chat messages:
    
    Document content:
    ${text}
    
    Recent chat messages:
    ${messages.map(m => m.text).join('\n')}
    
    Please provide:
    1. Document analysis
    2. Related discussions from chat
  `;
  
  const analysis = callGeminiAI(prompt);
  
  if (analysis?.candidates?.[0]?.content?.parts?.[0]?.text) {
    const fullAnalysis = analysis.candidates[0].content.parts[0].text;
    
    // Split analysis into document and chat sections
    const sections = fullAnalysis.split(/(?=\d\.)/);
    
    return {
      analysis: sections[1] || 'No analysis available',
      chatUpdates: sections[2] || 'No relevant chat updates found'
    };
  }
  
  return {
    analysis: 'Analysis failed',
    chatUpdates: 'Could not process chat updates'
  };
}

class SimpleChatService {
  constructor() {
    const rawSpaceId = PropertiesService.getScriptProperties().getProperty('SPACE_ID');
    this.spaceId = this.formatSpaceId(rawSpaceId);
  }

  formatSpaceId(id) {
    if (!id) throw new Error('Space ID not found in properties');
    return id.startsWith('spaces/') ? id : `spaces/${id}`;
  }

  getMessages() {
    try {
      // Using built-in OAuth2 - no GCP project needed
      const token = ScriptApp.getOAuthToken();
      
      const endpoint = `https://chat.googleapis.com/v1/${this.spaceId}/messages`;
      const options = {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        muteHttpExceptions: true
      };

      const response = UrlFetchApp.fetch(endpoint, options);
      
      if (response.getResponseCode() === 200) {
        const data = JSON.parse(response.getContentText());
        return this.processMessages(data.messages || []);
      }

      console.error('Chat API response:', response.getContentText());
      return [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  processMessages(messages) {
    return messages.map(msg => ({
      text: msg.text || '',
      sender: msg.sender?.displayName || 'Unknown',
      createTime: new Date(msg.createTime).toLocaleString()
    }));
  }
}

function testChatConnection() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const spaceId = scriptProperties.getProperty('SPACE_ID');
  
  console.log('Current Space ID:', spaceId);
  
  const chatService = new SimpleChatService();
  const messages = chatService.getMessages();
  
  console.log('Messages retrieved:', messages.length);
  
  return messages;
}
