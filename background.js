// Service worker for SmartGrind extension
console.log('SmartGrind background script loaded');

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('SmartGrind: Received message', message);
  if (message.type === 'debug') {
    console.log('SmartGrind Debug:', ...message.data);
  }
  sendResponse({status: 'ok'});
});

// Periodic logging for debugging
setInterval(() => {
  console.log('SmartGrind: Background script active');
}, 60000); // Log every minute