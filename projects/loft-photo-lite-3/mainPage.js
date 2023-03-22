import model from './model';

// const nav = document.querySelector('.nav');

// nav.addEventListener('click', (e) => {
//   e.preventDefault();
//   let goTo = 1;

//   const imgEl = document.querySelector('#img-el');

//   if (imgEl) {
//     if (e.target.classList.contains('nav_prev')) {

//     } else if (e.target.classList.contains('nav_next')) {

//     }
//   }
// });

export default {
  async getNextPhoto() {
    const { friend, id, photos } = await model.getNextPhoto();

    this.setFriendAndPhoto(friend, id, photos);
  },

  setFriendAndPhoto(friend, id, photos) {
    const imgContainer = document.querySelector('.component-photo');

    let startPhotoIndex = 0;

    const imgEl = document.createElement('img');

    try {
      const randomPhoto = photos[startPhotoIndex].sizes[4].url;
      imgEl.src = randomPhoto;
    } catch (error) {
      throw new Error(`У пользователя ${friend} нет фотографий`);
    }

    imgEl.alt = `Фото ${friend}`;
    imgEl.id = 'img-el';

    imgEl.addEventListener('click', () => {
      startPhotoIndex = startPhotoIndex + 1;

      if (photos[startPhotoIndex]) {
        imgEl.src = photos[startPhotoIndex].sizes[4].url;
      } else {
        startPhotoIndex = 0;
      }
    });

    imgContainer.appendChild(imgEl);
  },

  handleEvents() {},
};
