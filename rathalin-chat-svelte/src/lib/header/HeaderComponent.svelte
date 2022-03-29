<script lang="ts">
    import { translate } from "../../services/i18n/i18n.service";
    import LanguageSelectionComponent from "./LanguageSelectionComponent.svelte";
    import ProfileMenuComponent from "./ProfileMenuComponent.svelte";
</script>

<header>
    <nav>
        <div class="nav-content nav-left-content">
            <div>{$translate("app.name")}</div>
            <a
                class="d-none d-md-block"
                href="https://github.com/Rathalin/RathalinChat"
                >{`${$translate("header.view_on")} Github`}</a
            >
        </div>
        <div class="nav-content nav-right-content">
            <div />
            <div class="vertical-center">
                <ProfileMenuComponent />
            </div>
            <div class="vertical-center">
                <LanguageSelectionComponent />
            </div>
        </div>
    </nav>
</header>

<style>
    nav {
        padding: 0em 1em;
        width: 100%;
        font-family: "Roboto";
        font-weight: 300;
        font-size: large;
        background-color: var(--primary-dark);
        display: flex;
        flex-direction: row;
    }

    .nav-content {
        padding: 0.5em 0em;
    }

    .nav-left-content {
        text-transform: uppercase;
        display: flex;
        flex-direction: row;
    }

    .nav-right-content {
        flex: 1;
        justify-self: flex-end;
        display: flex;
        flex-direction: row;
    }

    .nav-right-content div:first-child {
        flex: 1;
    }

    .vertical-center {
        padding: 0em;
        margin: 0em;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    @media (max-width: 500px) {
        .nav-left-content {
            display: none;
        }
    }

    nav div,
    nav a {
        padding-right: 20px;
    }

    a {
        color: var(--secondary-light);
    }

    a:hover {
        color: var(--secondary-dark);
    }
</style>
