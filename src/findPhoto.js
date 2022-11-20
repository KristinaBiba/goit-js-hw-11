const MAIN_URL = 'https://pixabay.com/api/';
const KEY_API = '31406001-9559e1c679da811c7e2a75baf';
const axios = require('axios').default;
const loadBtnEl = document.querySelector('.load-more');

export default async function findPhoto(keyword, currentPage) {
  loadBtnEl.classList.add('hidden');
  const response = await axios.get(`${MAIN_URL}`, {
    params: {
      key: KEY_API,
      q: keyword,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: currentPage,
    },
  });
  return response.data;
}
