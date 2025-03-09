<script setup>
import wordMan from "@/components/artists/menuDetail/worksManage.vue";

wordMan

import AUTnav from "@/components/utils/AUTnav.vue";
import PlayerDE from "@/components/utils/playerDE.vue";
import playerDE from "@/components/utils/playerDE.vue";
</script>

<template>
  <transition name="fade" mode="out-in">
    <div>
      <AUTnav></AUTnav>
      <playerDE></playerDE>
    </div>
  </transition>
</template>

<style scoped>
/* 路由切换动画 */
/* fade-transform */
.fade-leave-active,
.fade-enter-active {
  transition: all 0.5s;
}

/* 可能为enter失效，拆分为 enter-from和enter-to */
/*新页面的进入时*/
.fade-enter-from {
  /*  opacity: 0.5;*/
  transform: translateY(100px);
}

/*新页面的进入成功时*/
.fade-enter-to {
  /*  opacity: 1;*/
  transform: translateY(0px);
}

/*原页面的离开时*/
.fade-leave-to {
  opacity: 0;
  transform: translateY(100px);
}
</style>