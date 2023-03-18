<template>
    <h1>{{ t("hello") }}</h1>
</template>
  

<script setup lang="ts">

    import { useI18n } from "vue-i18n";
    const { t } = useI18n({ messages: {
        "en": {
            "hello": "Hello"
        },
        "it": {
            "hello": "Ciao"
        }
    } });

</script>