// i18n.ts (create in root directory)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your existing translation files
import commonEN from './locales/en/common.json';
import commonRW from './locales/rw/common.json';
import jobsEN from './locales/en/jobs.json'
import jobsRW from './locales/rw/jobs.json'
import authEN from './locales/en/auth.json'
import authRW from './locales/rw/auth.json'
import houseKeeperEN from './locales/en/houseKeeper.json'
import houseKeeperRW from './locales/rw/houseKeeper.json'
import employeeEN from './locales/en/employer.json'
import employeeRW from './locales/rw/employer.json'

const resources = {
  en: {
    common: commonEN,
    jobs: jobsEN, 
    auth: authEN,
    houseKeeper: houseKeeperEN,
    employer: employeeEN,
  },
  rw: {
    common: commonRW,
    jobs: jobsRW,
    auth: authRW,
    houseKeeper: houseKeeperRW,
    employer: employeeRW
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: typeof window !== 'undefined' 
      ? localStorage.getItem('language') || 'rw'
      : 'rw',
    fallbackLng: 'en',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;