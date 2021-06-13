<template>
  <div class="layout">
    <Header />
    <el-row>
      <el-col :span="4">
        <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
          <router-link to="/discover">Discover</router-link>
        </div>
      </el-col>
      <el-col :span="20"> <router-view /> </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Header from '@/components/Header.vue';


export default defineComponent({
  setup() {return {}},
  components: {
    Header
  },
});
</script>

<style lang="scss"></style>

>
