import pages from './pages';
import('./styles.css');

const pageNames = ['login', 'main', 'profile'];

const getRandomElement = (arr) => {
  const randomNum = Math.floor(Math.random() * arr.length);

  return arr[randomNum];
};


document.addEventListener('click', () => {
  const randomPageName = getRandomElement(pageNames);
  
  pages.openPage(randomPageName);
});
