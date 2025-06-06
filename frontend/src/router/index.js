// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import SnippetManager from "@/components/SnippetManager.vue";
import CreateProject from "@/components/CreateProject.vue";

const routes = [
  { path: "/", redirect: "/snippets" },
  { path: "/snippets", component: SnippetManager },
  { path: "/create-project", component: CreateProject },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
