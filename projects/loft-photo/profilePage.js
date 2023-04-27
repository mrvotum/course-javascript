import model from './model';
import mainPage from './mainPage';
import pages from './pages';

export default {
  async setUser(user) {},

  userId: null,

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
    const photosTab = document.querySelector('.component-profile-mode-photos');
    const friendsTab = document.querySelector('.component-profile-mode-friends');

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

    const mode = localStorage.getItem('loft-photo-profile-mode') ?? '1';

    if (mode === 1) {
      photosTab.click();
    } else {
      friendsTab.click();
    }
  },

  async showFriends() {
    const friendsComp = document.querySelector ( '.component-user-friends');
    const friends = await model.getFriends(this.userId);

    friendsComp.innerHTML = '';

    for (const friend of friends.items) {
      const element = document.createElement('div');
      const photoEl = document.createElement('div');
      const nameEl = document.createElement('div');

      element.classList.add('component-user-friend');
      element.dataset.id = friend.id;
      photoEl.classList.add('component-user-friend-photo');
      photoEl.style.backgroundImage = `url(${friend.photo_100})`;
      photoEl.dataset.id = friend.id;
      nameEl.classList.add('component-user-friend-name');
      nameEl.innerText = `${friend.first_name ?? ''} ${friend.last_name ?? ''}`;
      nameEl.dataset.id = friend.id;
      element.append(photoEl, nameEl);
      friendsComp.append(element);
    }
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
        this.userId = id;

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

      document
        .querySelector('.component-profile-mode-photos')
        .addEventListener('click', () => {
          const photosComp = document.querySelector('.component-user-photos');
          const friendsComp = document.querySelector('.component-user-friends');

          console.log('friendsComp')
          console.log(friendsComp)

          photosComp.classList.remove('hidden');
          friendsComp.classlist.add('hidden');

          localStorage.setItem('loft-photo-profile-mode','1');
          this.showPhotos();
      });

      document
        .querySelector('.component-profile-mode-friends')
        .addEventListener('click', () => {
          const photosComp = document.querySelector('.component-user-photos');
          const friendsComp = document.querySelector('.component-user-friends');

          friendsComp.classList.remove('hidden');
          photosComp.classList.add('hidden');

          localStorage.setItem('loft-photo-profile-mode', '2');
          this.showFriends();
      });

      document
        .querySelector('.component-user-friends')
        .addEventListener('click', async (e) => {
          const friendId = e.target.dataset.id;
          
          if (friendId) {
            const [friend] = await model.getUsers([friendId]);
            const friendsPhotos = await model.getPhotos(friendId);
            //estint-disable-next-line eqegea
            const photo = model.getRandomElement(friendsPhotos.items);
            const size = model.findSize(photo);
            const photoStats = await model.photoStats(photo.id);

            mainPage.setFriendAndPhoto(friend, parseInt(photo.id), size.url, photoStats);
            pages.openPage('main');
          }
        });
  },
};
