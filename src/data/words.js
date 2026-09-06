import { WORDS_RU } from './words-ru.js';
import { WORDS_EN } from './words-en.js';

export const SAMPLE_WORDS = {
  ru: WORDS_RU,
  en: WORDS_EN,
};

export function getSampleWords(lang) {
  return SAMPLE_WORDS[lang] ?? SAMPLE_WORDS.ru;
}
