const PERM_FRIENDS = 2;
const PERM_PHOTOS = 4;
const APP_ID = 51596263;

const callApi = (method, params) => {
  params.v = params.v || '5.131';

  return new Promise((resolve, reject) => {
    VK.api(method, params, (data) => {
      if (data.error) {
        console.error(data.error.error_msg);
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
    };
  },

  findSize(photo) {
    const size = photo.sizes.find((size) => size.width >= 360);

    if (!size) {
      return photo.sizes.reduce((biggest, current) => {
        if (current.width > biggest.width || current.width === biggest.width) {
          return current;
        }

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
          this.token = data.session.sid;
          resolve(data);
        } else {
          reject(new Error('Не удалось авторизоваться'));
        }
      }, PERM_FRIENDS | PERM_PHOTOS);
    });
  },

  async logout() {
    return new Promise((resolve) => VK.Auth.revokeGrants(resolve));
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
      // album_id: 'profile',
    };

    // const photosArr = await callApi('photos.getAll', {owner_id: owner});
    const photosArr = await callApi('photos.getAll', params);
    // const photosArr = await callApi('photos.get', params);

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

  async getFriends(id) {
    const params = {
      fields: ['photo_50', 'photo_100']
    };

    if (id != null) {
      params.user_id = id;
    }

    return await callApi('friends.get', params);
  },

  async getUsers(ids) {
    const params = {
      name_case: 'nom',
      fields: ['photo_50'],
    };

    if (ids) {
      params.user_ids = ids;
    }

    const userInfo = await callApi('users.get', params);

    return userInfo[0];
  },

  async callServer(method, queryParams, body) {
    queryParams = {
      ...queryParams,
      method,
    };

    const query = Object.entries(queryParams)
      .reduce((all, [name, value]) => {
        all.push(`${name}=${encodeURIComponent(value)}`);
        return all;
      }, [])
      .join('&');

    const params = {
      headers: {
        vk_token: this.token,
      },
    };

    if (body) {
      params.method = 'POST';
      params.body = JSON.stringify(body);
    }

    const response = await fetch(`/loft-photo/api/?${query}`, params);

    return response.json();
  },

  async like(photo) {
    return this.callServer('like', { photo });
  },

  async photoStats(photo) {
    return this.callServer('photoStats', { photo });
  },

  async getComments(photo) {
    return this.callServer('getComments', { photo });
  },

  async postComment(photo, text) {
    return this.callServer('postComment', { photo }, { text });
  },
};
