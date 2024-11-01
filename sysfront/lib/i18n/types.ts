export interface I18nConfig {
  defaultLocale: string;
  locales: {
    [key: string]: {
      common: any;
      wallet: any;
      advisor: any;
      memeMarket: any;
      portfolio: any;
    };
  };
} 