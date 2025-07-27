const form = document.getElementById('add-website-form');
const nameInput = document.getElementById('website-name');
const urlInput = document.getElementById('website-url');
const websiteList = document.getElementById('website-list');

function renderWebsites(websites) {
  websiteList.innerHTML = '';
  websites.forEach((website, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${website.name}</span>
      <button class="delete-btn" data-index="${index}">Delete</button>
    `;
    websiteList.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newWebsite = {
    name: nameInput.value,
    url: urlInput.value,
  };
  chrome.storage.sync.get({ websites: [] }, (data) => {
    const websites = data.websites;
    websites.push(newWebsite);
    chrome.storage.sync.set({ websites }, () => {
      renderWebsites(websites);
      form.reset();
    });
  });
});

websiteList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.dataset.index;
    chrome.storage.sync.get({ websites: [] }, (data) => {
      const websites = data.websites;
      websites.splice(index, 1);
      chrome.storage.sync.set({ websites }, () => {
        renderWebsites(websites);
      });
    });
  }
});

chrome.storage.sync.get({ websites: [] }, (data) => {
  renderWebsites(data.websites);
});
