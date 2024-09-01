require('bootstrap/dist/css/bootstrap.min.css');
require('./bs-carousel.css');

const jQuery = require('jquery');
const bootstrap = require('bootstrap');

class EJBSCarousel {
    template = `
        <div id="{{id}}" class="carousel slide" data-bs-ride="carousel">
            <ul class="carousel-indicators {{canShowIndicators}}">{{indicators}}</ul>
            <div class="carousel-inner">{{items}}</div>

            <a class="carousel-control-prev {{canShowNav}}" href="#{{id}}" role="button" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">{{prevText}}</span>
            </a>

            <a class="carousel-control-next {{canShowNav}}" href="#{{id}}" role="button" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">{{nextText}}</span>
            </a>
        </div>
    `;

    static instances = [];

    carousel = null;

    options = {
        autoPlay: true,
        autoPlayTimer: null,
        speedTransition: 5000,
        items: [],
        navButtons: true,
        prevButton: { text: 'Previous' },
        nextButton: { text: 'Next' },
        targetLink: 'details.html',
    };

    models = {
        indicator: `<li data-bs-target="#{{carouselId}}" data-bs-slide-to="{{id}}"></li>`,
        item: `
            <div class="carousel-item">
                <a href="{{href}}"><img class="d-block w-100" src="{{image}}" alt="{{title}}"></a>

                <div class="carousel-caption d-none d-md-block">
                    <h5>{{title}}</h5>
                    <p>{{text}}</p>
                </div>
            </div>
        `,
    };

    constructor(element, options, id) {
        element = jQuery(element);
        element.prop('__ejbscarousel__', this);
        options = Object.assign(this.options, options);

        this.id = `ej-bscarousel-${++id}`;

        element.html(this.getHTML({
            id: this.id,
            indicators: this.getIndicators(options),
            items: this.getItems(options),
            prevText: this.getNavButton('prev'),
            nextText: this.getNavButton('next'),
            canShowIndicators: options.indicators ? '' : 'hide',
            canShowNav: options.navButtons ? '' : 'hide',
        }));

        this.carousel = new bootstrap.Carousel('ej-bscarousel [data-bs-ride="carousel"]', {
            interval: options.speedTransition,
            ride: options.autoPlay ? 'carousel' : false,
        });

        element.find('.carousel-indicators li').get(0).classList.add('active');
        element.find('.carousel-item').get(0).classList.add('active');
    }

    getHTML(options) {
        let html = this.template;

        Object.keys(options).forEach(key => {
            const value = options[key];
            const regex = new RegExp(`{{${key}}}`, 'g');

            html = html.replace(regex, value);
        });

        return html;
    }

    getIndicators(options) {
        const indicators = [];

        options.items.forEach((item, index) => indicators.push(
            this.models.indicator
                .replace('{{carouselId}}', this.id)
                .replace('{{id}}', index)
        ));

        return indicators.join('');
    }

    getItems(options) {
        const items = [];

        options.items.forEach((item, index) => items.push(
            this.models.item
                .replace(new RegExp('{{title}}', 'g'), item.title)
                .replace('{{href}}', `/${options.targetLink}?id=${item.id}`)
                .replace('{{image}}', item.image)
                .replace('{{text}}', item.text)
        ));

        return items.join('');
    }

    getNavButton(type = 'prev') {
        return this.options[{ prev: 'prevButton', next: 'nextButton' }[type]].text;
    }

    static init(options) {
        const collection = jQuery('ej-bscarousel');

        collection.each((index, element) => {
            const carousel = new EJBSCarousel(element, options, index);

            EJBSCarousel.instances.push({ carousel, element });
        });
    }
}

module.exports = EJBSCarousel;
globalThis.EJBSCarousel = EJBSCarousel;
