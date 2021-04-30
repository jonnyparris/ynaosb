<template lang="pug">
.container
  h1 duvnab
  p {{ yo }}
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const yo = ref<unknown>('yo')

    return {
      yo,
    }
  },
})
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
