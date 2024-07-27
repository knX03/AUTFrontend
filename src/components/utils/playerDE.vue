<script setup>
import {onMounted, ref, watch} from "vue";
import {aSongDE} from "@/api/api.js";
import {useRoute} from "vue-router";
import useMusicPlayStore from "@/store/musicPlayStore.js";

const musicPlayStore = useMusicPlayStore();
const route = useRoute()
const record_needle = ref()
const cover = ref()//歌曲封面
const bg_info = ref()
let ifPlay = ref(musicPlayStore.playing)//歌曲是否在播放
let currentTimeIndex = ref()
//歌曲信息
let song = ref({
  song_ID: '',
  song_Name: '',
  singer_ID: '',
  singer_name: '',
  album_ID: '',
  album_name: '',
  song_Cover: '/src/photos/logo/唱片.png',
  song_Directory: '',
})

const dataStr = `
00:00 淘汰 – 陈奕迅 (Eason Chan)
00:08 词：周杰伦
00:17 曲：周杰伦
00:26 编曲：C.Y.Kong
00:35 我说了所有的谎
00:39 你全都相信
00:43 简单的我爱你
00:46 你却老不信
00:51 你书里的剧情
00:55 我不想上演
00:58 因为我喜欢
01:01 喜剧收尾
01:08 我试过完美放弃
01:12 的确很踏实
01:15 醒来了梦散了
01:19 你我都走散了
01:23 情歌的词何必押韵
01:27 就算我是K歌之王
01:31 也不见得把
01:33 爱情唱得完美
01:38 只能说我输了
01:42 也许是你怕了
01:46 我们的回忆没有皱褶
01:51 你却用离开烫下句点
01:54 只能说我认了
01:58 你的不安赢得你信任
02:03 我却得到你安慰的淘汰
02:25 我试过完美放弃
02:29 的确很踏实
02:32 醒来了梦散了
02:36 你我都走散了
02:40 情歌的词何必押韵
02:44 就算我是K歌之王
02:48 也不见得把
02:50 爱情唱得完美
02:55 只能说我输了
02:59 也许是你怕了
03:03 我们的回忆没有皱褶
03:08 你却用离开烫下句点
03:11 只能说我认了
03:15 你的不安赢得你信任
03:21 我却得到你安慰的淘汰
03:44 只能说我输了
03:48 也许是你怕了
03:52 我们的回忆没有皱褶
03:57 你却用离开烫下句点
04:00 只能说我认了
04:04 你的不安赢得你信任
04:09 我却得到你安慰的淘汰`

let songWord = ref([])

//监听音乐播放
watch(() => musicPlayStore.playing, (newValue, OldValue) => {
  if (newValue === true) {
    record_needle.value.style.transform = "rotate(32deg)"
    cover.value.style.animationPlayState = ''
  } else {
    record_needle.value.style.transform = "rotate(0deg)"
    cover.value.style.animationPlayState = 'paused'
  }
}, {deep: true});

//todo 歌词高亮停留，与歌词偏移
watch(() => musicPlayStore.currentTime, (newValue, OldValue) => {
  console.log(newValue)
  let index = newValue.match(/(\d{2}):(\d{2})/);
  if (index) {
    const [, minutes, seconds] = index
    // 将时间戳转换为秒
    currentTimeIndex.value = parseInt(minutes) * 60 + parseInt(seconds)
  }
}, {deep: true});


onMounted(() => {
  const songID = route.query.song_ID
  songDetail(songID)
  parseLyrics()
})

//解析歌词数据
const parseLyrics = () => {
  const lines = dataStr.split('\n')
  for (const line of lines) {
    const match = line.match(/(\d{2}):(\d{2}) (.+)/)
    // console.log(match)
    if (match) {
      const [, minutes, seconds, content] = match
      // 将时间戳转换为秒
      const index = parseInt(minutes) * 60 + parseInt(seconds)
      songWord.value.push({index, content})
    }
  }
}

function songDetail(ID) {
  aSongDE(ID).then(resp => {
    if (resp.data.code === 200) {
      song.value = resp.data.data
      bg_info.value.style.backgroundImage = "url(" + "/" + song.value.song_Cover + ")";
    }
  })
}

//todo 需将其拆分为播放与暂停，目前暂时看效果

function playNeedle() {
  musicPlayStore.playing = !musicPlayStore.playing
  if (musicPlayStore.playing === true) {
    record_needle.value.style.transform = "rotate(32deg)"
    cover.value.style.animationPlayState = ''
  } else {
    record_needle.value.style.transform = "rotate(0deg)"
    cover.value.style.animationPlayState = 'paused'
  }
}
</script>

<template>
  <div ref="bg_info" class="bg_mod">
    <div class="bg_shade">
      <!--todo 歌曲详情-->
      <div class="playerDE_mod">
        <div class="playerDE_mod_info">
          <div class="playerDE_mod_info_cover">
            <div class="cover_record_needle" ref="record_needle">
              <img src="/src/photos/logo/needle.png">
            </div>
            <div class="cover_container" ref="cover">
              <div class="cover_record">
                <img :src="song.song_Cover" class="cover_record_img">
              </div>
            </div>
          </div>
          <div class="playerDE_mod_info_text">
            <div class="playerDE_mod_info_text_title">
              <span>{{ song.song_Name }}</span>
            </div>
            <div class="playerDE_mod_info_text_moInfo">
              <span style="margin-right: 10px">专辑：<span>{{ song.album_name }}</span></span>
              <span>歌手：<span>{{ song.singer_name }}</span></span>
            </div>
            <div class="playerDE_mod_info_text_songWord">
              <el-scrollbar height="600px">
                <div v-for="(item) in songWord"
                     class="songWord_item"
                     :class="{playing:item.index===currentTimeIndex}">{{ item.content }}
                </div>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div class="playerDE_mod_player">

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg_mod {
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  background: rgba(87, 87, 87, 0.76);
}

.bg_shade {
  width: 100%;
  background: rgba(87, 87, 87, 0.76);
  backdrop-filter: blur(60px);
}

.playerDE_mod {
  width: 100%;
  height: 830px;
}

.playerDE_mod_info {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/*歌曲封面*/
.playerDE_mod_info_cover {
  width: 800px;
  height: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cover_record_needle {
  width: 300px;
  height: 150px;
  position: relative;
  left: 150px;
  top: 20px;
  transform-origin: top left;
  transform: rotate(32deg);
  transition: all 0.5s ease-in-out;
  z-index: 3;
}

.cover_record_needle img {
  width: 100%;
  height: 100%;
}


.cover_container {
  width: 500px;
  height: 500px;
  border-radius: 50%;
  border: 1px #e5e5e5 solid;
  background: rgba(229, 229, 229, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease-in-out;
  animation: rotation 20s linear infinite;
}

/*歌曲封面的旋转动画*/
@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.cover_record {
  width: 470px;
  height: 470px;
  border-radius: 50%;
  background: black;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover_record_img {
  width: 360px;
  height: 360px;
  background: #F4D5B7;
  border-radius: 50%;
}

/*--------------------------------------------*/


/*歌曲信息与歌词*/
.playerDE_mod_info_text {
  width: 800px;
  height: 800px;
  padding: 20px 10px;
}

.playerDE_mod_info_text_title {
  display: flex;
  align-items: center;
  max-width: 500px;
  font-family: STXihei, serif;
  font-weight: bolder;
  font-size: 26px;
  color: #FFFFFF;
  margin-bottom: 10px;
}

.playerDE_mod_info_text_moInfo {
  min-width: 200px;
  max-width: 500px;
  display: flex;
  align-items: center;
  font-family: STXihei, serif;
  font-size: 14px;
  color: #d7d7d7;
  margin-bottom: 10px;
}

.playerDE_mod_info_text_songWord {
  width: 400px;
  height: 600px;
  margin-top: 20px;
}

.playerDE_mod_info_text_songWord :deep(.el-scrollbar__view) {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.songWord_item {
  height: 20px;
  font-family: STXihei, serif;
  font-size: 17px;
  transition: all 0.3s ease-in-out;
  color: #ffffff;
  z-index: 3;
  margin-bottom: 10px;
}

.songWord_item.playing {
  transform: scale(1.2, 1.2);
  color: #e58c43;
}

/*--------------------------------------------*/
.playerDE_mod_player {

}
</style>