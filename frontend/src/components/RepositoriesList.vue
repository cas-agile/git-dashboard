<template>
    <div class="h-full w-full overflow-auto" id="container-repo">
        <button :key="repo.id" v-for="repo in repositories" class="border rounded w-full mb-2" :onclick="() => props.onRepoSelected(repo.id)">
            <div class="py-4 px-2 text-left">
                <p class="truncate font-bold">{{ repo.name }}</p>
                <p class="truncate text-sm font-mono">{{ repo.path_with_namespace }}</p>
            </div>
        </button>

        <div v-if="currently_fetching" class="flex justify-center">
            <Spinner class="h-7 w-7" />
        </div>
    </div>
</template>
  
<script setup lang="ts">

    import { ref, onMounted } from "vue";
    import { listRepositories, GitlabRepository } from "@/utilities/api/gitlab";
    import Spinner from "./Spinner.vue";

    const repositories = ref([] as GitlabRepository[]);
    let currently_fetching = ref(false);
    let current_page = 1;
    let last_page = false;

    const props = defineProps([ "onRepoSelected" ]);

    onMounted(async () => {
        repositories.value = await fetchRepositories(current_page);

        // Repositories pagination handling
        document.querySelector("#container-repo")?.addEventListener("scroll", async () => {
            const container = document.querySelector("#container-repo");
            if (!container) { return; }
            
            const win_scroll = container.scrollTop;
            const height = container.scrollHeight - container.clientHeight;
            const scroll_percentage = win_scroll / height;
            
            if (scroll_percentage >= 0.7 && !last_page && !currently_fetching.value) {
                current_page++;
                const next_page = await fetchRepositories(current_page);
                
                if (next_page.length === 0) {
                    last_page = true;
                }
                else {
                    repositories.value = repositories.value.concat( next_page );
                }
            }
        });
    });

    async function fetchRepositories(page :number) {
        currently_fetching.value = true;
        const repos = await listRepositories(page);
        currently_fetching.value = false;

        return repos;
    }

</script>