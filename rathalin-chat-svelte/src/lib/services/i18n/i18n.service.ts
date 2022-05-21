import {
    addMessages,
    init,
    getLocaleFromNavigator,
    locale as i18n_locale,
    _
} from "svelte-i18n";

import en from "$lib/i18n/en.json";
import de from "$lib/i18n/de.json";
import sv from "$lib/i18n/sv.json";

function setupI18n() {
    addMessages("en", en);
    addMessages("de", de);
    addMessages("sv", sv);
    const fallbackLocale: string = "en";
    init({
        fallbackLocale,
        initialLocale: getLocaleFromNavigator(),
    });

    i18n_locale.set(fallbackLocale);
}

export {
    _,
    setupI18n,
    i18n_locale as locale,
};
