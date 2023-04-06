<template>

    <div class="flex flex-col h-full" v-if="selected_repo_id">
        <div class="mb-2">
            <div class="flex items-end h-full [&>*]:mr-2">
                <div class="w-fit">
                    <BranchesList :repo_id="selected_repo_id" :onBranchSelected="branchSelected" />
                </div>

                <div class="w-fit">
                    <ExtensionsList :repo_id="selected_repo_id" :branch="selected_branch" :onchange="extensionsSelected" :disabled="!selected_branch" />
                </div>

                <div class="w-fit">
                    <IntervalPicker :onchange="setTimeSelected" />
                </div>

                <div class="h-full">
                    <button :onclick="gitinspectorScan" :disabled="!selected_repo_id || !selected_branch || selected_extensions.length === 0 || loading" type="button" 
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
    import ExtensionsList from "@/components/ExtensionsList.vue";
    import IntervalPicker from "@/components/IntervalPicker.vue";
    import { getGitinspectorScan, startGitinspectorScan } from "@/utilities/api/gitinspector";


    const props = defineProps({
        repo_id: { type: Number }
    });

    const selected_repo_id :Ref<number|undefined> = ref(props.repo_id);
    const selected_branch = ref("");
    const selected_extensions = ref([] as string[]);
    const selected_start_date = ref(null as string|null);
    const selected_end_date = ref(null as string|null);
    const gitinspector = ref("");
    const loading = ref(false);


    watch(() => props.repo_id, async (new_repo_id) => {
        // Resets values
        selected_repo_id.value = new_repo_id;
        selected_branch.value = "";
        gitinspector.value = "";
        selected_extensions.value = [];
    });

    function branchSelected(branch :string) {
        selected_branch.value = branch;
    }

    function extensionsSelected(extensions :string[]) {
        selected_extensions.value = extensions;
    }

    function setTimeSelected(start: string, end :string) {
        selected_start_date.value = start;
        selected_end_date.value = end;
    }


    async function gitinspectorScan() {
        if (!selected_repo_id.value || !selected_branch.value) { return; }
        const repo_id = selected_repo_id.value;
        const branch = selected_branch.value;
        const start_date = selected_start_date.value ? `${selected_start_date.value} 00:00:00` : null;
        const end_date = selected_end_date.value ? `${selected_end_date.value} 23:59:59` : null;
        
        loading.value = true;

        await startGitinspectorScan(repo_id, branch, selected_extensions.value, start_date, end_date);

        for (let i=0; i<60; i++) {
            try {
                gitinspector.value = await getGitinspectorScan(repo_id, branch, selected_extensions.value, start_date, end_date);
                break;
            }
            catch (err) {
                await new Promise(r => setTimeout(r, 1000));
            } 
        }

        loading.value = false;
    }

</script>