<template>

    <button id="dropdown-extensions" data-dropdown-toggle="dropdown-extensions-list" type="button" :disabled="props.disabled || loading"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-center 
                    text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
                    dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:bg-gray-500 dark:disabled:bg-gray-500">
        {{ t("extensions list") }} 
        <svg v-if="!loading && !props.disabled" class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        <Spinner v-if="loading" class="h-5 w-5 ml-1" />
    </button>

    <!-- Dropdown menu -->
    <div id="dropdown-extensions-list" class="z-10 hidden bg-white rounded-lg shadow dark:bg-gray-700">
        <ul class="h-fit py-3 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-extensions">
            <li :key="extension" v-for="extension in extensions">
                <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input :id="`checkbox-${extension}`" type="checkbox" :value="extension" :onchange="extensionChanged"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 
                                dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                    <label :for="`checkbox-${extension}`" class="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">{{ extension === "*" ? t("without extension") : extension }}</label>
                </div>
            </li>
        </ul>
    </div>


</template>
  
<script setup lang="ts">

    import { ref, onMounted, watch, onUpdated } from "vue";
    import { useI18n } from "vue-i18n";
    import locale from "@/locales/git";
    import { listExtensions } from "@/utilities/api/gitlab";
    import { initFlowbite } from "flowbite";
    import Spinner from "@/components/Spinner.vue";

    const { t } = useI18n({ messages: locale });

    const extensions = ref([] as string[]);
    const loading = ref(false);

    const props = defineProps({
        repo_id: { type: Number, required: true },
        branch: { type: String, required: true },
        disabled: { type: Boolean },
        onAdd: { type: Function },
        onRemove: { type: Function }
    });


    onMounted(async () => {
        loadExtensions(props.repo_id, props.branch);
    });

    onUpdated(() => {
        initFlowbite();
    });

    watch(() => [props.repo_id, props.branch], async ([new_repo_id, new_branch]) => {
        loadExtensions(new_repo_id as number, new_branch as string);
    });

    async function loadExtensions(repo_id :number, branch :string) {
        extensions.value = [];
        if (!repo_id || !branch) { return; }

        loading.value = true;
        extensions.value = await listExtensions(repo_id, branch);
        loading.value = false;
    }


    function extensionChanged(e :Event) {
        const target = e.target as HTMLInputElement;

        if (target.checked) {
            if (props.onAdd) { props.onAdd(target.value); }
        }
        else {
            if (props.onRemove) { props.onRemove(target.value); }
        }
    }

</script>