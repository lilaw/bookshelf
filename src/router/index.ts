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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Finished.vue"),
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
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL || process.env.VUE_APP_BASE_URL),
  routes,
});

export default router;
