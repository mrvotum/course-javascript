const callApi = (method, params) => {
  params.v =  params.v || '5.131';

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

    return {
      friend,
      id: photo.id,
      url: size.url,
    }
  },

  findSize(photo) {
    const size = photo.sizes.find((size) => size.width >= 360);

    if (!size) {
      return photo.sizes.reduce((biggest, current) => {
        if (current.width > biggest.width) {
          return current;
        }

        return biggest;
      }, photo.sizes[0]);
    }

    return size;
  },

  async login () {
    VK.init({
      apiId: 51588434,
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

  async init () {
    this.photoCache = {};
    this.friends = await callApi('friends.get', { fields: 'photo_50' });
  },

  async getPhotos(owner) {
    const params = {
      owner_id: owner,
      album_id: 'profile',
    };

    // const photosArr = await callApi('photos.getAll', {owner_id: owner});
    const photosArr = await callApi('photos.get', params);

    return photosArr.items;
  },

  async getFriendPhotos (id) {
    let photos = this.photoCache[id];

    if (photos) {
      return photos;
    }

    photos = await this.getPhotos(id);
  
    this.photoCache[id] = photos[0];
  
    return photos[0];
  },
};
