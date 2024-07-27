<template>
  <!--  <router-view>
    </router-view>-->
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"/>
    </transition>
  </router-view>
  <music-play></music-play>
</template>
<script setup>
import MusicPlay from "@/views/musicPlay.vue";
</script>
<style>
body {
  margin: 0;
}

/* 路由切换动画 */
/* fade-transform */
.fade-leave-active,
.fade-enter-active {
  transition: all 0.4s;
}

/* 可能为enter失效，拆分为 enter-from和enter-to */
/*新页面的进入时*/
.fade-enter-from {
  opacity: 0.5;
  /*  transform: translateY(-30px);*/
}

/*新页面的进入成功时*/
.fade-enter-to {
  opacity: 1;
  /*  transform: translateY(0px);*/
}

/*原页面的离开时*/
.fade-leave-to {
  opacity: 0;
  /*  transform: translateY(30px);*/
}
</style>