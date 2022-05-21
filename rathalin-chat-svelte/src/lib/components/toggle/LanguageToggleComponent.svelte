<script lang="ts">
    import { selectedLocale } from "$lib/stores/locale.store";

    interface Language {
        lang: string;
        path: string;
    }

    /*
    https://www.freepik.com
    */
    const languages: Language[] = [
        {
            lang: "en",
            path: "/images/freepik-country-flags/png/110-united kingdom.png",
        },
        {
            lang: "de",
            path: "/images/freepik-country-flags/png/208-germany.png",
        },
        {
            lang: "sv",
            path: "/images/freepik-country-flags/png/190-sweden.png",
        },
    ];

    const initialLanguage: Language | undefined = languages.find(
        (l) => l.lang === $selectedLocale
    );
    if (initialLanguage == null) {
        throw new Error(`No translation image found for '${$selectedLocale}'`);
    }
    const initialLanguageIndex: number = languages.indexOf(initialLanguage);
    if (initialLanguageIndex === -1) {
        throw new Error(
            `Language '${initialLanguage.lang}' not found in language array`
        );
    }
    let currentLanguageIndex: number = initialLanguageIndex;
    let currentLanguage: Language = initialLanguage;

    function toggleLanguage() {
        currentLanguage = languages[++currentLanguageIndex % languages.length];
        $selectedLocale = currentLanguage.lang;
    }
</script>

<img
    on:click|preventDefault={toggleLanguage}
    width="25"
    height="25"
    draggable="false"
    src={currentLanguage.path}
    alt={`language-symbol-${currentLanguage.lang}`}
/>

<style>
    img {
        cursor: pointer;
    }
</style>
