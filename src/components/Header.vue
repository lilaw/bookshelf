<template>
  <header class="header">
    <span class="hero">Bookshelf</span>
    <span class="header__username">{{user.username}}</span>
     <el-button type="primary" class="header__logout" @click.prevent="logout">Logout</el-button>

  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth } from "@/context/authProvider";

export default defineComponent({
  setup () {
    const {user, logout} = useAuth()

    return {user, logout}
  }
})
</script>

<style lang="scss" scoped>
.hero {
  margin-right: auto;
}
.header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  column-gap: 1rem;
  padding: 1rem;
  &__username {
    

  }
  &__logout {
    
  }
}

</style>