<script setup>
import { onMounted, ref, watch} from "vue";
import {aSongDE} from "@/api/api.js";
import {useRoute} from "vue-router";
import useMusicPlayStore from "@/store/musicPlayStore.js";

const musicPlayStore = useMusicPlayStore();
const route = useRoute()
const record_needle = ref()
const cover = ref()//歌曲封面
const bg_info = ref()
const lyricUl = ref()
let currentTimeIndex = ref()
let wordFlag = ref(0);
let moveY = ref(0)
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
const dataStr = '[00:00.00]稻香 - 周杰伦\n' +
    '[00:05.00]词：周杰伦 曲：周杰伦\n' +
    '[00:31.98]对这个世界如果你有太多的抱怨\n' +
    '[00:33.03]跌倒了就不敢继续往前走\n' +
    '[00:38.94]为什麽人要这麽的脆弱 堕落\n' +
    '[00:40.45]请你打开电视看看\n' +
    '[00:43.19]多少人为生命在努力勇敢的走下去\n' +
    '[00:45.83]我们是不是该知足\n' +
    '[00:51.75]珍惜一切 就算没有拥有\n' +
    '[00:54.20]还记得你说家是唯一的城堡\n' +
    '[00:57.48]随着稻香河流继续奔跑\n' +
    '[00:58.49]微微笑 小时候的梦我知道\n' +
    '[01:02.53]不要哭让萤火虫带着你逃跑\n' +
    '[01:05.98]乡间的歌谣永远的依靠\n' +
    '[01:09.14]回家吧 回到最初的美好\n' +
    '[01:38.33]不要这麽容易就想放弃 就像我说的\n' +
    '[01:41.39]追不到的梦想 换个梦不就得了\n' +
    '[01:44.53]为自己的人生鲜艳上色 先把爱涂上喜欢的颜色\n' +
    '[01:48.73]笑一个吧 功成名就不是目的\n' +
    '[01:52.69]让自己快乐快乐这才叫做意义\n' +
    '[01:55.76]童年的纸飞机 现在终於飞回我手里\n' +
    '[02:01.37]所谓的那快乐 赤脚在田里追蜻蜓追到累了\n' +
    '[02:09.26]偷摘水果被蜜蜂给叮到怕了 谁在偷笑呢\n' +
    '[02:15.77]我靠着稻草人吹着风唱着歌睡着了\n' +
    '[02:14.18]哦 哦 午后吉它在虫鸣中更清脆\n' +
    '[02:16.65]哦 哦 阳光洒在路上就不怕心碎\n' +
    '[02:19.44]珍惜一切 就算没有拥有\n' +
    '[02:29.11]还记得你说家是唯一的城堡\n' +
    '[02:33.30]随着稻香河流继续奔跑\n' +
    '[02:36.21]微微笑 小时候的梦我知道\n' +
    '[02:41.08]不要哭让萤火虫带着你逃跑\n' +
    '[02:44.84]乡间的歌谣永远的依靠\n' +
    '[02:47.93]回家吧 回到最初的美好\n' +
    '[02:53.02]还记得你说家是唯一的城堡\n' +
    '[02:56.63]随着稻香河流继续奔跑\n' +
    '[02:59.58]微微笑 小时候的梦我知道\n' +
    '[03:04.79]不要哭让萤火虫带着你逃跑\n' +
    '[03:08.31]乡间的歌谣永远的依靠\n' +
    '[03:11.29]回家吧 回到最初的美好\n' +
    '[03:14.78]所谓的那快乐 赤脚在田里追蜻蜓追到累了\n' +
    '[03:19.39]偷摘水果被蜜蜂给叮到怕了 谁在偷笑呢\n' +
    '[03:23.96]我靠着稻草人吹着风唱着歌睡着了\n' +
    '[03:27.65]哦 哦 午后吉它在虫鸣中更清脆\n' +
    '[03:30.48]哦 哦 阳光洒在路上就不怕心碎\n' +
    '[03:33.68]珍惜一切 就算没有拥有\n' +
    '[03:38.24]还记得你说家是唯一的城堡\n' +
    '[03:42.17]随着稻香河流继续奔跑\n' +
    '[03:45.09]微微笑 小时候的梦我知道\n' +
    '[03:49.51]不要哭让萤火虫带着你逃跑\n' +
    '[03:53.75]乡间的歌谣永远的依靠\n' +
    '[03:56.75]回家吧 回到最初的美好'
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


//监听歌曲变化
watch(() => musicPlayStore.index, (newValue, OldValue) => {
  song.value = musicPlayStore.songList[newValue]
  bg_info.value.style.backgroundImage = "url(" + "/" + song.value.song_Cover + ")";
}, {deep: true});

//歌词高亮停留，与歌词偏移
watch(() => musicPlayStore.currentTime, (newValue, OldValue) => {
  let index = newValue.match(/(\d{2}):(\d{2})/);
  if (index) {
    const [, minutes, seconds] = index
    //点击进度条时滚动歌词
    if (currentTimeIndex.value + 1 < parseInt(minutes) * 60 + parseInt(seconds)) {
      findTime()
    } else if (currentTimeIndex.value - 1 > parseInt(minutes) * 60 + parseInt(seconds)) {
      findTime()
    }
    // 将时间戳转换为秒
    currentTimeIndex.value = parseInt(minutes) * 60 + parseInt(seconds)
    // console.log("wordf" + wordFlag.value)
    // console.log("s" + songWord.value[wordFlag.value + 1].time)
    //滚动歌词
    if (currentTimeIndex.value === songWord.value[wordFlag.value + 1].time) {
      wordFlag.value++;
      moveWord()
    }
    // console.log("wordf" + wordFlag.value)
    // console.log(currentTimeIndex.value)
  }
}, {deep: true});


onMounted(() => {
  const songID = route.query.song_ID
  initPlayerDE()
  songDetail(songID)
  // parseLyrics()
  formatLyric();
  findTime()
})

/*//解析歌词数据
const parseLyrics = () => {
  const lines = dataStr.split('\n')
  let i = -1;
  for (const line of lines) {
    const match = line.match(/(\d{2}):(\d{2}) (.+)/)
    if (match) {
      const [, minutes, seconds, content] = match
      // 将时间戳转换为秒
      const index = parseInt(minutes) * 60 + parseInt(seconds)
      songWord.value.push({i, index, content})
    }
    i++;
  }
}*/

//初始化页面
function initPlayerDE() {
  if (musicPlayStore.playing === true) {
    record_needle.value.style.transform = "rotate(32deg)"
    cover.value.style.animationPlayState = ''
  } else {
    record_needle.value.style.transform = "rotate(0deg)"
    cover.value.style.animationPlayState = 'paused'
  }
  // findTime()
}

function songDetail(ID) {
  aSongDE(ID).then(resp => {
    if (resp.data.code === 200) {
      song.value = resp.data.data
      bg_info.value.style.backgroundImage = "url(" + "/" + song.value.song_Cover + ")";
    }
  })
  setTimeout(() => {
    moveWord()
  }, 100)
}


/**
 * 将歌词字符串解析为歌词数组
 * @returns array 如： [{ time: "31.52", words: "你是 遥遥的路" }]
 */
const formatLyric = () => {
  // 定义一个暂存变量接收日期字符串
  let timeStr = "";
  let index = 0;
  // 把歌词数组用换行符\n分割成数组
  dataStr.split("\n").forEach((item) => {
    // 去除最后一行分割的空字符串
    if (item === "") return;
    // item 如 "[00:31.52]你是 遥遥的路"
    // parts 如 ["[00:31.52","你是 遥遥的路"]
    const parts = item.split("]");
    // timeStr 如 00:31.52
    timeStr = parts[0].slice(1);
    // 空歌词不要
    if (parts[1] !== " " && parts[1] !== "") {
      songWord.value.push({
        index: index,
        time: parseTime(timeStr),
        content: parts[1],
      });
      index++;
    }
  });
  // console.log(songWord.value)
};
/**
 * 将时间字符串解析为秒
 * @param {*} timeStr 时间字符串
 * @returns 秒
 */
const parseTime = (timeStr) => {
  const parts = timeStr.split(".");
  const parts1 = parts[0].split(":");
  return +parts1[0] * 60 + +parts1[1];
};

//寻找进入页面时最近的歌词时间
function findTime() {
  let tempCT
  let index = musicPlayStore.currentTime.match(/(\d{2}):(\d{2})/);
  if (index) {
    const [, minutes, seconds] = index
    // 将时间戳转换为秒
    tempCT = parseInt(minutes) * 60 + parseInt(seconds)
  }
  let flag = true
  while (flag) {
    songWord.value.forEach((item) => {
      if (item.time === tempCT) {
        wordFlag.value = item.index
        flag = false;
      }
    })
    tempCT--;
  }
  moveWord();
}

// 歌词滚动
function moveWord() {
  let moveTop = (wordFlag.value - 7) * 35;
  lyricUl.value.scrollTop = lyricUl.value.setScrollTop(moveTop)
}

//todo 点击歌词改变进度条(未完全测试) ,需在歌词处新增播放的ui
function clickWord(index) {
  wordFlag.value = index
  musicPlayStore.otherCurrentTime = songWord.value[index].time
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
              <el-scrollbar ref="lyricUl" height="500px">
                <div v-for="(item,index) in songWord"
                     class="songWord_item"
                     :class="{playing:item.index===wordFlag}"
                     @click="clickWord(index)"
                >{{ item.content }}
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
  width: 450px;
  height: 600px;
  margin-top: 4rem;
}

.playerDE_mod_info_text_songWord :deep(.el-scrollbar__view) {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
}

.songWord_item {
  height: 25px;
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