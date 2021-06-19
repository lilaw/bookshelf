import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Discover from "../views/Discover.vue";

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
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/discover",
    name: "Discover",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Discover.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
