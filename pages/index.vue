<template lang="pug">
.container
  div
    h1 duvnab
    BListGroup
      BListGroupItem(v-for='(account, index) in accounts', :key='index') {{ account }}
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { app } = useContext()

    const accounts = ref<unknown>()

    useFetch(async () => {
      try {
        accounts.value = await app.$axios.$get('accounts')
      } catch (e) {
        console.error('data fetch booboo', e)
      }
    })
    return {
      accounts,
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
