<template>
    <div class="flex">
        <div class="w-36">
            <RepositoriesList :onRepoSelected="repoSelected" />
        </div>

        <div class="flex-1">
            <iframe :srcdoc="gitinspector" class="w-full h-screen"></iframe>
        </div>
    </div>

    <div v-if="loading" class="w-screen min-h-screen absolute top-0 left-0 flex justify-center items-center bg-stone-600/50">
        <Spinner />
    </div>

</template>
  

<script setup lang="ts">

    import { ref } from "vue";
    import RepositoriesList from "@/components/RepositoriesList.vue";
    import Spinner from "@/components/Spinner.vue";
    import { getGitinspectorScan, startGitinspectorScan } from "@/utilities/api/gitinspector";

    const gitinspector = ref("");
    const loading = ref(false);

    async function repoSelected(repo_id :number) {
        loading.value = true;

        await startGitinspectorScan(repo_id, "main");

        for (let i=0; i<60; i++) {
            try {
                gitinspector.value = await getGitinspectorScan(repo_id, "main");
                break;
            }
            catch (err) {
                await new Promise(r => setTimeout(r, 1000));
            } 
        }

        loading.value = false;
    }

</script>