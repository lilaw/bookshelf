<template>
  <div class="layout">
    <el-row>
      <el-col :span="6">
        <div id="nav">
          <router-link to="/">Home</router-link> |
          <router-link to="/about">About</router-link>
        </div>
      </el-col>
      <el-col :span="9"> <router-view /> </el-col>
    </el-row>
  </div>
</template>

<style lang="scss">
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
