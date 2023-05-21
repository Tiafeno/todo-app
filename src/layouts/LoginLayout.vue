<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: 'LoginLayout'
})
</script>

<template>
  <q-layout view="hhh Lpr ffr">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>

</style>
