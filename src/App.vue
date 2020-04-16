<template>
  <div id="app">
    <div id="nav">
      <router-link class="button is-text" to="/">Home</router-link>
      <router-link class="button is-text" to="/rules">Rules</router-link>
      <router-link class="button is-text" to="/about">About</router-link>
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
