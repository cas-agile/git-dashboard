<template>

    <div class="flex">

        <label class="mr-3">
            <div class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ t("start date") }}</div>
            <input :onchange="setStartDate" v-model="start_date" type="date" :max="end_date" 
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
                            dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </label>

        <label>
            <div class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ t("end date") }}</div>
            <input :onchange="setEndDate" v-model="end_date" type="date" :min="start_date"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
        </label>

    </div>

</template>
  
<script setup lang="ts">

    import { ref } from "vue";
    import { useI18n } from "vue-i18n";
    import locale from "@/locales/git";

    const { t } = useI18n({ messages: locale });

    const start_date = ref("");
    const end_date = ref("");


    const props = defineProps({
        onchange: { type: Function }
    });


    function setStartDate(e :Event) {
        const new_date = (e.target as HTMLInputElement).value;
        if (props.onchange) {
            props.onchange(new_date, end_date.value);
        }
    }
    
    function setEndDate(e :Event) {
        const new_date = (e.target as HTMLInputElement).value;
        if (props.onchange) {
            props.onchange(start_date.value, new_date);
        }
    }

</script>