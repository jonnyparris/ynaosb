<template lang="pug">
.container
  h1 duvnab
  p {{ yo }}
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { app } = useContext()

    const yo = ref<unknown>('yo')

    onMounted(async () => {
      try {
        yo.value = await app.$axios.$get('accounts')
      } catch (e) {
        console.error('data fetch booboo', e)
      }
    })
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
