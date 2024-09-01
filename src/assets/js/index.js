require('../../assets/css/index.css');

const { books } = require('../../data/books');
const targetLink = 'pages/details.html';

EJCarousel.init({
    autoPlay: false,
    speedTransition: 5000,
    items: books,
    navButtons: true,
    targetLink,
});

EJBSCarousel.init({
    autoPlay: false,
    speedTransition: 5000,
    items: books,
    navButtons: true,
    indicators: true,
    prevButton: { text: 'Anterior' },
    nextButton: { text: 'Próximo' },
    targetLink,
});
