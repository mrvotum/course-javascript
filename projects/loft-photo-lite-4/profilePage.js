import model from './model';
import mainPage from './mainPage';
import pages from './pages';

export default {
  async setUser(user) {},

  createImgEl(id, url) {
    const imgEl = document.createElement('div');

    imgEl.friendId = id;
    imgEl.style.backgroundImage = `url('${url}}')`;

    imgEl.classList.add('component-user-photo');

    return imgEl;
  },

  addFriendInfo(id) {
    const userInfoPhotoComp = document.querySelector('.component-user-info-photo');
    const userInfoNameComp = document.querySelector('.component-user-info-name');

    // Получаем друга
    const friend = model.friends.items.filter((friend) => {
      if (friend.id == id) {
        return friend;
      }
    });

    userInfoPhotoComp.style.backgroundImage = `url('${friend[0].photo_50}}')`;
    userInfoNameComp.textContent = `${friend[0].first_name} ${friend[0].last_name}`;
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
  },
};
