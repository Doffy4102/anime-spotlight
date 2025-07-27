export async function searchAnime(query) {
  const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=10`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.data;
}

export async function getStreamingLinks(animeId) {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/streaming`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data.data;
}
