<template>

    <div class="flex justify-end">
        <ThemeSwitch />
        <LocaleSwitch />
    </div>

    <h1 class="text-center text-3xl mb-2">{{ t("login") }}</h1>
    
    <div class="flex justify-center">
        <GitlabSSOButton />
    </div>

</template>
  
<script setup lang="ts">
    import GitlabSSOButton from "@/components/GitlabSSOButton.vue";
    import { useI18n } from "vue-i18n";
    import locale from "@/locales/login";
    import LocaleSwitch from "@/components/LocaleSwitch.vue";
    import ThemeSwitch from "@/components/ThemeSwitch.vue";

    const { t } = useI18n({ messages: locale });
</script>