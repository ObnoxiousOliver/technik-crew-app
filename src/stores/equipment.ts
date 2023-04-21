import { Equipment, EquipmentDB, NoteDB } from '@/model/equipment'
import { useOffline } from '@/utilities/offline'
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
    console.log('[Equipment] Subscribing to equipment')

    unsubscribe?.()

    Equipment.get(undefined, null, false).then((eq) => {
      equipment.value = eq as Equipment[]
    }).finally(() => {
      loading.value = false
    })

    unsubscribe = Equipment.subscribe((type, eq) => {
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
    if (useOffline().value) return

    if (user) {
      if (unsubscribe) return
      subscribe()
    } else if (getAuth().currentUser) {
      unsubscribe?.()
      unsubscribe = null
    }
  })
  // Unsubscribe if offline-mode is enabled
  watch(useOffline(), (offline) => {
    if (offline) {
      unsubscribe?.()
      unsubscribe = null
    } else {
      subscribe()
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

  /**
   * Get notes of an equipment
   * @param eq Equipment
   * @returns Notes
   * @returns cached notes if offline
   * @returns undefined if equipment has no ID
   * @async
   */
  async function getNotes (eq: Equipment) {
    if (!eq.id) return

    if (useOffline().value) {
      return notes.value[eq.id] ?? {}
    }

    const n = await eq.getNotes() as Record<string, NoteDB>
    notes.value[eq.id] = n
    return n
  }

  async function split (eq: Equipment, amount: number) {
    if (useOffline().value) return

    if (!eq.amount) return
    if (amount < 1) return
    if (amount % 1 !== 0) return
    if (amount >= eq.amount) return

    const newEq = await Equipment.create({
      ...eq.toDB(),
      code: null,
      amount: eq.amount - amount
    }, false)

    // Copy notes
    const n = await getNotes(newEq)
    if (n) {
      await newEq.setNotes(n, false)
    }

    // Copy History
    const h = await eq.getHistory()
    await newEq.setHistory(h)

    // Update old equipment
    eq.setAmount(amount, false)
    eq.recordHistory({
      description: 'Anzahl geteilt auf -> ' + amount + ' + ' + newEq.amount
    })
    newEq.recordHistory({
      description: 'Anzahl geteilt von -> ' + amount + ' + ' + eq.amount
    })
  }

  return {
    equipment,
    groups,
    loading,
    findByCode,
    findByID,
    subscribeNotes,
    getNotes,
    split
  }
})
