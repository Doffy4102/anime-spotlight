import { searchAnime, getStreamingLinks } from '../api/jikan-api.js';

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["ui/spotlight.js"],
  });
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "_execute_action") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["ui/spotlight.js"],
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'searchAnime') {
    searchAnime(request.query).then(sendResponse);
    return true; // Indicates that the response is sent asynchronously
  } else if (request.type === 'getStreamingLinks') {
    getStreamingLinks(request.animeId).then(sendResponse);
    return true; // Indicates that the response is sent asynchronously
  }
});