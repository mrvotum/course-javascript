import model from './model';
import profilePage from './profilePage';
import pages from './pages';

export default {
  async getNextPhoto() {
    const { friend, id, url } = await model.getNextPhoto();
    this.setFriendAndPhoto(friend, id, url);
  },

  setFriendAndPhoto(friend, id, url) {
    const photoComp = document.querySelector('.component-photo');
    const headerPhotoComp = document.querySelector('.component-header-photo');
    const headerNamePComp = document.querySelector('.component-header-name');
    const componentHeaderProfileLinkComp = document.querySelector(
      '.component-header-profile-link'
    );

    headerPhotoComp.style.backgroundImage = `url('${friend.photo_50}')`;
    headerNamePComp.innerText = `${friend.first_name ?? ''} ${friend.last_name ?? ''}`;
    photoComp.style.backgroundImage = `url('${url}}')`;
    componentHeaderProfileLinkComp.href = `#${friend.id}`;
  },

  handleEvents() {
    let startForm;

    document.querySelector('.component-photo').addEventListener('touchstart', (e) => {
      e.preventDefault();
      startForm = { y: e.changedTouches[0].pageY };
    });

    document.querySelector('.component-photo').addEventListener('touchend', async (e) => {
      const direction = e.changedTouches[0].pageY - startForm.y;

      if (direction < 0) {
        await this.getNextPhoto();
      }
    });
  },
};
