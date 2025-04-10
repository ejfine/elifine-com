<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    If you're interested in my work or have any questions, feel free to reach out via email:
    <a :href="mailto">{{ obfuscatedEmail }}</a>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      // Store parts of your email address separately
      user: "e.j.fine",
      domain: "gmail",
      tld: "com",
    };
  },
  computed: {
    // Combine the parts into a full email address
    obfuscatedEmail() {
      return `${this.user}@${this.domain}.${this.tld}`;
    },
    // Create a mailto link using the obfuscated email
    mailto() {
      return `mailto:${this.obfuscatedEmail}`;
    },
  },
};
</script>
