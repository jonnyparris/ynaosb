<template lang="pug">
.container
  div
    h1 Duvnab
    BTable(:items='iAccounts', :fields='columns', fixed, striped)
</template>

<script lang="ts">
import { defineComponent, ref, useContext, useFetch } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    const { app } = useContext()
    const iAccounts = ref<any>()
    const columns = ref<any>()

    useFetch(async () => {
      try {
        iAccounts.value = await app.$axios.$get('investment-accounts')
        columns.value = Object.keys(iAccounts.value[0]).map((k) => ({
          label: k,
          field: k,
          class: k === 'name' ? '' : 'text-right',
        }))
      } catch (e) {
        alert('data fetch booboo' + e)
      }
    })
    return {
      iAccounts,
      columns,
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
