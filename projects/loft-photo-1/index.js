import photosDB from './photos.json';
import friendsDB from './friends.json';

const getRandomElement = (arr) => {
  const randomNum = Math.floor(Math.random() * arr.length);

  return arr[randomNum];
};

const getNextPhoto = () => {
  const randomUser = getRandomElement(friendsDB);
  const randomUserPhoto = getRandomElement(photosDB[randomUser.id]);

  return {
    friend: randomUser.firstName,
    url: randomUserPhoto.url,
  };
};

const photo = getNextPhoto();
console.log(photo);
