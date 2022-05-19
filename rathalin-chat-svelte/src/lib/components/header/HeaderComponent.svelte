<script lang="ts">
    import { _ } from "$lib/services/i18n/i18n.service";
    import ChangeChatroomComponent from "./ChangeChatroomComponent.svelte";
    import LanguageSelectionComponent from "./LanguageSelectionComponent.svelte";
    import LogoutComponent from "./LogoutComponent.svelte";
    import ProfileMenuComponent from "./ProfileMenuComponent.svelte";
</script>

<header>
    <nav>
        <div class="nav-content nav-left-content">
            <div>{$_("app.name")}</div>
            <a href="https://github.com/Rathalin/rathalin-chat" target="_blank"
                >{`${$_("header.view_on")} Github`}</a
            >
        </div>
        <div class="nav-content nav-right-content">
            <div />
            <ProfileMenuComponent />
            <ChangeChatroomComponent />
            <LogoutComponent />
            <LanguageSelectionComponent />
        </div>
    </nav>
</header>

<style lang="scss">
    nav {
        padding: 0em 1em;
        width: 100%;
        font-size: large;
        display: flex;
        flex-direction: row;
        box-shadow: 0px -12px 14px 5px #000000;
        background-color: var(--c-back-acc-1);

        .nav-content {
            padding: 0.5em 0em;
            gap: 1em;
            align-items: center;
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

        @media (max-width: 1200px) {
            .nav-left-content {
                display: none;
            }
        }
    }
</style>
