import photosDB from './photos.json';
import friendsDB from './friends.json';

export default {
  getRandomElement(array) {
    const randomNum = Math.floor(Math.random() * array.length);

    return array[randomNum];
  },
  getNextPhoto() {
    const randomUser = this.getRandomElement(friendsDB);
    const randomUserPhoto = this.getRandomElement(photosDB[randomUser.id]);

    return {
      friend: randomUser.firstName,
      url: randomUserPhoto.url,
    };
  },
};
