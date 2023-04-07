const pagesMap = {
  login: '.page-login',
  main: '.page-main',
  profile: '.page-profile',
};

const openPage = (showPage) => {
  // Удаляем точку
  const showClass = pagesMap[showPage].slice(1);
  const pages = document.querySelectorAll('.page');

  pages.forEach((element) => {
    if (element.classList.contains(showClass)) {
      element.classList.remove('hidden');
    } else if (!element.classList.contains('hidden')) {
      element.classList.add('hidden');
    }
  });
};

export default {
  openPage,
};
