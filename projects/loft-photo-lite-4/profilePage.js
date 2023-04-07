import model from './model';
import mainPage from './mainPage';
import pages from './pages';

export default {
  async setUser(user) {},

  createImgEl(id, url) {
    const imgEl = document.createElement('div');

    imgEl.friendId = id;
    imgEl.style.backgroundImage = `url('${url}')`;

    imgEl.classList.add('component-user-photo');

    imgEl.addEventListener('click', () => {
      pages.openPage('main');
      document.querySelector('.component-photo').style.backgroundImage = `url('${url}')`;
    });

    return imgEl;
  },

  async addFriendInfo(id) {
    const userInfoPhotoComp = document.querySelector('.component-user-info-photo');
    const userInfoNameComp = document.querySelector('.component-user-info-name');

    // Получаем друга, если есть id
    // Если id нет, значит получаем значения пользователя
    let friend = null;
    if (id) {
      friend = model.friends.items.filter((friend) => {
        if (friend.id == id) {
          return friend;
        }
      });

      friend = friend[0];
    } else {
      friend = await model.getUsers();
    }

    userInfoPhotoComp.style.backgroundImage = `url('${friend.photo_50}}')`;
    userInfoNameComp.textContent = `${friend.first_name} ${friend.last_name}`;
  },

  handleEvents() {
    const userPhotosComp = document.querySelector('.component-user-photos');

    document.addEventListener('click', async (e) => {
      e.preventDefault();

      // как побороть мисслик?
      if (e.target.classList.contains('component-header-profile-link')) {
        userPhotosComp.textContent = '';

        const href = e.target.getAttribute('href');
        const id = href.slice(1, href.length);

        pages.openPage('profile');

        // устанавливаем аватарку и фио
        this.addFriendInfo(id);

        // Получаем фотографии
        this.photos = await model.getPhotos(id);

        this.photos = this.photos.map((photo) => {
          return model.findSize(photo);
        });

        // Добавляем фотографии
        this.photos.forEach((photo) => {
          const imgEl = this.createImgEl(id, photo.url);

          userPhotosComp.appendChild(imgEl);
        });
      }
    });

    document.querySelector('.page-profile-back').addEventListener('click', async () => {
      pages.openPage('main');
    });

    document.querySelector('.page-profile-exit').addEventListener('click', async () => {
      //   await model.logout();
      pages.openPage('login');
    });

    // Клик на иконку залогиненного пользователя
    document
      .querySelector('.component-footer-photo')
      .addEventListener('click', async (e) => {
        const id = e.target.id;
        pages.openPage('profile');

        // устанавливаем аватарку и фио
        this.addFriendInfo();

        // Получаем фотографии
        this.photos = await model.getPhotos(id);

        this.photos = this.photos.map((photo) => {
          return model.findSize(photo);
        });

        console.log('this.photos');
        console.log(this.photos);

        // Чистим блок с фотографиями
        userPhotosComp.textContent = '';

        // Добавляем фотографии
        this.photos.forEach((photo) => {
          const imgEl = this.createImgEl(id, photo.url);

          userPhotosComp.appendChild(imgEl);
        });
      });
  },
};
