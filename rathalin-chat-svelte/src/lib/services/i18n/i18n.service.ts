import {
    addMessages,
    init,
    getLocaleFromNavigator,
    locale as i18n_locale,
    _
} from "svelte-i18n";

import en from "./en.json";
import de from "./de.json";
import sv from "./sv.json";

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
