<template>

    <div class="flex">
        <div class="w-56 h-screen mr-3">
            <RepositoriesList :onRepoSelected="repoSelected" />
        </div>

        <div class="flex-1 h-screen">

            <div class="flex flex-col h-full">
                <div class="flex justify-between mb-4 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" data-tabs-toggle="#dashboard-content" role="tablist" v-if="selected_repo_id">
                            <li class="mr-2" role="presentation">
                                <button class="inline-block p-4 border-b-2 rounded-t-lg" id="gitinspector-tab" data-tabs-target="#gitinspector-content" 
                                        type="button" role="tab" aria-controls="gitinspector-content" aria-selected="false">Gitinspector</button>
                            </li>

                            <li class="mr-2" role="presentation">
                                <button class="inline-block p-4 border-b-2 rounded-t-lg" id="gource-tab" data-tabs-target="#gource-content" 
                                        type="button" role="tab" aria-controls="gource-content" aria-selected="false">Gource</button>
                            </li>
                        </ul>
                    </div>

                    <div class="flex items-center mr-3">
                        <ThemeSwitch />
                        <LocaleSwitch />
                    </div>
                </div>
    
                <div id="dashboard-content" class="flex-1 h-full" v-if="selected_repo_id">
                    <div class="hidden h-full" id="gitinspector-content" role="tabpanel" aria-labelledby="gitinspector-tab">
                        <GitInspector :key="selected_repo_id" :repo_id="selected_repo_id" />
                    </div>

                    <div class="hidden h-full" id="gource-content" role="tabpanel" aria-labelledby="gource-tab">
                        <Gource :key="selected_repo_id" :repo_id="selected_repo_id" />
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
    import Gource from "@/components/Gource.vue";
    import ThemeSwitch from "@/components/ThemeSwitch.vue";
    import LocaleSwitch from "@/components/LocaleSwitch.vue";
    import { initFlowbite } from "flowbite";

    const selected_repo_id :Ref<number|null> = ref(null);


    async function repoSelected(repo_id :number) {
        selected_repo_id.value = repo_id;
    }


    onUpdated(() => {
        initFlowbite();
    });

</script>