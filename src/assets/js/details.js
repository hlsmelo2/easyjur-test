require('bootstrap/dist/css/bootstrap.min.css');
const jQuery = require('jquery');

require('../../assets/css/details.css');

const { getBook } = require('../../data/books');

class Details {
    constructor() {
        const id = new URLSearchParams(location.search).get('id') ?? 0;
        const book = getBook(id);
        const main = jQuery('main');

        const html = this.getHTML(main.html(), {
            title: book.title,
            text: book.text,
            image: book.image,
        });

        main.html(html);
    }

    getHTML(template, data) {
        return template
            .replace(new RegExp('{{title}}', 'g'), data.title)
            .replace(new RegExp('{{text}}', 'g'), data.text)
            .replace(new RegExp('{{image}}', 'g'), data.image);
    }
}

new Details();
