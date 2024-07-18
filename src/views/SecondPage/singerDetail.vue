<script setup>

import AUTnav from "@/components/utils/AUTnav.vue";
import SingerInfo from "@/components/SecondPage/singerDetail/singerInfo.vue";
import SingerSongList from "@/components/SecondPage/singerDetail/songList.vue";
import BottomLogo from "@/components/utils/bottomLogo.vue";
import Backtop from "@/components/utils/backtop.vue";
</script>

<template>
  <div>
    <AUTnav></AUTnav>
    <singer-info></singer-info>
    <bottom-logo></bottom-logo>
    <Backtop></Backtop>
  </div>
</template>

<style scoped>

</style>