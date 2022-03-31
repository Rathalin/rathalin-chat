import {
    addMessages,
    init,
    getLocaleFromNavigator,
    locale as i18n_locale,
    _
} from "svelte-i18n";

import en from "./en.json";
import de from "./de.json";

function setupI18n() {
    // register('en', () => import('./en.json'));
    // register('de', () => import('./de.json'));
    addMessages("en", en);
    addMessages("de", de);
    const fallbackLocale: string = "en";
    init({
        fallbackLocale,
        initialLocale: getLocaleFromNavigator(),
    });

    i18n_locale.set(fallbackLocale);
}

export {
    _ as translate,
    setupI18n,
    i18n_locale as locale,
};
