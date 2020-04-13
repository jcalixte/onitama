<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Play</router-link> –
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<script lang="ts">
export default {}
</script>

<style lang="scss">
@import './styles/index';
</style>
