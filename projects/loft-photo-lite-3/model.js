let friends = null;

const getRandomElement = (arr) => {
  const randomNum = Math.floor(Math.random() * arr.length);

  return arr[randomNum];
};

const login = async () => {
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
};

const callAPI = (method, params) => {
  params.v = '5.131';

  return new Promise((resolve, reject) => {
    VK.api(method, params, (data) => {
      if (data.error) {
        reject(data.error);
      } else {
        resolve(data.response);
      }
    });
  });
};

async function getFriendPhotos(id) {
  const photosArr = await callAPI('photos.get', { owner_id: id, album_id: 'profile' });
  const photos = photosArr.items;

  if (photoCache[id]) {
    return photos;
  }

  // получаем рандомное фото номрлаьного размера
  // const randomPhoto = getRandomElement(photos);
  // const randomPhotoSizeM = randomPhoto.sizes[4].url;

  // console.log(randomPhotoSizeM);

  photoCache[id] = photos;

  return photos;
  // return randomPhotoSizeM;
}

let randomFriend = null;
const init = async () => {
  friends = await callAPI('friends.get', { fields: 'photo_100' });

  // console.log(friends.items);

  randomFriend = getRandomElement(friends.items);
  // console.log(randomFriend);

  getFriendPhotos(randomFriend.id);
};

const photoCache = {};

const getNextPhoto = async () => {
  return {
    friend: `${randomFriend.first_name} ${randomFriend.last_name}`,
    id: randomFriend.id,
    photos: await getFriendPhotos(randomFriend.id),
  };
};

export default {
  getRandomElement,

  getNextPhoto,

  login,

  init,

  photoCache,
  getFriendPhotos,
};
