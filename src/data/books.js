let books = [
    { bookNumber: 1, title: 'A arte da guerra'},
    { bookNumber: 2, title: 'Código limpo'},
    { bookNumber: 3, title: 'Desbloqueie o poder da sua mente'},
    { bookNumber: 4, title: 'Elon Musk'},
    { bookNumber: 5, title: 'O poder do hábito'},
    { bookNumber: 6, title: 'Os códigos do milhão'},
    { bookNumber: 7, title: 'Pai rico pai pobre'},
];

books = books.map((item) => (
    { id: item.bookNumber, title: item.title, text: `texto do livro ${item.title}`, image: require(`../assets/img/livro${item.bookNumber}.jpg`) }
));

books = [].concat(books, [
    // { id: 1, title: 'Imagem 1', text: 'texto da Imagem 1', image: 'https://picsum.photos/400/225?random=1'},
    // { id: 2, title: 'Imagem 2', text: 'texto da Imagem 2', image: 'https://picsum.photos/400/225?random=2'},
    // { id: 3, title: 'Imagem 3', text: 'texto da Imagem 3', image: 'https://picsum.photos/400/225?random=3'},
]);

module.exports = {
    books,
    getBook(id) {
        const list = books.filter(book => book.id === parseInt(id));

        return list.length > 0 ? list[0] : null;
    },
};
