export function SelectUsersPreset (name: string, pathName = 'select-users', meta: Record<string, unknown>) {
  return {
    name,
    pathName,
    component: () => import('@/views/tempViews/UserSelectView.vue'),
    meta: {
      title: 'Benutzer auswählen',
      ...meta
    }
  }
}

export function SelectLocationPreset (name: string, pathName = 'select-location', meta?: Record<string, unknown>) {
  return {
    name,
    pathName,
    component: () => import('@/views/tempViews/LocationSelectView.vue'),
    meta: {
      title: 'Standort auswählen',
      ...meta
    }
  }
}
