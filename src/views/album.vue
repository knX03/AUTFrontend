<script setup>

import AUTnav from "@/components/utils/AUTnav.vue";
import SecondNav from "@/components/utils/secondNav.vue";
import Backtop from "@/components/utils/backtop.vue";
import BottomLogo from "@/components/utils/bottomLogo.vue";
import AlbumList from "@/components/album/albumList.vue";
</script>

<template>
  <div>
    <AUTnav></AUTnav>
    <secondNav></secondNav>
    <album-list></album-list>
    <bottom-logo></bottom-logo>
    <backtop></backtop>
  </div>
</template>

<style scoped>

</style>