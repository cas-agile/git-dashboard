<template>

    <div class="flex flex-col h-full" v-if="selected_repo_id">
        <div class="mb-2">
            <div class="flex items-center h-full [&>*]:mr-2">
                <div class="w-fit">
                    <BranchesList :repo_id="selected_repo_id" :onBranchSelected="branchSelected" />
                </div>

                <div class="h-full">
                    <button :onclick="gitinspectorScan" :disabled="!selected_repo_id || !selected_branch || loading" type="button" 
                            class="font-medium rounded-lg px-5 py-2.5 h-full
                                    text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 
                                    dark:bg-blue-600 dark:disabled:bg-gray-500 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 
                                    disabled:bg-gray-500">
                        <div class="flex items-center">
                            Scan <Spinner v-if="loading" class="w-5 h-5 ml-1" />
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="gitinspector" class="flex-1 bg-white">
            <iframe :srcdoc="gitinspector" class="w-full h-full"></iframe>
        </div>
    </div>

</template>
  

<script setup lang="ts">

    import { ref, Ref, watch } from "vue";
    import Spinner from "@/components/Spinner.vue";
    import BranchesList from "@/components/BranchesList.vue";
    import { getGitinspectorScan, startGitinspectorScan } from "@/utilities/api/gitinspector";


    const props = defineProps({
        repo_id: { type: Number }
    });

    const selected_repo_id :Ref<number|undefined> = ref(props.repo_id);
    const selected_branch = ref("");
    const gitinspector = ref("");
    const loading = ref(false);


    watch(() => props.repo_id, async (new_repo_id) => {
        selected_repo_id.value = new_repo_id;
        selected_branch.value = "";
        gitinspector.value = "";
    });

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