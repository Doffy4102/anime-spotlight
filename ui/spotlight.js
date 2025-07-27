if (document.getElementById('anime-spotlight-container')) {
  document.getElementById('anime-spotlight-container').remove();
  document.getElementById('anime-spotlight-backdrop').remove();
} else {
  fetch(chrome.runtime.getURL('ui/spotlight.html'))
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('beforeend', data);
      const searchInput = document.getElementById('anime-search-input');
      const resultsList = document.getElementById('anime-results-list');
      const spotlightContainer = document.getElementById('anime-spotlight-container');
      const spotlightBackdrop = document.getElementById('anime-spotlight-backdrop');
      const closeButton = document.getElementById('close-spotlight');

      const closeSpotlight = () => {
        spotlightContainer.remove();
        spotlightBackdrop.remove();
      };

      closeButton.addEventListener('click', closeSpotlight);

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeSpotlight();
        }
      });

      let debounceTimer;

      searchInput.addEventListener('keyup', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const query = searchInput.value;
          if (query.length > 2) {
            chrome.runtime.sendMessage({ type: 'searchAnime', query }, (response) => {
              resultsList.innerHTML = '';
              response.forEach(anime => {
                const item = document.createElement('div');
                item.classList.add('anime-result-item');
                item.innerHTML = `
                  <div class="anime-result-item-main">
                    <img src="${anime.images.jpg.image_url}">
                    <div class="anime-result-item-info">
                      <h3>${anime.title}</h3>
                      <p>${anime.synopsis ? anime.synopsis.substring(0, 100) + '...' : ''}</p>
                    </div>
                  </div>
                `;
                item.addEventListener('click', () => {
                  createModal(anime);
                });
                resultsList.appendChild(item);
              });
            });
          }
        }, 300);
      });
    });

  fetch(chrome.runtime.getURL('ui/spotlight.css'))
    .then(response => response.text())
    .then(data => {
      const style = document.createElement('style');
      style.textContent = data;
      document.head.appendChild(style);
    });
}

function createModal(anime) {
  const modalBackdrop = document.createElement('div');
  modalBackdrop.id = 'anime-modal-backdrop';
  const modal = document.createElement('div');
  modal.id = 'anime-modal';

  modal.innerHTML = `
    <div class="modal-header">
      <h2>${anime.title}</h2>
      <button id="close-modal">&times;</button>
    </div>
    <div class="modal-content">
      <img src="${anime.images.jpg.large_image_url}">
      <div class="modal-info">
        <p><strong>Score:</strong> ${anime.score}</p>
        <p><strong>Episodes:</strong> ${anime.episodes}</p>
        <p>${anime.synopsis}</p>
        <div id="streaming-links"></div>
      </div>
    </div>
  `;

  document.body.appendChild(modalBackdrop);
  document.body.appendChild(modal);

  const streamingLinksContainer = modal.querySelector('#streaming-links');

  const defaultWebsites = [
    {
      name: 'hianime.to',
      url: 'https://hianime.to/search?keyword=%s'
    }
  ];

  chrome.runtime.sendMessage({ type: 'getStreamingLinks', animeId: anime.mal_id }, (streamingData) => {
    chrome.storage.sync.get({ websites: [] }, (data) => {
      const allLinks = [];
      streamingData.forEach(link => allLinks.push({ name: link.name, url: link.url }));
      
      defaultWebsites.forEach(website => {
        const searchUrl = website.url.replace('%s', encodeURIComponent(anime.title));
        allLinks.push({ name: website.name, url: searchUrl });
      });

      data.websites.forEach(website => {
        if (!allLinks.some(l => l.name === website.name)) {
            const searchUrl = website.url.replace('%s', encodeURIComponent(anime.title));
            allLinks.push({ name: website.name, url: searchUrl });
        }
      });

      if (allLinks.length > 0) {
        const linksHtml = allLinks.map(link => `<a href="${link.url}" target="_blank" class="streaming-link">${link.name}</a>`).join('');
        streamingLinksContainer.innerHTML = `<strong>Watch on:</strong> ${linksHtml}`;
      } else {
        streamingLinksContainer.innerHTML = '<strong>No streaming links found.</strong>';
      }
    });
  });

  modal.querySelector('#close-modal').addEventListener('click', () => {
    modal.remove();
    modalBackdrop.remove();
  });

  modalBackdrop.addEventListener('click', () => {
    modal.remove();
    modalBackdrop.remove();
  });
}