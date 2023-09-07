import router, { back, temporaryRoute } from '@/router'
import { defineStore } from 'pinia'
import { ref, Component, watch } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export const useTemp = defineStore('temp', () => {
  const data = ref({} as Record<string, unknown>)

  // Load and save data to local storage
  watch(data, () => {
    localStorage.setItem('temp_data', JSON.stringify(data.value))
  }, { deep: true })
  data.value = JSON.parse(localStorage.getItem('temp_data') || '{}')

  function setData (name: string, d: unknown) {
    data.value[name] = d

    return (_deleteData = true) => getData(name, _deleteData)
  }

  function getData (name: string, _deleteData = true) {
    const d = data.value[name]
    if (_deleteData) deleteData(name)
    return d
  }

  function deleteData (name: string) {
    delete data.value[name]
  }

  function tempRoute (options: {
    name: string
    pathName: string
    component: Component
    meta?: Record<string, unknown>
  }) {
    const { name, pathName, component, meta } = options

    temporaryRoute(name, pathName, component, meta)

    return {
      getData: (_deleteData = true) => getData(name, _deleteData),
      route: {
        name,
        query: {
          back: router.currentRoute.value.fullPath
        }
      } as RouteLocationRaw
    }
  }

  function setDataFromTempRoute (d: unknown, routeBack = true) {
    data.value[router.currentRoute.value.name as string] = d
    if (routeBack) back()
  }
  function getDataFromTempRoute (_deleteData = true) {
    return getData(router.currentRoute.value.name as string, _deleteData)
  }

  return {
    tempRoute,
    setDataFromTempRoute,
    getDataFromTempRoute,
    setData,
    getData,
    deleteData,
    data
  }
})
