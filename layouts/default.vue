<template>
    <div class="layout">
        <header class="d-flex justify-center">
            <Header/>
        </header>
        <main class="main">
            <slot></slot>
        </main>
        <footer>
            <Footer/>
        </footer>
    </div>
</template>

<style scoped>
.layout {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
}
.main {
    margin-top: 90px;
}
</style>