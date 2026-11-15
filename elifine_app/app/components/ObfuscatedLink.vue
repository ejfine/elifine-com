<template>
  <span class="inline-flex items-center gap-1">
    <UButton
      v-bind="$attrs"
      :label="buttonLabel"
      :to="link?.href"
      :target="link?.opensInNewTab ? '_blank' : undefined"
      :disabled="link === undefined"
    />
    <UButton
      v-if="copyable && link !== undefined"
      icon="i-lucide-copy"
      color="neutral"
      variant="ghost"
      size="sm"
      :aria-label="`Copy ${link.text}`"
      @click="copyToClipboard(link.text, `Copied ${link.text}`)"
    />
  </span>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useAttrs } from "vue";

defineOptions({ inheritAttrs: false });

const { kind, copyable = false } = defineProps<{ kind: ContactKind; copyable?: boolean }>();

const attrs = useAttrs();

// Assembled only after mount, so neither the prerendered HTML nor the hydration payload contains it.
const link = ref<ContactLink>();
onMounted(() => {
  link.value = contactLink({ kind });
});

const buttonLabel = computed(() => {
  if (typeof attrs.label === "string") {
    return attrs.label;
  }
  if (link.value === undefined) {
    return "Loading…";
  }
  return link.value.text;
});
</script>
