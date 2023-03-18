<template>

    <h1 class="text-center text-3xl mb-2">{{ t("failed") }}</h1>
    <router-link to="/login" class="flex justify-center hover:underline">{{ t("back to login") }}</router-link>
</template>
  
<script setup lang="ts">
    import { useI18n } from "vue-i18n";

    const { t } = useI18n({ messages: {
        "en": {
            "failed": "Login failed",
            "back to login": "Back to login"
        },
        "it": {
            "failed": "Accesso fallito",
            "back to login": "Ritorna al login"
        }
    } });
</script>