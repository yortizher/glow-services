<template>
    <v-app>
      <div class="layout">
        <header>
          <Header />
        </header>
        <main class="main">
          <slot></slot>
        </main>
        <footer>
          <Footer />
        </footer>
      </div>
    </v-app>
  </template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
}

.main {
  flex: 1;
  padding-top: 90px;
}

</style>