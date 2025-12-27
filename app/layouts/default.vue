<script setup lang="ts">
import Footer from '~/components/ui/Footer.vue'
import Header from '~/components/ui/Header.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />

    <main class="flex-1">
      <slot />
    </main>

    <Footer class="fixed bottom-0 left-0 right-0" />
  </div>
</template>
