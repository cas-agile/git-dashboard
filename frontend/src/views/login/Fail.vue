<template>

    <h1 class="text-center text-3xl mb-2">{{ t("failed") }}</h1>
    <router-link to="/login" class="flex justify-center hover:underline">{{ t("back to login") }}</router-link>
</template>
  
<script setup lang="ts">
    import { useI18n } from "vue-i18n";
    import locale from "@/locales/login";

    const { t } = useI18n({ messages: locale });
</script>