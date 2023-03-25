<template>
    <div class="h-full w-full min-h-screen 
              bg-stone-50 text-stone-800
              dark:bg-stone-800 dark:text-stone-50">
        <RouterView />
    </div>
</template>

<script setup lang="ts">
    import { RouterView } from "vue-router";
    import { applyTheme, getTheme } from "@/utilities/theme_handler";

    applyTheme(getTheme());
</script>