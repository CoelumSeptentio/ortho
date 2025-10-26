<template>
  <div class="min-h-dvh grid grid-rows-[auto_1fr]">
    <AdminHeader />
    <div class="grid grid-cols-[16rem_1fr]">
      <AdminSidebar />
      <main class="p-6 bg-gray-50"><slot /></main>
    </div>
  </div>
</template>