<template>
  <div class="layout">
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
import { defineComponent } from 'vue'
import { useQueryProvider } from "vue-query";

export default defineComponent({
  setup() {
    useQueryProvider();    
  },
})
</script>


<style lang="scss">
* {
  box-sizing: border-box;
}
#app {
  background-color: black;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffff;
}

#nav {
}
</style>

