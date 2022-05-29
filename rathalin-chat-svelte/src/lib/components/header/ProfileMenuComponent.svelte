<script lang="ts">
    import { chatroom, loggedIn, user } from "$lib/stores/user.store";
    import Account from "svelte-material-icons/Account.svelte";

    let showMenu: boolean = false;

    function onMouseEnter(): void {
        showMenu = true;
    }

    function onMouseLeave(): void {
        showMenu = false;
    }
</script>

{#if $loggedIn && $user}
    <div
        id="profile-menu-wrapper"
        on:mouseenter={onMouseEnter}
        on:mouseleave={onMouseLeave}
    >
        <button class="link">
            <Account />
        </button>
        {#if showMenu}
            <div class="dropdown-menu">Some Dropdown</div>
        {/if}
    </div>
{/if}

<style lang="scss">
    #profile-menu-wrapper {
        padding: 0.5em;

        .dropdown-menu {
            position: absolute;
            margin-top: 1em;
            background-color: white;
            border: 1px solid red;
        }
        
        .dropdown-menu::before {
            border: 8px solid transparent;
            border-bottom-color: var(--color-border-default);
        }
        .dropdown-menu::before,
        .dropdown-menu::after {
            position: absolute;
            display: inline-block;
            content: "";
        }
    }
</style>
