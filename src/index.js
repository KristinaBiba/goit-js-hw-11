import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
const axios = require('axios').default;

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

const MAIN_URL = 'https://pixabay.com/api/';
const KEY_API = '31406001-9559e1c679da811c7e2a75baf';
let keyword = '';
formEl.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  galleryEl.innerHTML = '';
  keyword = e.target.elements.searchQuery.value;
  // console.log(keyword);
  findPhoto()
    .then(photos => {
      if (photos.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      console.log(photos);
      createGallery(photos);
    })
    .catch(error => console.log);

  function createGallery(photosArray) {
    const photoObject = photosArray
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => `<a class="photo-card" href=${largeImageURL}>
          <img src=${webformatURL} alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${downloads}
            </p>
          </div>
        </a>`
      )
      .join('');
    galleryEl.innerHTML = photoObject;
    console.log(photoObject);
  }
}
const findPhoto = async () => {
  try {
    const response = await axios.get(`${MAIN_URL}`, {
      params: {
        key: KEY_API,
        q: keyword,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
      },
    });
    return response.data.hits;
  } catch (error) {
    console.error(error);
  }
  // const response = await fetch(
  //   `${MAIN_URL}?key=${KEY_API}&q=${keyword}&image_type=photo&orientation=horizontal&safesearch=true`
  // );
  // const photos = await response.json();
  // console.log(photos);
  // return photos.hits;
};
