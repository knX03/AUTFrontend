<script setup>
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import useMusicPlayStore from "@/store/musicPlayStore.js";


const musicPlayStore = useMusicPlayStore();
const music = ref()
//监听音乐路径
watch(() => musicPlayStore.musicUrl, (newValue, OldValue) => {
  musicU.value = newValue
  loadMusic();
  play.value = true
}, {deep: true});// 再根据业务，选择性开启 深度监视，监视监听源里面更加深层次的数据

//监听音乐播放器显示
watch(() => musicPlayStore.play, (newValue, OldValue) => {
  player.value = newValue
  if (newValue === false) {
    pauseMusic()
  }
}, {deep: true});

//监听音乐播放
watch(() => musicPlayStore.index, (newValue, OldValue) => {
  musicU.value = musicPlayStore.songList[newValue].song_Directory
  musicName.value = musicPlayStore.songList[newValue].song_Name
  loadMusic()
  play.value = true
}, {deep: true});
//播放器显示
let player = ref(false)
//播放按钮
let play = ref(true)
//播放模式
let playType = ref(3) //1：列表循环，2：单曲循环，3：随机播放
//是否循环播放
let loop = ref(false)
//播放器音乐路径
let musicU = ref('')
let musicName = ref()
let songList = ref([{
  song_ID: '',
  song_Name: '',
  singer_ID: '',
  singer_name: '',
  album_ID: '',
  album_name: '',
  song_Cover: '',
  song_Directory: '',
}])


onMounted(() => {

})

onBeforeUnmount(() => {

})


//播放
function playMusic() {
  if (music.value) {
    setTimeout(() => {
      music.value.play();
    }, 500)
  }
  play.value = !play.value
}

//停止
function pauseMusic() {
  music.value.pause();
  play.value = !play.value
}

//重载
function loadMusic() {
  music.value.load();
  playMusic()
}

//上一首
function lastMusic() {
  if (musicPlayStore.index === 0) {
    musicPlayStore.index = musicPlayStore.songList.length - 1;
  } else {
    musicPlayStore.index--;
  }
  //loadMusic();
}

//下一首
function nextMusic() {
  if (musicPlayStore.index === musicPlayStore.songList.length - 1) {
    musicPlayStore.index = 0;
  } else {
    musicPlayStore.index++
  }
  //loadMusic();
}


function afterEnd() {
  if (playType.value === 1) {
    listLoop()
  } else if (playType.value === 2) {
    musicLoop()
  } else if (playType.value === 3) {
    randomPlay()
  }
}

//列表循环：播放结束自动下一首
function listLoop() {
  let audioM = document.getElementById('audioM')
  loop.value = false
  audioM.addEventListener('ended', function () {
    if (music.value.ended) {
      nextMusic()
    }
  }, false);
}

//单曲循环
function musicLoop() {
  loop.value = true
}

//随机播放
function randomPlay() {
  let length = musicPlayStore.songList.length - 1;
  let audioM = document.getElementById('audioM')
  loop.value = false
  audioM.addEventListener('ended', function () {
    if (music.value.ended) {
      musicPlayStore.index = Math.floor(Math.random() * length)
    }
  }, false);
}
</script>

<template>
  <div v-show="player"
       class="musicPlayer_mod">
    <audio ref="music"
           id="audioM"
           :loop="loop"
           controls
           @canplay="afterEnd()">
      <source :src=musicU>
    </audio>
    {{ musicName }}
    <button v-if="!play" style="height: 200px;width: 200px" @click="playMusic()">播放</button>
    <button v-if="play" style="height: 200px;width: 200px" @click="pauseMusic()">停止</button>
    <button style="height: 200px;width: 200px" @click="lastMusic()">上一首</button>
    <button style="height: 200px;width: 200px" @click="nextMusic()">下一首</button>
    <router-link to="/">home</router-link>
  </div>
  <div>
    <button style="background-color: #e58c43;height: 100px;width: 100px"
            @click="musicPlayStore.play = !musicPlayStore.play"></button>
  </div>
</template>

<style scoped>
.musicPlayer_mod {
  position: fixed;
  z-index: 2;
  left: 10px;
  bottom: 10px;
}
</style>