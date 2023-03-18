<template>

    <h1 class="text-center text-3xl mb-2">{{ t("login") }}</h1>
    
    <div class="flex justify-center">
        <GitlabSSOButton />
    </div>

</template>
  
<script setup lang="ts">
    import GitlabSSOButton from "@/components/GitlabSSOButton.vue";
    import { useI18n } from "vue-i18n";

    const { t } = useI18n({ messages: {
        "en": {
            "login": "Login to metrics"
        },
        "it": {
            "login": "Accedi alle statistiche"
        }
    } });
</script>