import Notiflix from 'notiflix';
import SimpleLightbox from '../node_modules/simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import findPhoto from './findPhoto';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadBtnEl = document.querySelector('.load-more');

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
}

async function onLoadPhoto() {
  currentPage += 1;
  try {
    const photos = await findPhoto(keyword, currentPage);
    if (photos.totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    if (currentPage === 1) {
      Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
    }

    if (currentPage * 40 > photos.totalHits) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      loadBtnEl.classList.remove('hidden');
    }
    createGallery(photos.hits);
  } catch (error) {
    console.log;
  }
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

  if (currentPage > 1) {
    smoothScrolling();
  }

  const gallery = new SimpleLightbox('.gallery a');
}

function smoothScrolling() {
  const { height: cardHeight } =
    galleryEl.lastElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
