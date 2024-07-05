<script setup>

import AUTnav from "@/components/utils/AUTnav.vue";
import SecondNav from "@/components/utils/secondNav.vue";
import Backtop from "@/components/utils/backtop.vue";
import BottomLogo from "@/components/utils/bottomLogo.vue";
import Playlist from "@/components/songList/playlist.vue";
</script>

<template>
  <div>
    <AUTnav></AUTnav>
    <secondNav></secondNav>
    <playlist></playlist>
    <bottom-logo></bottom-logo>
    <backtop></backtop>
  </div>
</template>

<style scoped>

</style>