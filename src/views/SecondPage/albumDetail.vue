<script setup>

import AUTnav from "@/components/utils/AUTnav.vue";
import AlbumInfo from "@/components/SecondPage/albumDetail/albumInfo.vue";
import AlbumSongList from "@/components/SecondPage/albumDetail/albumSongList.vue";
import BottomLogo from "@/components/utils/bottomLogo.vue";
import Backtop from "@/components/utils/backtop.vue";
</script>

<template>
  <div>
    <AUTnav></AUTnav>
    <album-info></album-info>
    <bottom-logo></bottom-logo>
    <Backtop></Backtop>
  </div>
</template>

<style scoped>

</style>