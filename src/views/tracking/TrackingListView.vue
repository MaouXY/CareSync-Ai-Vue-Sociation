<template>
    
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const childId = ref(route.params.id)
</script>
<style scoped>
    .tracking-list-view {
        padding: 20px;
    }
</style>
