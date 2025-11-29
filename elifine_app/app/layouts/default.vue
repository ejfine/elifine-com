<template>
  <UApp>
    <UDashboardGroup>
      <UDashboardSidebar
        v-model:open="sidebarOpen"
        :collapsed="collapsedRef"
        collapsible
        resizable
        class="bg-elevated/25"
        :ui="{
          footer: 'lg:border-t lg:border-default',
          header: 'lg:border-b lg:border-default',
        }"
      >
        <template #header="{ collapsed }"> </template>
        <template #default="{ collapsed }">
          <UNavigationMenu :collapsed="collapsed" :items="links[0]" orientation="vertical" tooltip popover />
          <UNavigationMenu
            :collapsed="collapsed"
            :items="links[1]"
            orientation="vertical"
            tooltip
            popover
            class="mt-auto"
          />
        </template>
        <template #footer> <UColorModeSwitch data-testid="toggle-color-mode-button" /> </template>
      </UDashboardSidebar>
      <div class="flex-1 h-screen flex flex-col min-w-0">
        <UHeader toggle-side="left">
          <template #title>
            <div class="font-bold text-xl text-highlighted">
              <span class="hidden lg:inline">Laboratory Automation, Software & Informatics Consulting</span>
              <span class="lg:hidden">Laboratory Automation,<br />Software & Informatics Consulting</span>
            </div>
          </template>
          <template #body
            ><UNavigationMenu :items="links[0]" orientation="vertical" tooltip popover />
            <USeparator />
            <UNavigationMenu :items="links[1]" orientation="vertical" tooltip popover class="mt-auto" />
            <USeparator class="mb-2" /><UColorModeSwitch data-testid="toggle-color-mode-button"
          /></template>
        </UHeader>
        <UMain class="flex-1 min-h-0 min-w-0 overflow-auto p-4"> <slot /></UMain>
        <UFooter :ui="{ root: 'pb-safe' }">
          &copy; {{ new Date().getFullYear() }} Eli Fine. All rights reserved.</UFooter
        >
      </div>
    </UDashboardGroup>
  </UApp>
</template>
<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const sidebarOpen = ref(false);
const collapsedRef = ref(false);
defineExpose({
  collapsedRef, // needed for unit testing
});
const links = [
  [
    {
      label: "Home",
      to: "/",
      icon: "i-lucide-house",
    },
    { label: "About", to: "/about", icon: "i-lucide-info" },
    { label: "Open Source Tools", to: "/open-source", icon: "i-lucide-file-code" },
  ],

  [{ label: "Contact", to: "/contact", icon: "i-lucide-mail" }],
] satisfies NavigationMenuItem[][];
</script>

<style>
/* Remove scoped to allow global CSS variable override */
:root {
  /* Set header height to 5rem on small screens */
  --ui-header-height: 5rem !important;
}

@media (min-width: 1024px) {
  :root {
    --ui-header-height: 4rem !important;
  }
}
</style>
