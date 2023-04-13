<template>

    <label for="branches" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        <div class="flex items-end">
            Branch <Spinner class="h-5 w-5 ml-1 inline-block" v-if="loading" />
        </div>
    </label>
    <select id="branches" :disabled="loading || props.disabled" class="border rounded-lg block w-full p-2 text-sm
                                bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-300/50
                                dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:disabled:bg-gray-700/50"
                        :onchange="branchSelected">
        <option value="" selected>{{ t("select branch") }}</option>
        <option :key="`${props.repo_id}_${branch.name}`" v-for="branch in branches" :value="branch.name">{{ branch.name }}</option>
    </select>

</template>
  
<script setup lang="ts">

    import { ref, onMounted, watch } from "vue";
    import { listBranches, GitlabBranch } from "@/utilities/api/gitlab";
    import Spinner from "./Spinner.vue";
    import { useI18n } from "vue-i18n";
    import locale from "@/locales/git";
    
    const { t } = useI18n({ messages: locale });

    const branches = ref([] as GitlabBranch[]);
    const loading = ref(false);

    const props = defineProps({
        repo_id: { type: Number, required: true },
        onBranchSelected: { type: Function },
        disabled: { type: Boolean }
    });

    onMounted(async () => {
        await loadBranches(props.repo_id);
    });

    watch(() => props.repo_id, async (new_repo_id) => {
        await loadBranches(new_repo_id);
    });

    async function loadBranches(repo_id :number) {
        loading.value = true;
        branches.value = await listBranches(repo_id);
        loading.value = false;
    }

    function branchSelected(e :Event) {
        const selected_branch = (e.target as HTMLSelectElement).value;
        if (selected_branch === "") { return; }
        
        if (props.onBranchSelected) {
            props.onBranchSelected(selected_branch);
        };
    }

</script>