"use client";

import { createContext, useContext, useState } from 'react';
import { i18nConfig } from './config';

const I18nContext = createContext({
  locale: 'zh',
  t: (key: string) => key,
  setLocale: (locale: string) => {}
});

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState('zh');

  const t = (key: string) => {
    const keys = key.split('.');
    let value = i18nConfig.locales[locale];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext); 