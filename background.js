// Service worker for SmartGrind extension

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'debug') {
    // Debug logging removed for production
  }
  sendResponse({status: 'ok'});
});