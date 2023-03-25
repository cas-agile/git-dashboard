<template>
    <div v-for="repo in repositories">
        <button :key="repo.id" class="border rounded w-full mb-2">
            <div class="py-3 px-1 text-left">
                <p class="truncate font-bold">{{ repo.name }}</p>
                <p class="truncate text-sm font-mono">{{ repo.path_with_namespace }}</p>
            </div>
        </button>
    </div>
</template>
  
<script setup lang="ts">

    import { ref, onMounted } from "vue";
    import { listRepositories, GitlabRepository } from "@/utilities/api/gitlab";

    const repositories = ref([] as GitlabRepository[]);

    onMounted(async () => {
        repositories.value = await listRepositories();
        console.log(repositories.value);
    })

</script>