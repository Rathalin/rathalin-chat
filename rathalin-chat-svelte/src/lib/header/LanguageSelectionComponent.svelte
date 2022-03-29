<script lang="ts">
    import { get } from "svelte/store";
    import { selectedLocale } from "../../stores/config.store";

    interface LanguageImage {
        lang: string;
        path: string;
    }

    /*
    https://www.freepik.com
    */
    const languageImages: Map<string, string> = new Map<string, string>();
    languageImages.set(
        "de",
        "/images/freepik-country-flags/png/110-united kingdom.png"
    );
    languageImages.set(
        "en",
        "/images/freepik-country-flags/png/208-germany.png"
    );

    let currentImage: LanguageImage = null;
    setLanguageImage(get(selectedLocale));

    function toggleLanguage(event) {
        event.preventDefault();
        let nextLang: string = currentImage.lang === "en" ? "de" : "en";
        currentImage = {
            lang: nextLang,
            path: languageImages.get(nextLang),
        };
        selectedLocale.set(nextLang);
    }

    function setLanguageImage(lang: string) {
        currentImage = {
            lang,
            path: languageImages.get(lang),
        };
    }
</script>

<img
    on:click={toggleLanguage}
    width="25"
    height="25"
    src={currentImage.path}
    alt={`language-symbol-${currentImage.lang}`}
/>

<style>
    img {
        cursor: pointer;
    }
</style>
