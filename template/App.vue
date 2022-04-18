<template>
  <div>template</div>

  <HelloWorldVue msg="vite-multiple-packages" />
</template>

<script setup>
import HelloWorldVue from '@/components/HelloWorld.vue';
</script>

<style>
html {
  font-size: 16px;
}
@media screen and (max-width: 750px) {
  html {
    font-size: calc(32vw / 15);
  }
}
body {
  max-width: 750px;
  margin: 0 auto;
  height: 100vh;
  overflow-y: auto;
  perspective: 0;
}
* {
  box-sizing: border-box;
}
</style>
