import {defineStore} from 'pinia';
import {store} from "xijs";

const musicPlayStore = defineStore("muPlayData", {
    state: () => ({
        index: -1,//当前播放音乐所在列表索引
        play: false, //音乐播放器显示状态
        playing: false,//音乐播放器播放状态
        currentTime: '',    //进度条当前的数值
        otherCurrentTime: '',   //点击歌词改变进度条
        musicUrl: '',//歌曲的地址
        musicUrlList: [],
        songList: [{ //歌曲列表
            song_ID: '',
            song_Name: '',
            singer_ID: '',
            singer_name: '',
            album_ID: '',
            album_name: '',
            song_Cover: '',
            song_Directory: '',
        }]
    }),
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'musicPlay_store',
                storage: localStorage,
            },
        ],
    },
})

export default musicPlayStore