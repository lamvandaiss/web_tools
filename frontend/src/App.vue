<template>
  <div>
    <nav>
      <router-link to="/snippets">Snippet Manager</router-link>
      <router-link to="/create-project">Create Project</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
nav {
  display: flex;
  column-gap: 20px;
}
</style>
