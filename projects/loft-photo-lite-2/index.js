import pages from './pages';
import('./styles.css');

const pageNames = ['login', 'main', 'profile'];
console.log(pageNames);

document.addEventListener('click', () => {
  pages.openPage('main');
});
