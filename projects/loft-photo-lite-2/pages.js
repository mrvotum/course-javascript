const pagesMap = {
  login: '.page-login',
  main: '.page-main',
  profile: '.page-profile',
};

const openPage = (showPage) => {
  // Удаляем точку
  const showClass = pagesMap[showPage].slice(1);

  pages.forEach(element => {
    if (element.classList.contains(showClass)) {
      element.classList.remove('hidden');
    } else if (!element.classList.contains('hidden')) {
      element.classList.add('hidden');
    }
  });
};

const pages = document.querySelectorAll('.page');

pages.openPage = openPage;

// pages.openPage('main'); // сделать видимым элемент с классом page-main
// pages.openPage('profile'); // сделать видимым элемент с классом page-profile, а page-main скрыть
// pages.openPage('login'); // сделать видимым элемент с классом page-login, а page-profile скрыть


export default {
  openPage,
};
