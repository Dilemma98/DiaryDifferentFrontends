<template>
  <header-component />
  <appDiaryEntries />
</template>

<script>
import appDiaryEntries from './components/app-diary-entries.vue';
import headerComponent from './components/headerComponent.vue';

export default {
  name: 'App',
  components: {
    headerComponent,
    appDiaryEntries
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
