export function SelectUsersPreset (name: string, pathName = 'select-users') {
  return {
    name,
    pathName,
    component: () => import('@/views/tempViews/UserSelectView.vue'),
    meta: {
      title: 'Benutzer auswählen'
    }
  }
}
