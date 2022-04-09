<script lang="ts">
    import LogoutComponent from "$lib/header/LogoutComponent.svelte";
    import { translate } from "$lib/services/i18n/i18n.service";
    import ChangeChatroomComponent from "./ChangeChatroomComponent.svelte";
    import LanguageSelectionComponent from "./LanguageSelectionComponent.svelte";
    import ProfileMenuComponent from "./ProfileMenuComponent.svelte";
</script>

<header>
    <nav>
        <div class="nav-content nav-left-content">
            <div>{$translate("app.name")}</div>
            <a href="https://github.com/Rathalin/rathalin-chat" target="_blank"
                >{`${$translate("header.view_on")} Github`}</a
            >
        </div>
        <div class="nav-content nav-right-content">
            <div />
            <div class="vertical-center">
                <ChangeChatroomComponent />
            </div>
            <div class="vertical-center">
                <ProfileMenuComponent />
            </div>
            <div class="vertical-center">
                <LogoutComponent />
            </div>
            <div class="vertical-center">
                <LanguageSelectionComponent />
            </div>
        </div>
    </nav>
</header>

<style lang="scss">
    nav {
        font-family: var(--font-secondary);
        padding: 0em 1em;
        width: 100%;
        font-weight: 300;
        font-size: large;
        background-color: var(--primary-dark);
        display: flex;
        flex-direction: row;

        .nav-content {
            padding: 0.5em 0em;
            gap: 1em;
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

        @media (max-width: 600px) {
            .nav-left-content {
                display: none;
            }
        }
    }
</style>
