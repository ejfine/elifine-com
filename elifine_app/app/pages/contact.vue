<template>
  <div class="flex flex-col items-center justify-center">
    If you're interested in my work or have any questions, feel free to reach out via email:
    <ClientOnly><a ref="emailLink">[loading email…]</a></ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";

const emailLink = ref<HTMLAnchorElement | null>(null);

onMounted(() => {
  nextTick(() => {
    // need to wait for initial DOM to populate in order for the `<a>` tag not to be null
    // split your address into parts
    const user = "e.j.fine";
    const domain = "gmail";
    const tld = "com";
    const email = `${user}@${domain}.${tld}`;
    // inject into the <a>
    if (emailLink.value) {
      emailLink.value.href = `mailto:${email}`;
      emailLink.value.textContent = email;
    }
  });
});
</script>
