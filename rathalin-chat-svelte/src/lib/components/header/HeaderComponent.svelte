<script lang="ts">
    import { _ } from "$lib/services/i18n/i18n.service";
    import ChangeChatroomComponent from "./ChangeChatroomComponent.svelte";
    import LanguageToggleComponent from "../toggle/LanguageToggleComponent.svelte";
    import LogoutComponent from "./LogoutComponent.svelte";
    import Github from "svelte-material-icons/Github.svelte";
    import ThemeToggleComponent from "../toggle/ThemeToggleComponent.svelte";
import ProfileMenuComponent from "./ProfileMenuComponent.svelte";
</script>

<header>
    <nav>
        <div class="left flex-row gap align-items-center">
            <div>{$_("app.name")}</div>
            <a href={$_("app.github.url")} target="_blank">
                <Github size="1.6em" />
            </a>
        </div>
        <div class="right flex-row flex-wrap gap align-items-center">
            <ChangeChatroomComponent />
            <LogoutComponent />
            <ThemeToggleComponent />
            <LanguageToggleComponent />
        </div>
    </nav>
</header>

<style lang="scss">
    nav {
        padding: 0.8em;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        box-shadow: 0px -12px 14px 5px #000000;
        background-color: var(--c-back-acc-1);
    }

    .right.flex-row {
        gap: 1.6em;
    }

    @media (max-width: 600px) {
        nav {
            justify-content: flex-end;
        }

        .left {
            display: none;
        }
    }
</style>
