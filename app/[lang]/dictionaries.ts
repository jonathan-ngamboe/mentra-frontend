import "server-only";

export type SupportedLocale = "fr" | "en";

const dictionaries = {
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
};

export const getDictionary = async (locale: SupportedLocale) => {
  return dictionaries[locale]();
}