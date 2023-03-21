<template>
    <button class="rounded-full p-1 hover:bg-slate-200 dark:hover:bg-slate-700" :onclick="changeTheme">
        <div class="w-5 h-5 flex items-center justify-center">
            <div v-if="current_theme === 'light'">
                <img :src="moon_icon" alt="Dark theme" class="h-full w-full" />
            </div>

            <div v-if="current_theme === 'dark'">
                <img :src="sun_icon" alt="Light theme" class="invert h-full w-full" />
            </div>
        </div>
    </button>
</template>

<script setup lang="ts">
    import { getTheme, flipTheme, applyTheme } from "@/utilities/theme_handler";
    import { ref } from "vue";
    import moon_icon from "@/assets/icons/moon.svg";
    import sun_icon from "@/assets/icons/sun.svg";
    
    const current_theme = ref(getTheme());

    function changeTheme() {
        flipTheme();
        current_theme.value = getTheme();
        applyTheme(current_theme.value);
    }
</script>