require('./carousel.css');
require('bootstrap-icons/font/bootstrap-icons.min.css');

const jQuery = require('jquery');

class EJCarousel {
    static instances = [];

    rootElement = null;
    list = null;
    items = [];
    current = null;

    options = {
        autoPlay: true,
        autoPlayTimer: 0,
        speedTransition: 5000,
        items: [],
        navButtons: true,
        prevButton: { text: 'Previous' },
        nextButton: { text: 'Next' },
        targetLink: 'details.html',
    };

    models = {
        items: `
            <div class="carousel__wrapper">
                <a href="{{href}}">
                    <h3 class="carousel__title">{{title}}</h3>
                    <p class="carousel__image"><img src="{{image}}"></p>
                </a>
            </div>`
        ,
        prevButton: `<a href="#" class="carousel__nav nav__prev bi bi-chevron-left">{{prevText}}</a>`,
        nextButton: `<a href="#" class="carousel__nav nav__next bi bi-chevron-right">{{nextText}}</a>`,
    };

    querystrings = {
        carouselList: '.carousel__list',
        carouselItem: '.carousel__item',
        prevButton: '.nav__prev',
        nextButton: '.nav__next',
    };

    constructor(element, options) {
        options = Object.assign(this.options, options);
        element = jQuery(element);
        element.prop('__ejcarousel__', this);

        this.rootElement = element;
        this.list = this.getList(element);
        this.setListItems(this.list);

        this.placeNavButtons(element);
        this.setActions(element);
        this.updateCurrent(0, this.items[0]);
        this.autoPlay(options.autoPlay);
    }

    getClassFromQuerystring(querystring) {
        return querystring
            .replace(/\./g, ' ')
            .replace(/^\ /, '');
    }

    getList(element) {
        const list = element.find(this.querystrings.carouselList);

        if (list.length !== 0) {
            return list;
        }

        const classes = this.getClassFromQuerystring(this.querystrings.carouselList);

        element.append(`<ul class="${classes}"></ul>`);

        return element.find(this.querystrings.carouselList);
    }

    getFilledModel(model, item) {
        Object.keys(item)
            .forEach(key => {
                const regex = new RegExp(`{{${key}}}`, 'gm');

                model = model.replace(regex, item[key]);
            });

        return model;
    }

    setListItems(list) {
        let items = list.children();

        if (items.length !== 0) {
            this.items = items;

            return;
        }

        const classes = this.getClassFromQuerystring(this.querystrings.carouselItem);
        const model = this.options.itemsModel ?? this.models.items;

        jQuery(this.options.items).each((index, item) => {
            item.href = `/${this.options.targetLink}?id=${item.id}`;

            list.append(`<li class="${classes}">${this.getFilledModel(model, item)}</li>`);
        });

        this.items = list.children()
    }

    getNavButton(type = 'prev', element) {
        const data = {
            text: { prev: 'prevText', next: 'nextText' },
            button: { prev: 'prevButton', next: 'nextButton' },
        };

        const button = element.find(this.querystrings[data.button[type]]);

        if (button.length !== 0) {
            return button;
        }

        const model = this.models[data.button[type]];
        const itemData = {};

        itemData[data.text[type]] = this.options[data.button[type]].text;

        return jQuery(this.getFilledModel(model, itemData));
    }

    placeNavButtons(element) {
        if (!this.options.navButtons) {
            return;
        }

        element.append(this.getNavButton('prev', element));
        element.append(this.getNavButton('next', element));
    }

    autoPlay(play = false) {
        const options = this.options;
        const itsRunning = options.autoPlayTimer !== null;
        options.autoPlay = play;

        if (itsRunning && !options.autoPlay) {
            options.autoPlayTimer = clearInterval(options.autoPlayTimer);

            return;
        }

        if (itsRunning && [0, null].indexOf(options.autoPlayTimer) === - 1) {
            return;
        }

        options.autoPlayTimer = setInterval(this.next.bind(this), this.options.speedTransition);
    }

    updateCurrent(index, last) {
        const item = this.items[index];

        jQuery(last).removeClass('active');
        jQuery(item).addClass('active');
        this.current = { index, item };
    }

    stopEvent(aEvent) {
        aEvent.preventDefault();
        aEvent.stopPropagation();
    }

    next(aEvent) {
        let index = (this.current.index === this.items.length - 1) ? 0 : ++this.current.index;

        this.stopEvent(aEvent);
        this.updateCurrent(index, this.current.item);
    }

    prev(aEvent) {
        const index = (this.current.index === 0) ? this.items.length - 1 : --this.current.index;

        this.stopEvent(aEvent);
        this.updateCurrent(index, this.current.item);
    }

    setActions(element) {
        element.find(this.querystrings.prevButton).on('click', this.prev.bind(this));
        element.find(this.querystrings.nextButton).on('click', this.next.bind(this));
    }

    static init(options) {
        const collection = jQuery('ej-carousel');

        collection.each((index, element) => {
            const carousel = new EJCarousel(element, options);

            EJCarousel.instances.push({ carousel, element});
        });
    }
}

module.exports = EJCarousel;
globalThis.EJCarousel = EJCarousel;
