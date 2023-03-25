<template>
    <div class="flex">
        <div class="w-36">
            <RepositoriesList :onRepoSelected="repoSelected" />
        </div>

        <div class="flex-1">
            <iframe :srcdoc="gitinspector" class="w-full h-screen"></iframe>
        </div>
    </div>

</template>
  

<script setup lang="ts">

    import { ref } from "vue";
    import RepositoriesList from "@/components/RepositoriesList.vue";
    import { getGitinspectorHTML } from "@/utilities/api/gitinspector";

    const gitinspector = ref("");

    async function repoSelected(repo_id :number) {
        gitinspector.value = await getGitinspectorHTML(repo_id);
    }

</script>