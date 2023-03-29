// const PERM_FRIENDS = 2;
// const PERM_PHOTOS = 4;
const APP_ID = 51596263;

// export default {
//   getRandomElement(array) {},

//   async getNextPhoto() {},

//   async init() {},

//   login() {},

//   logout() {},

//   getFriends() {},

//   getUsers(ids) {},

//   async getFriendPhotos(id) {},
// };

const callApi = (method, params) => {
  params.v = params.v || '5.131';

  return new Promise((resolve, reject) => {
    VK.api(method, params, (data) => {
      if (data.error) {
        reject(new Error(data.error.error_msg));
      } else {
        resolve(data.response);
      }
    });
  });
};

export default {
  getRandomElement(arr) {
    const randomNum = Math.floor(Math.random() * (arr.length - 1));

    return arr[randomNum];
  },

  async getNextPhoto() {
    const friend = this.getRandomElement(this.friends.items);
    const photo = await this.getFriendPhotos(friend.id);
    const size = this.findSize(photo);

    console.log(friend);

    return {
      friend,
      id: photo.id,
      url: size.url,
    };
  },

  findSize(photo) {
    const size = photo.sizes.find((size) => size.width >= 360);

    if (!size) {
      // console.log('картинка меньше 360px');

      return photo.sizes.reduce((biggest, current) => {
        // console.log(biggest);
        // console.log(current);
        // console.log('------');

        if (current.width > biggest.width || current.width === biggest.width) {
          return current;
        }

        // console.log('=============');
        // console.log(biggest);
        // console.log('=============');

        return biggest;
      }, photo.sizes[0]);
    }

    return size;
  },

  async login() {
    VK.init({
      apiId: APP_ID,
    });

    return new Promise((resolve, reject) => {
      VK.Auth.login((data) => {
        if (data.session) {
          resolve(console.log('Авторизоваться получилось'));
        } else {
          reject(new Error('Не удалось авторизоваться'));
        }
      }, 2);
    });
  },

  // Работает, но как-то странно
  async logout() {
    return new Promise((resolve, reject) => {
      // VK.Auth.revokeGrants((data) => {
      VK.Auth.logout((data) => {
        if (data.session) {
          resolve(console.log('Выйшли из аккаунта'));
        } else {
          reject(new Error('Не удалось выйти'));
        }
      });
    });
  },

  async init() {
    this.photoCache = {};
    // this.friends = await callApi('friends.get', { fields: 'photo_50' });
    this.friends = await this.getFriends();
    this.authUser = await this.getUsers();

    const componentFooterComp = document.querySelector('.component-footer-photo');
    componentFooterComp.style.backgroundImage = `url('${this.authUser.photo_50}')`;
    componentFooterComp.setAttribute('id', this.authUser.id);
  },

  async getPhotos(owner) {
    const params = {
      owner_id: owner,
      album_id: 'profile',
    };

    // const photosArr = await callApi('photos.getAll', {owner_id: owner});
    const photosArr = await callApi('photos.get', params);

    console.log('photosArr');
    console.log(photosArr);

    return photosArr.items;
  },

  async getFriendPhotos(id) {
    let photos = this.photoCache[id];

    if (photos) {
      return photos;
    }

    photos = await this.getPhotos(id);

    this.photoCache[id] = photos[0];

    return photos[0];
  },

  async getFriends() {
    return await callApi('friends.get', { fields: 'photo_50' });
  },

  async getUsers(id) {
    const params = {
      name_case: 'nom',
      fields: ['photo_50'],
    };

    const userInfo = await callApi('users.get', params);

    return userInfo[0];
  },
};
