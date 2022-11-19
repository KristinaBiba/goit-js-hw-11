import Notiflix from 'notiflix';
import SimpleLightbox from '../node_modules/simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios').default;

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadBtnEl = document.querySelector('.load-more');

const MAIN_URL = 'https://pixabay.com/api/';
const KEY_API = '31406001-9559e1c679da811c7e2a75baf';
let keyword = '';
let currentPage = 0;
formEl.addEventListener('submit', onSubmit);
loadBtnEl.addEventListener('click', onLoadPhoto);

function onSubmit(e) {
  e.preventDefault();
  galleryEl.innerHTML = '';
  currentPage = 0;
  keyword = e.target.elements.searchQuery.value;
  onLoadPhoto();

  // console.log(keyword);
}
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

  galleryEl.insertAdjacentHTML('beforeend', photoObject);
  const gallery = new SimpleLightbox('.gallery a');
}

function onLoadPhoto() {
  currentPage += 1;

  findPhoto()
    .then(photos => {
      createGallery(photos);
    })
    .catch(error => console.log);
  if (currentPage > 1) {
    const { height: cardHeight } =
      galleryEl.lastElementChild.getBoundingClientRect();
    window.scrollBy(0, cardHeight * 2);
    // {
    //   top: cardHeight * 2,
    //   behavior: 'smooth',
    // }
  }
}

async function findPhoto() {
  loadBtnEl.classList.add('hidden');

  try {
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
    if (response.data.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (currentPage === 1) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
    }

    if (currentPage * 40 > response.data.totalHits) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      return response.data.hits;
    }

    loadBtnEl.classList.remove('hidden');
    return response.data.hits;
  } catch (error) {
    console.error(error);
  }
}
