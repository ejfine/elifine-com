<script setup lang="ts">
const appConfig = useAppConfig();
const items = [
  {
    label: "Home",
    to: "/",
  },
  {
    label: "Open Source Tools",
    to: "/open-source",
  },
  {
    label: "About",
    to: "/about",
  },
  {
    label: "Contact",
    to: "/contact",
  },
];
// Map allowed text colors to their Tailwind background classes

const primaryTextColorMap: Record<string, string> = {
  blue: "text-blue-600",
  sky: "text-sky-600",
  red: "text-red-600",
  green: "text-green-600",
  slate: "text-slate-600",
  // Add other allowed values as needed
};

const primaryTextClass = primaryTextColorMap[appConfig.ui.neutral];
</script>

<template>
  <UApp>
    <div class="min-h-screen flex flex-col">
      <header :class="['bg-slate-100', primaryTextClass, 'py-4']">
        <UContainer>
          <div class="flex items-center justify-between">
            <div class="text-xl font-bold">
              Laboratory Automation, Software &amp; Informatics Consulting<br />by Eli Fine, PhD
            </div>
            <nav>
              <ul class="flex space-x-4">
                <UNavigationMenu :items="items" />
              </ul>
            </nav>
          </div>
        </UContainer>
      </header>

      <!-- Main content slot -->
      <main class="flex-grow">
        <UContainer class="py-8">
          <slot />
        </UContainer>
      </main>

      <!-- Footer -->
      <footer class="bg-gray-100 text-center py-4">
        <UContainer>
          <p class="text-sm">&copy; 2025 Eli Fine. All rights reserved.</p>
        </UContainer>
      </footer>
    </div></UApp
  >
</template>
