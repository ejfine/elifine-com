<template>
  <div class="flex flex-col items-center justify-center">
    <div class="space-y-4">
      <img :src="headshot" class="w-1/2" />

      <!-- LinkedIn -->
      <a
        href="https://www.linkedin.com/in/elifine"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center space-x-2 text-blue-600 hover:underline"
      >
        <Icon name="mdi:linkedin" />
        <span>LinkedIn</span>
      </a>

      <!-- GitHub -->
      <a
        href="https://github.com/ejfine"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center space-x-2 hover:underline"
      >
        <Icon name="mdi:github" />
        <span>GitHub</span>
      </a>

      <!-- Resume -->
      <a
        href="/resume-eli-fine.pdf"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center space-x-2 text-green-600 hover:underline"
      >
        <Icon name="mdi:file-document-outline" />
        <span>Resume</span>
      </a>

      <!-- Google Scholar -->
      <div class="flex flex-col items-start space-y-1">
        <a
          href="https://scholar.google.com/citations?user=eBFJX7QAAAAJ"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center space-x-2 text-purple-600 hover:underline"
        >
          <Icon name="mdi:school" />
          <span>Google Scholar</span>
        </a>
        <p class="text-sm text-gray-500 ml-6">H-Index: 13 | Total Citations: 8100+</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import headshot from "~/assets/images/eli-headshot.png";
</script>

<style>
/* Optional: Add global styles or modify TailwindCSS styles */
</style>
