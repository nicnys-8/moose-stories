'use strict';

module.exports = {
    port: 8000,
    db: 'mongodb://localhost/grymt',
    templateEngine: 'ejs',
    cookie: {
        name: 'session-id',
        secret: 'AZwnB7aCG1xXPV7oAJesuNUmQEiO7yQ6',
        maxAge: 24 * 3600 * 1000
    }
};
