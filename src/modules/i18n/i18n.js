import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import english from './languages/en.json';
import spain from './languages/es.json';
import chinese from './languages/cn.json';
import french from './languages/fr.json';
import indonesian from './languages/id.json';
import japanese from './languages/ja.json';
import korean from './languages/ko.json';
import vietnamese from './languages/vi.json';
import thai from './languages/th.json';
import filipino from './languages/fi.json';
import {StorageService} from '@modules/core/storage/StorageService';

let language = null;

const changeLanguage = async () => {
    try {
        const lang = await StorageService.getItem('@lng');
        if (lang !== null) {
            language = lang;
        }
    } catch (error) {
        console.log('Error ', error);
    }
};

changeLanguage();

const languageDetector = {
    init: Function.prototype,
    type: 'languageDetector',
    async: true, // flags below detection to be async
    detect: async callback => {
        const selectedLanguage = await StorageService.getItem('@lng');
        /** ... */
        callback(selectedLanguage);
    },
    cacheUserLanguage: () => {},
};
const numeral = require('numeral');
const numberFormatter = (value, format) => numeral(value).format(format);
i18n.use(initReactI18next)
    .use(languageDetector)
    .init({
        compatibilityJSON: 'v3',
        lng: 'en',
        fallbackLng: 'en',
        resources: {
            en: english,
            es: spain,
            cn: chinese,
            fr: french,
            id: indonesian,
            ja: japanese,
            ko: korean,
            vi: vietnamese,
            th: thai,
            fi: filipino,
        },
        react: {
            useSuspense: false,
        },
        interpolation: {
            format: (value, format) => numberFormatter(value, format),
        },
    })
    .then(r => {});
export default i18n;
