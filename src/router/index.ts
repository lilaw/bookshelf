import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/discover" },
  {
    path: "/list",
    name: "readingList",
    component: () =>
      import(/* webpackChunkName: "readingList" */ "../views/ReadingList.vue"),
  },
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Home,jk
  // },
  {
    path: "/finished",
    name: "finished",
    component: () =>
      import(/* webpackChunkName: "finished" */ "../views/Finished.vue"),
  },
  {
    path: "/discover",
    name: "Discover",
    component: () =>
      import(/* webpackChunkName: "discover" */ "../views/Discover.vue"),
  },
  {
    path: "/books/:bookId",
    component: () => import(/* webpackChunkName: "book" */ "../views/Book.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () =>
      import(/* webpackChunkName: "notFound" */ "../views/notFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(
    process.env.BASE_URL || process.env.VUE_APP_BASE_URL
  ),
  routes,
});

export default router;
