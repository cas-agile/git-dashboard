<template>
    <a href="/api/gitlab" class="">
        <div class="rounded bg-violet-800 hover:bg-violet-900 text-white w-fit px-8 py-2
                    flex items-center justify-center">
            <img :src="gitlab_icon" alt="" class="h-5 mr-2">
            <span>{{ t("gitlab login") }}</span>
        </div>
    </a>
</template>
  
<script setup lang="ts">

    import { useI18n } from "vue-i18n";
    import gitlab_icon from "@/assets/icons/gitlab.svg";
    import locale from "@/locales/login";

    const { t } = useI18n({ messages: locale });

</script>