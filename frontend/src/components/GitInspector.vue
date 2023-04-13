<template>

    <div class="flex flex-col h-full" v-if="selected_repo_id">
        <div class="mb-2">
            <div class="flex items-end justify-between h-full">

                <div class="h-full flex items-end [&>*]:mr-2">
                    <div class="w-fit" v-if="selected_repo_id">
                        <BranchesList :repo_id="selected_repo_id" :onBranchSelected="branchSelected" :disabled="loading" />
                    </div>
    
                    <div class="w-fit" v-if="selected_repo_id && selected_branch">
                        <ExtensionsList :repo_id="selected_repo_id" :branch="selected_branch" :onchange="extensionsSelected" :disabled="loading" />
                    </div>
                    
                    <div class="h-full flex items-end [&>*]:mr-2" v-if="selected_repo_id && selected_branch && selected_extensions.length > 0">
                        <div class="w-fit">
                            <IntervalPicker :onchange="setTimeSelected" :disabled="loading" />
                        </div>
        
                        <div class="h-full">
                            <button :onclick="gitinspectorScan" :disabled="!selected_repo_id || !selected_branch || selected_extensions.length === 0 || loading" type="button" 
                                    class="font-medium rounded-lg px-5 py-2.5 h-full focus:ring-4 focus:outline-none
                                        text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 disabled:bg-blue-700/50 
                                        dark:text-white dark:bg-blue-600  dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:disabled:bg-blue-600/50">
                                <div class="flex items-center">
                                    Scan <Spinner v-if="loading" class="w-5 h-5 ml-1" />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="h-full flex items-end [&>*]:mr-2">
                    <div v-if="gitinspector" class="h-full">
                        <button :onclick="exportScan"
                                class="font-medium rounded-lg px-5 py-2.5 h-full focus:ring-4 focus:outline-none
                                    text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 disabled:bg-blue-700/40 
                                    dark:text-white dark:bg-blue-600  dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:disabled:bg-blue-600/40">
                            {{ t("export") }}
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <div v-if="gitinspector" class="flex-1 bg-white">
            <iframe :srcdoc="gitinspector" class="w-full h-full"></iframe>
        </div>
    </div>

    <div class="absolute top-0 left-0 mt-5 flex justify-center w-screen pointer-events-none">
        <div v-if="scan_error" class="flex items-center w-full max-w-xs p-4 mb-4 pointer-events-auto text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                <span class="sr-only">Error icon</span>
            </div>

            <div class="ml-3 text-sm font-normal">{{ t("gitinspector error") }}</div>

            <button type="button" :onclick="() => { scan_error = false }"
                    class="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700">
                <span class="sr-only">Close</span>
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
        </div>
    </div>

</template>
  

<script setup lang="ts">

    import { ref, Ref, watch } from "vue";
    import Spinner from "@/components/Spinner.vue";
    import BranchesList from "@/components/BranchesList.vue";
    import ExtensionsList from "@/components/ExtensionsList.vue";
    import IntervalPicker from "@/components/IntervalPicker.vue";
    import { getGitinspectorScan, startGitinspectorScan, ScanError, ScanNotCompleted } from "@/utilities/api/gitinspector";
    import { useI18n } from "vue-i18n";
    import locale from "@/locales/git";
    
    const { t } = useI18n({ messages: locale });

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
    const scan_error = ref(false);


    watch(() => props.repo_id, async (new_repo_id) => {
        // Resets values
        selected_repo_id.value = new_repo_id;
        selected_branch.value = "";
        gitinspector.value = "";
        selected_extensions.value = [];
        selected_start_date.value = "";
        selected_end_date.value = "";
    });

    function branchSelected(branch :string) {
        selected_branch.value = branch;
        gitinspector.value = "";
        selected_extensions.value = [];
    }

    function extensionsSelected(extensions :string[]) {
        selected_extensions.value = extensions;
        gitinspector.value = "";
    }

    function setTimeSelected(start: string, end :string) {
        selected_start_date.value = start;
        selected_end_date.value = end;
        gitinspector.value = "";
    }


    async function gitinspectorScan() {
        if (!selected_repo_id.value || !selected_branch.value) { return; }
        gitinspector.value = "";

        const repo_id = selected_repo_id.value;
        const branch = selected_branch.value;
        const start_date = selected_start_date.value ? `${selected_start_date.value} 00:00:00` : null;
        const end_date = selected_end_date.value ? `${selected_end_date.value} 23:59:59` : null;
        
        loading.value = true;

        const scan_id = await startGitinspectorScan(repo_id, branch, selected_extensions.value, start_date, end_date);

        for (let i=0; i<60; i++) {
            try {
                gitinspector.value = await getGitinspectorScan(scan_id);
                break;
            }
            catch (err) {
                if (err instanceof ScanNotCompleted) {
                    await new Promise(r => setTimeout(r, 1000));
                }
                else {
                    scan_error.value = true;
                    break;
                }
            } 
        }

        loading.value = false;
    }

    function exportScan() {
        const pom = document.createElement("a");

        pom.setAttribute("href", `data:text/plain;charset=utf-8,${encodeURIComponent(gitinspector.value)}`);
        pom.setAttribute("download", `${selected_repo_id.value}_${selected_branch.value}_${Date.now()}.html`);
        
        pom.click();
    }

</script>