<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    If you're interested in my work or have any questions, feel free to reach out via email:
    <ClientOnly><a ref="emailLink">[loading email…]</a></ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";

const emailLink = ref<HTMLAnchorElement | null>(null);

onMounted(() => {
  nextTick(() => {
    // need to wait for initial DOM to populate in order for the `<a>` tag not to be null
    // split your address into parts
    const user = "e.j.fine";
    const domain = "gmail";
    const tld = "com";
    const email = `${user}@${domain}.${tld}`;
    console.log("here in mounted");
    // inject into the <a>
    if (emailLink.value) {
      console.log("in the if");
      emailLink.value.href = `mailto:${email}`;
      emailLink.value.textContent = email;
    }
  });
});
</script>
