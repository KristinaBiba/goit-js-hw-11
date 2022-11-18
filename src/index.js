import Notiflix from 'notiflix';

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

const MAIN_URL = 'https://pixabay.com/api/';
const KEY_API = '31406001-9559e1c679da811c7e2a75baf';
let keyword = '';
formEl.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();

  keyword = e.target.elements.searchQuery.value;

  findPhoto()
    .then(photos => {
      if (photos.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
          );
          createGallery(photos);
        console.log(photos);
      }
    })
    .catch(error => console.log);

    function createGallery(photosArray) {
        photosArray.map({webformatUR,largeImageURL,tags,likes,views,comments,downloads} => {
                  // <div class="photo-card">
    //   <img src="${webformatUR}" alt="${tags}" loading="lazy" />
    //   <div class="info">
    //     <p class="info-item">
    //       <b>Likes</b>${likes}
    //     </p>
    //     <p class="info-item">
    //       <b>Views</b>${views}
    //     </p>
    //     <p class="info-item">
    //       <b>Comments</b>${comments}
    //     </p>
    //     <p class="info-item">
    //       <b>Downloads</b>${downloads}
    //     </p>
    //   </div>
    // </div>;
      })

  }

  //   

  //   console.log(findPhoto());
}

const findPhoto = async () => {
  const response = await fetch(
    `${MAIN_URL}?key=${KEY_API}&q=${keyword}&image_type=photo&orientation=horizontal&safesearch=true`
  );
  const photos = await response.json();
  return photos.hits;
};
