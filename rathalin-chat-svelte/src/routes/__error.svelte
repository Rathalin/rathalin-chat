<script lang="ts">
    import { _ } from "$lib/services/i18n/i18n.service";
</script>

<div class="center">
    <div class="container">
        <h1>{$_("error.page404.heading")}</h1>
        <p>{$_("error.page404.text")}</p>
        <a href="/">{$_("error.page404.link.text")}</a>
    </div>
</div>

<style lang="scss">
    .center {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .container {
        display: flex;
        flex-direction: column;
    }
</style>
