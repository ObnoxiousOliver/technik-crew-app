import { Equipment, EquipmentDB, NoteDB } from '@/model/equipment'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { defineStore } from 'pinia'
import { Ref, computed, ref, watch } from 'vue'

export const useEquipment = defineStore('equipment', () => {
  const equipment = ref([]) as Ref<Equipment[]>
  const groups = computed(() => {
    return Equipment.getGroups(equipment.value)
  })

  const loading = ref(true)

  function findByCode (code: string) {
    return equipment.value.find((e) => e.code === code)
  }

  function findByID (id: string) {
    return equipment.value.find((e) => e.id === id)
  }

  // Load equipment from local storage
  watch(equipment, (eq) => {
    localStorage.setItem('equipment', JSON.stringify(
      eq.map((e) => [e.id, e.toDB()])
    ))
  }, { deep: true })
  equipment.value = JSON.parse(localStorage.getItem('equipment') || '[]')
    .map((e: [string, EquipmentDB]) => new Equipment(e[0], e[1]))

  // Subscribe to changes
  let unsubscribe: (() => void) | null = null
  function subscribe () {
    unsubscribe?.()

    unsubscribe = Equipment.subscribe((type, eq) => {
      loading.value = false
      console.log('[Equipment] Equipment changed', type, eq)
      const index = equipment.value.findIndex((e) => e.id === eq.id)
      if (index === -1) {
        equipment.value.push(eq)
        return
      }

      switch (type) {
        case 'added':
        case 'modified':
          equipment.value[index] = eq
          break
        case 'removed':
          equipment.value.splice(index, 1)
          break
      }
    })
  }
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      if (unsubscribe) return
      subscribe()
    } else {
      unsubscribe?.()
      unsubscribe = null
    }
  })

  // Subscribe to Notes
  const notes = ref({}) as Ref<Record<string, Record<string, NoteDB>>>

  let unsubscribeNotes: (() => void) | null = null
  function subscribeNotes (eq: Equipment | string, onChange: (notes: Record<string, NoteDB>) => void) {
    unsubscribeNotes?.()

    const _eq: Equipment | undefined = typeof eq === 'string' ? findByID(eq) : eq

    if (!_eq) throw new Error('Equipment not found')
    const id = _eq.id
    if (!id) throw new Error('Equipment has no ID')

    console.log('[Equipment] Subscribing to notes of', id)

    onChange(notes.value[id] ?? {})

    unsubscribeNotes = _eq.subscribeNotes((type, note) => {
      console.log('[Equipment] Notes changed', type, note)

      if (type === 'removed') {
        delete notes.value[id][note.id]
      } else {
        if (!notes.value[id]) {
          notes.value[id] = {}
        }
        notes.value[id][note.id] = note.note
      }

      onChange(notes.value[id])
    })

    return () => {
      unsubscribeNotes?.()
      unsubscribeNotes = null
    }
  }

  return {
    equipment,
    groups,
    loading,
    findByCode,
    findByID,
    subscribeNotes
  }
})
