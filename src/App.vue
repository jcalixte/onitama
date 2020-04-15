<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> –
      <router-link to="/rules">Rules</router-link> –
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
