<template>

    <div class="flex">
        <div class="w-36">
            <RepositoriesList :onRepoSelected="repoSelected" />
        </div>

        <div class="flex-1" v-if="selected_repo_id">
            <BranchesList :repo_id="selected_repo_id" :onBranchSelected="branchSelected" />
            <button :onclick="gitinspectorScan" :disabled="!selected_repo_id || !selected_branch" type="button" 
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 
                            dark:bg-blue-600 dark:disabled:bg-gray-500 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800
                            disabled:bg-gray-500">
                Scan
            </button>
            <iframe :srcdoc="gitinspector" class="w-full h-screen"></iframe>
        </div>
    </div>

    <div v-if="loading" class="w-screen min-h-screen absolute top-0 left-0 flex justify-center items-center bg-stone-600/50">
        <Spinner />
    </div>

</template>
  

<script setup lang="ts">

    import { ref, Ref } from "vue";
    import RepositoriesList from "@/components/RepositoriesList.vue";
    import Spinner from "@/components/Spinner.vue";
    import BranchesList from "@/components/BranchesList.vue";
    import { getGitinspectorScan, startGitinspectorScan } from "@/utilities/api/gitinspector";

    const selected_repo_id :Ref<number|null> = ref(null);
    const selected_branch = ref("");
    const gitinspector = ref("");
    const loading = ref(false);


    async function repoSelected(repo_id :number) {
        selected_repo_id.value = repo_id;
        selected_branch.value = "";
        gitinspector.value = "";
    }

    function branchSelected(branch :string) {
        selected_branch.value = branch;
    }


    async function gitinspectorScan() {
        if (!selected_repo_id.value || !selected_branch.value) { return; }
        const repo_id = selected_repo_id.value;
        const branch = selected_branch.value;
        loading.value = true;

        await startGitinspectorScan(repo_id, branch);

        for (let i=0; i<60; i++) {
            try {
                gitinspector.value = await getGitinspectorScan(repo_id, branch);
                break;
            }
            catch (err) {
                await new Promise(r => setTimeout(r, 1000));
            } 
        }

        loading.value = false;
    }

</script>