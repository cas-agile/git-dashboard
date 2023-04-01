<template>

    <div class="flex">
        <div class="w-36">
            <RepositoriesList :onRepoSelected="repoSelected" />
        </div>

        <div class="flex-1 h-screen" v-if="selected_repo_id">

            <div class="flex flex-col h-full">
                <div class="mb-4 border-b border-gray-200 dark:border-gray-700">
                    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" data-tabs-toggle="#dashboard-content" role="tablist">
                        <li class="mr-2" role="presentation">
                            <button class="inline-block p-4 border-b-2 rounded-t-lg" id="gitinspector-tab" data-tabs-target="#gitinspector-content" 
                                    type="button" role="tab" aria-controls="gitinspector-content" aria-selected="false">Gitinspector</button>
                        </li>
                    </ul>
                </div>
    
                <div id="dashboard-content" class="flex-1 h-full">
                    <div class="hidden h-full" id="gitinspector-content" role="tabpanel" aria-labelledby="gitinspector-tab">
                        <GitInspector :repo_id="selected_repo_id" />
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>
  

<script setup lang="ts">

    import { ref, Ref, onUpdated } from "vue";
    import RepositoriesList from "@/components/RepositoriesList.vue";
    import GitInspector from "@/components/GitInspector.vue";
    import { initFlowbite } from "flowbite";

    const selected_repo_id :Ref<number|null> = ref(null);


    async function repoSelected(repo_id :number) {
        selected_repo_id.value = repo_id;
    }


    onUpdated(() => {
        initFlowbite();
    });

</script>