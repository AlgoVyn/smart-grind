// Service worker for SmartGrind extension

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse({status: 'ok'});
});