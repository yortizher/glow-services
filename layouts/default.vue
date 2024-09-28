<template>
    <v-app>
      <div class="layout">
        <header>
          <Header />
        </header>
        <main class="main">
          <slot></slot>
          <IconsLayout />
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </v-app>
  </template>

<style scoped>
.layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
  overflow: hidden;
}
.main {
  margin-top: 90px;
}
</style>