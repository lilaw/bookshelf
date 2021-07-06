<template>
  <div class="layout">
    <Header />
    <el-row>
      <el-col :span="4">
        <sidebar />
      </el-col>
      <el-col :span="20" class="content">
        <router-view :key="$route.fullPath" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Header from "@/layout/Header.vue";
import Sidebar from "@/layout/Sidebar.vue";

export default defineComponent({
  setup() {
    return {};
  },
  components: {
    Header,
    Sidebar,
  },
});
</script>

<style lang="scss" scope>
.layout {
  min-height: 98vh;
}
.nav {
  position: sticky;
  display: grid;
  border: white solid 0.1em;
  margin: 1rem;
  margin-right: 2rem;
  row-gap: 0.5rem;
  padding: 0.5rem;

  &__item {
  }
  &__link {
    padding: 0.4rem;
    color: inherit;
    width: 100%;
    display: block;
    border-radius: 5px;
  }
}
.router-link-active {
  background-color: #282828;
}
.content {
  padding-left: 3.5rem;
}
</style>
