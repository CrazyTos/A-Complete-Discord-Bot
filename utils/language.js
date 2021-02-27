const path = require('path');
const i18n = require('i18n');
const { languages } = require('./languages-config');


function getLocales() {
    const locales = [];
    languages.forEach(lang => {
        locales.push(lang.locale)
    });
    return locales;
}

module.exports = {
    configure_i18n : () => {
        i18n.configure({
            // setup some locales
            locales: getLocales(),
            // default locale
            defaultLocale: 'en_US',
            // will return translation from defaultLocale in case current locale doesn't provide it
            retryInDefaultLocale: true,
            // where to store json files
            directory: path.join(__dirname, '../languages'),
            // setting extension of json files
            extension: '.json',
            // enable object notation
            objectNotation: true,
            // setting of log level WARN
            logWarnFn: function (msg) {
                console.log("warn", msg);
            },
            // setting of log level ERROR
            logErrorFn: function (msg) {
                console.log("error", msg);
            },
            // used to alter the behaviour of missing keys
            missingKeyFn: function (locale, value) {
                return value;
            },
            // object or [obj1, obj2] to bind the i18n api and current locale to
            register: global,
            // use mustache with customTags
            mustacheConfig: {
                tags: ['{{', '}}'],
                disable: false
              }
        });
    }
}
