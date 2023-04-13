<template>

    <!-- Toggle button -->
    <button id="dropdown-extensions" data-dropdown-toggle="dropdown-extensions-list" type="button" :disabled="props.disabled || loading"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-center border rounded-lg
                    bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-300/50 
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:disabled:bg-gray-700/50">
        {{ t("extensions filter") }} 
        <svg v-if="!loading && !props.disabled" class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        <Spinner v-if="loading" class="h-5 w-5 ml-1" />
    </button>

    <!-- Dropdown menu -->
    <div id="dropdown-extensions-list" class="z-10 hidden bg-white rounded-lg shadow dark:bg-gray-700">
        <ul class="h-fit py-3 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-extensions">
            <li :key="extension" v-for="extension in extensions">
                <div class="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input :id="`checkbox-${extension}`" type="checkbox" :value="extension" :onchange="extensionChanged" v-model="extensions_status[extension]"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 
                                dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                    <label :for="`checkbox-${extension}`" class="w-full ml-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">{{ extension === "*" ? t("without extension") : extension }}</label>
                </div>
            </li>
        </ul>

        <!-- Select all -->
        <button v-if="selected_extensions.length < extensions.length" :onclick="selectAll"
                class="flex items-center p-3 text-sm font-medium text-blue-600 border-t border-gray-200 rounded-b-lg bg-gray-50 
                        dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline">
            <svg class="w-5 h-5 mr-1 text-blue-600" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" fill="currentColor"><path d="M180 936q-24.75 0-42.375-17.625T120 876V276q0-24.75 17.625-42.375T180 216h600q14 0 25.5 6t18.5 14l-44 44v-4H180v600h600V533l60-60v403q0 24.75-17.625 42.375T780 936H180Zm281-168L239 546l42-42 180 180 382-382 42 42-424 424Z"/></svg>
            {{ t("select all") }}
        </button>
        <!-- Deselect all -->
        <button v-if="selected_extensions.length === extensions.length" :onclick="deselectAll"
                class="flex items-center p-3 text-sm font-medium text-blue-600 border-t border-gray-200 rounded-b-lg bg-gray-50 
                        dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-blue-500 hover:underline">
            <svg class="w-5 h-5 mr-1 text-blue-600" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48" fill="currentColor"><path d="M250 604h461v-60H250v60Zm-70 332q-24 0-42-18t-18-42V276q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600V276H180v600Zm0-600v600-600Z"/></svg>
            {{ t("deselect all") }}
        </button>

    </div>


</template>
  
<script setup lang="ts">

    import { ref, onMounted, watch, onUpdated, computed } from "vue";
    import { useI18n } from "vue-i18n";
    import locale from "@/locales/git";
    import { listExtensions } from "@/utilities/api/gitlab";
    import { initFlowbite } from "flowbite";
    import Spinner from "@/components/Spinner.vue";

    const { t } = useI18n({ messages: locale });

    const loading = ref(false);
    const extensions = ref([] as string[]); // List of extensions for the current repository configuration
    const extensions_status = ref({} as { [id :string] : boolean }); // Map each extension to the relative checkbox status (true if selected, false otherwise)

    // List of all selected extensions
    const selected_extensions = computed( () => Object.entries(extensions_status.value).filter(([ext, is_selected]) => is_selected).map(entry => entry[0]) );

    const props = defineProps({
        repo_id: { type: Number, required: true },
        branch: { type: String, required: true },
        disabled: { type: Boolean },
        onchange: { type: Function }
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
        // Resets selection values
        extensions_status.value = {};
        for (const ext of extensions.value) {
            extensions_status.value[ext] = false;
        }

        loading.value = false;
    }


    function extensionChanged(e :Event) {
        if (props.onchange) { props.onchange(selected_extensions.value); }
    }

    function selectAll() {
        for (let extension of Object.keys(extensions_status.value)) {
            extensions_status.value[extension] = true;
        }
        if (props.onchange) { props.onchange(selected_extensions.value); }
    }

    function deselectAll() {
        for (let extension of Object.keys(extensions_status.value)) {
            extensions_status.value[extension] = false;
        }
        if (props.onchange) { props.onchange(selected_extensions.value); }
    }

</script>