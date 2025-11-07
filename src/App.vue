<script setup lang="ts">
import ChatRoom from './components/ChatRoom.vue'
</script>


<template>
  <div id="app">
    <!-- Using the existing ChatRoom component instead of the missing CubeWall -->
    <ChatRoom />
  </div>
</template>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>