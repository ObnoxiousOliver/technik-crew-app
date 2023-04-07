import router, { back, temporaryRoute } from '@/router'
import { defineStore } from 'pinia'
import { ref, Component, watch } from 'vue'

export const useTemp = defineStore('temp', () => {
  const data = ref({} as Record<string, unknown>)

  // Load and save data to local storage
  watch(data, () => {
    localStorage.setItem('temp_data', JSON.stringify(data.value))
  }, { deep: true })
  data.value = JSON.parse(localStorage.getItem('temp_data') || '{}')

  function setData (name: string, d: unknown) {
    data.value[name] = d

    return (deleteData = true) => getData(name, deleteData)
  }

  function getData (name: string, deleteData = true) {
    const d = data.value[name]
    if (deleteData) delete data.value[name]

    if (d) {
      return d as unknown
    } else {
      return null
    }
  }

  function tempRoute (options: {
    name: string
    pathName: string
    component: Component
    meta?: Record<string, unknown>
  }) {
    const { name, pathName, component, meta } = options

    temporaryRoute(name, pathName, component, meta)

    return (deleteData = true) => getData(name, deleteData)
  }

  function setDataFromTempRoute (d: unknown, routeBack = true) {
    data.value[router.currentRoute.value.name as string] = d
    if (routeBack) back()
  }
  function getDataFromTempRoute (deleteData = true) {
    return getData(router.currentRoute.value.name as string, deleteData)
  }

  return {
    tempRoute,
    setDataFromTempRoute,
    getDataFromTempRoute,
    setData,
    getData
  }
})
