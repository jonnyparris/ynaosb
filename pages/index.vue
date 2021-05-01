<template lang="pug">
.container
  div
    h1 duvnab
    BListGroup
      BListGroupItem.d-flex.justify-items-start(v-for='(balance, name) in accounts', :key='name')
        span.flex-grow-1.mr-4 {{ name }}
        span {{ balance / 100 }}
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { app } = useContext()

    const accounts = ref<any>()

    useFetch(async () => {
      try {
        accounts.value = await app.$axios.$get('accountBalances')
      } catch (e) {
        alert('data fetch booboo' + e)
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
}
</style>
