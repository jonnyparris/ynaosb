<template lang="pug">
.container
  div
    h1 Duvnab
    div
      h2 OffBudget
      BListGroup
        BListGroupItem.d-flex.justify-items-start(
          v-for='(balance, name) in iAccounts',
          :key='name'
        )
          span.flex-grow-1.pr-3 {{ name }}
          span {{ balance }}
    div
      h2 OnBudget
      BListGroup
        BListGroupItem.d-flex.justify-items-start(v-for='(balance, name) in accounts', :key='name')
          span.flex-grow-1.pr-3 {{ name }}
          span {{ balance }}
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { app } = useContext()

    const accounts = ref<any>()
    const iAccounts = ref<any>()

    useFetch(async () => {
      try {
        accounts.value = await app.$axios.$get('accountBalances')
        iAccounts.value = await app.$axios.$get('accountBalances?offBudget=true')
      } catch (e) {
        alert('data fetch booboo' + e)
      }
    })
    return {
      accounts,
      iAccounts,
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
