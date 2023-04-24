<template>

    <div class="flex flex-col h-full" v-if="selected_repo_id">
        <div class="mb-2">
            <div class="flex items-end justify-between h-full">

                <div class="h-full flex items-end [&>*]:mr-2">
                    <div class="w-fit" v-if="selected_repo_id">
                        <BranchesList :repo_id="selected_repo_id" :onBranchSelected="branchSelected" :disabled="loading" />
                    </div>
                    
                    <div class="h-full flex items-end [&>*]:mr-2" v-if="selected_repo_id && selected_branch">
                        <button :onclick="gourceRender" :disabled="!selected_repo_id || !selected_branch || loading" type="button" 
                                class="font-medium rounded-lg px-5 py-2.5 h-full focus:ring-4 focus:outline-none
                                    text-white bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 disabled:bg-blue-700/50 
                                    dark:text-white dark:bg-blue-600  dark:hover:bg-blue-700 dark:focus:ring-blue-800 dark:disabled:bg-blue-600/50">
                            <div class="flex items-center">
                                {{ t("generate") }}
                            </div>
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <div v-if="video_url" class="flex-1">
            <div class="flex justify-center items-center h-full py-2">
                <video controls class="h-full">
                    <source :src="video_url" type="video/mp4">
                </video>
            </div>
        </div>

        <div v-if="loading" class="flex-1 flex justify-center items-center">
            <div>
                <div class="flex justify-center">
                    <Spinner class="w-40 h-40 inline" />
                </div>
                <span class="text-center text-3xl mt-2">{{ t("gource loading") }}</span>
            </div>
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
    import { startGource, getGourceVideoURL } from "@/utilities/api/gource";
    import { useI18n } from "vue-i18n";
    import locale from "@/locales/git";
    
    const { t } = useI18n({ messages: locale });

    const props = defineProps({
        repo_id: { type: Number }
    });

    const selected_repo_id :Ref<number|undefined> = ref(props.repo_id);
    const selected_branch = ref("");
    const video_url = ref(null as string|null);
    const loading = ref(false);
    const scan_error = ref(false);


    watch(() => props.repo_id, async (new_repo_id) => {
        // Resets values
        selected_repo_id.value = new_repo_id;
        selected_branch.value = "";
        video_url.value = null;
    });

    function branchSelected(branch :string) {
        selected_branch.value = branch;
        video_url.value = null;
    }


    async function gourceRender() {
        if (!selected_repo_id.value || !selected_branch.value) { return; }
        video_url.value = null;

        const repo_id = selected_repo_id.value;
        const branch = selected_branch.value;
        
        loading.value = true;

        const job_id = await startGource(repo_id, branch);

        while (true) {
            try {
                const url = await getGourceVideoURL(job_id)
                if (url) {
                    video_url.value = url;
                    break;
                }
                else {
                    await new Promise(r => setTimeout(r, 5000));
                }
            }
            catch (err) {
                scan_error.value = true;
                break;
            } 
        }

        loading.value = false;
    }

</script>