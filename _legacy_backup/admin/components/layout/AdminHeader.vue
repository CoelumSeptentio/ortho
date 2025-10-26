<script setup lang="ts">
import { useAuth } from '#imports'  
const { logout } = useAuth()
</script>
<template>
  <header class="h-14 border-b bg-white flex items-center justify-between px-4">
    <div class="font-medium">ORTOMEDICA · Admin</div>
    <button class="btn" @click="logout">Выход</button>
  </header>
</template>
