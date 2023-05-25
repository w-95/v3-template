import { defineStore } from 'pinia';
import { ref } from 'vue';
import i18n from '@/locales';

export const useLocaleStore = defineStore( 'locale', () => {
    let locale = ref(i18n.global.locale.value);

    // 设置locale
    function setLocale(lang: string) {
      locale.value = lang;
      i18n.global.locale.value = lang;
    }

    return { locale, setLocale };
  }
);