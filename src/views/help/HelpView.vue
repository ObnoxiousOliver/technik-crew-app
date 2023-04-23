<template>
  <Page>
    <template #title>
      Hilfe und Support
    </template>

    <p>
      Hier findest du Hilfe und Support für die App.
    </p>

    <h3>FAQ</h3>

    <ul class="bullet-list">
      <li>
        <RouterLink :to="{ name: 'help-offline' }">
          Was ist der Offline Modus?
        </RouterLink>
      </li>

      <li>
        <RouterLink :to="{ name: 'help-admins' }">
          Wer sind die Admins?
        </RouterLink>
      </li>
    </ul>

    <h3>Support</h3>

    <p>
      Wenn du Hilfe brauchst, kannst du gerne die Admins anschreiben.
    </p>
  </Page>
</template>
