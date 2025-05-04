<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">Open Source Tools</h1>
      <ul class="space-y-8">
        <li v-for="(item, index) in items" :key="index" class="bg-white shadow rounded-lg p-6">
          <h2 class="text-2xl font-semibold text-gray-700">
            {{ item.title }}
          </h2>
          <p class="mt-2 text-gray-600">
            {{ item.description }}
          </p>
          <!-- Additional links section -->
          <div class="mt-4 flex space-x-4">
            <a
              :href="item.githubLink"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center space-x-2 text-blue-500 hover:underline"
            >
              <Icon name="mdi:github" />
              <span>GitHub Repo</span>
            </a>
            <a :href="item.infoLink" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
              More Information
            </a>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      items: [
        {
          title: "Cloud Courier",
          description: "Automatically and securely upload files to the cloud from laboratory computers.",
          githubLink: "https://github.com/LabAutomationAndScreening/cloud-courier",
          infoLink:
            "https://www.linkedin.com/posts/elifine_cloud-courier-features-activity-7296304579514613760-qMNd?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAJmpA0BEPhQL2QbSdJC41K21jp26HOfurM",
        },
        {
          title: "Pyalab",
          description: "Use Python to generate Vialab programs for the Integra ASSIST Plus robot.",
          githubLink: "https://github.com/LabAutomationAndScreening/pyalab",
          infoLink:
            "https://www.linkedin.com/posts/elifine_ngs-labautomation-lifesciences-activity-7275341895252197377-3GuJ?utm_source=share&utm_medium=member_desktop&rcm=ACoAAAJmpA0BEPhQL2QbSdJC41K21jp26HOfurM",
        },
      ],
    };
  },
};
</script>
<style scoped></style>
