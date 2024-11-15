<script setup>
import {defineProps, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {ElMessage, ElNotification} from "element-plus";
import 'vue3-emoji-picker/css';
import EmojiPicker from 'vue3-emoji-picker';
import {aGetComments, aPostComment} from "@/api/api.js";

const route = useRoute()
let playlist_ID = ref()
const emojiLogo = ref()
let clickEmo = ref(false)
const {list_ID} = defineProps(['list_ID']);
let textCount = ref(130)
let comment = ref([{
  comment: "",
  user_name: "",
  user_avatar: '',
  postingTime: ""
}])

let commentForm = ref({
  ID: '',
  text: '',
  type: ''
})

//禁用的emoji组
const emojiGroup = ref([
  "animals_nature",
  "activities",
  "travel_places",
  "objects",
  "symbols",
  "flags"
])
const type = ref("playlist")
let commentExist = ref(true)

watch(() => commentForm.value.text, (textarea) => {
      textCount.value = 130 - textarea.length;
    }
);


onMounted(() => {
  playlist_ID.value = list_ID
  commentForm.value.ID = list_ID
  getComments(list_ID)
})

function getComments(playlist_ID) {
  aGetComments(playlist_ID, type.value).then(resp => {
    if (resp.data.code === 200) {
      comment.value = resp.data.data
      if (comment.value.length > 0) {
        commentExist.value = false
      }
    } else {
      console.log(resp.data.msg)
    }
  })
}

// 选择emoji后调用的函数
function selectEmoji(emoji) {
  let postComment_text = document.getElementById("postComment_text")
  let startPos = postComment_text.selectionStart
  let endPos = postComment_text.selectionEnd
  let resultText = postComment_text.value.substring(0, startPos) + emoji.i + postComment_text.value.substring(endPos)
  postComment_text.value = resultText
  postComment_text.focus()
  postComment_text.selectionStart = startPos + emoji.i.length
  postComment_text.selectionEnd = startPos + emoji.i.length
  commentForm.value.text = resultText
}

function postComment() {
  if (commentForm.value.text === '') {
    ElMessage.error("写点东西吧，内容不能为空哦")
    return;
  }
  commentForm.value.type = type.value
  aPostComment(commentForm.value).then(resp => {
    if (resp.data.code === 200) {
      ElMessage.success("发表成功！")
      commentForm.value.text = ''
      getComments(playlist_ID.value)
    } else {
      console.log(resp.data.msg)
    }
  }).catch(resp => {
    ElNotification({
      title: '请先登录!',
      type: 'error'
    })
  })
}
// 定义局部自定义指令，这里是在 setup 标签下编写，指令名称以 v 开头，无需额外注册逻辑
const vClickOutside = {
  mounted(el, binding) {
    function eventHandler(e) {
      if (el.contains(e.target) || e.target === emojiLogo.value) {
        return false
      }

      // 如果绑定的参数是函数，正常情况也应该是函数，执行
      if (binding.value && typeof binding.value === 'function') {
        binding.value(e)
      }
    }

    // 用于销毁前注销事件监听
    el.__click_outside__ = eventHandler
    // 添加事件监听
    document.addEventListener('click', eventHandler)
  },
  beforeUnmount(el) {
    // 移除事件监听
    document.removeEventListener('click', el.__click_outside__)
    // 删除无用属性
    delete el.__click_outside__
  }
}

function onClickOutside() {
  // 外部点击时的回调函数
  clickEmo.value = false
}
</script>

<template>
  <div class="comment_mod">
    <el-affix :offset="0">
      <div class="writeComment">
        <textarea class="postComm_container"
                  id="postComment_text"
                  v-model="commentForm.text"
                  maxlength="130"
                  placeholder="说点什么吧"></textarea>
        <div class="commUtils_mod">
          <span style="color: #FFFFFF; font-size: 10px; padding-left: 20px;">{{ textCount }}</span>
          <div class="other_mod">
            <div class="chat_mod_write_Emoji">
              <img src="/src/photos/logo/emoji.png"
                   @click="clickEmo=!clickEmo" ref="emojiLogo">
              <EmojiPicker
                  class="emojiPicker"
                  v-click-outside="onClickOutside"
                  :class="{activeE:clickEmo}"
                  :native="true"
                  :hide-search="true"
                  :hide-group-icons="true"
                  :disable-skin-tones="true"
                  :disabled-groups="emojiGroup"
                  @select="selectEmoji"/>
            </div>
            <span @click="postComment()">发布</span>
          </div>
        </div>
      </div>
    </el-affix>
    <div class="comment_list">
      <span class="title">精彩评论</span>
      <div class="comment_user" v-for="item in comment">
        <img class="Commentator_avatar" :src=item.user_avatar>
        <div class="nameAndComment">
          <span class="commentator">{{ item.user_name }}</span>
          <span class="comment_text">{{ item.comment }}</span>
          <span class="comment_time">{{ item.postingTime }}</span>
        </div>
        <div class="option_mod">
          <div class="option_mod_next">
            <el-icon :size="18">
              <Star/>
            </el-icon>
            <el-icon :size="18">
              <Share/>
            </el-icon>
            <el-icon :size="18">
              <ChatDotRound/>
            </el-icon>
          </div>
        </div>
      </div>
      <div class="commentNull_mod" v-if="commentExist">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
             viewBox="0 0 153 144" height="144px" width="153px">
          <title> 备份 10</title>
          <defs>
            <linearGradient id="linearGradient-1" y2="-7.86526499%" x2="52.0445751%" y1="100%" x1="52.0445751%">
              <stop offset="0%" stop-opacity="0" stop-color="#F3F4F6"></stop>
              <stop offset="100%" stop-color="#E4E6E9"></stop>
            </linearGradient>
            <linearGradient id="linearGradient-2" y2="65.8988422%" x2="55.9821181%" y1="42.5828942%" x1="51.0590102%">
              <stop offset="0%" stop-color="#E8E8E9"></stop>
              <stop offset="100%" stop-color="#CCCDCE"></stop>
            </linearGradient>
            <linearGradient id="linearGradient-3" y2="31.6155331%" x2="70.0434195%" y1="110.768192%" x1="-12.7616925%">
              <stop offset="0%" stop-color="#EEEEEE"></stop>
              <stop offset="100%" stop-color="#D8D8D8"></stop>
            </linearGradient>
            <linearGradient id="linearGradient-4" y2="17.3862394%" x2="82.0607981%" y1="83.1759315%" x1="16.6823234%">
              <stop offset="0%" stop-color="#EEEEEE"></stop>
              <stop offset="100%" stop-color="#D8D8D8"></stop>
            </linearGradient>
          </defs>
          <g fill-rule="evenodd" fill="none" stroke-width="1" stroke="none" id="缺省页">
            <g id="编组-21" transform="translate(-308.000000, -251.000000)">
              <g transform="translate(325.000000, 275.000000)">
                <path fill-rule="nonzero" fill="#B4B6BA" id="暂无评论~"
                      d="M36.1129491,97.1370847 L36.1129491,96.4821695 L37.3853559,96.3698983 L37.3853559,95.6494915 C36.9830508,95.6869153 36.5620339,95.7149831 36.1129491,95.7524068 L36.1129491,95.2097627 L37.4789152,95.2097627 L37.4789152,94.48 L36.1129491,94.48 L36.1129491,93.928 L35.2896271,93.928 L35.2896271,94.48 L34.4943729,94.48 C34.6814915,94.208678 34.8686101,93.9092881 35.0370169,93.5911864 L37.5631186,93.5911864 L37.5631186,92.8052881 L35.4018983,92.8052881 C35.4580339,92.6649492 35.5048135,92.5246102 35.5609491,92.3842712 L34.6814915,92.2439322 C34.606644,92.4310508 34.5411525,92.6181695 34.4663051,92.8052881 L33.2126101,92.8052881 L33.2126101,93.5911864 L34.0920678,93.5911864 C33.8862373,93.9467119 33.6804068,94.2461017 33.4652203,94.4893559 L33.652339,95.2097627 L35.2896271,95.2097627 L35.2896271,95.8085424 C34.6814915,95.8459661 34.0359322,95.8740339 33.3529491,95.9021017 L33.4558644,96.6692881 C34.0920678,96.6318644 34.7002034,96.5850847 35.2896271,96.547661 L35.2896271,97.1370847 L36.1129491,97.1370847 Z M38.0309152,97.2212881 C38.4238644,96.6412203 38.6858305,95.9769492 38.7981017,95.2191186 L39.8085423,95.2191186 L39.8085423,97.1464407 L40.6599322,97.1464407 L40.6599322,95.2191186 L41.5581017,95.2191186 L41.5581017,94.4425763 L38.8542373,94.4425763 L38.8542373,93.6379661 C39.8459661,93.5256949 40.688,93.3105085 41.370983,93.0111186 L40.7909152,92.3562034 C40.1734237,92.6462373 39.2565423,92.8520678 38.0402712,92.964339 L38.0402712,94.5080678 C38.0215593,95.303322 37.8063729,95.995661 37.4134237,96.5757288 L38.0309152,97.2212881 Z M35.158644,100.963661 L35.158644,100.636203 L39.7056271,100.636203 L39.7056271,100.963661 L40.6037966,100.963661 L40.6037966,97.3522712 L34.2604746,97.3522712 L34.2604746,100.963661 L35.158644,100.963661 Z M39.7056271,98.624678 L35.158644,98.624678 L35.158644,98.0913898 L39.7056271,98.0913898 L39.7056271,98.624678 Z M39.7056271,99.8783729 L35.158644,99.8783729 L35.158644,99.3263729 L39.7056271,99.3263729 L39.7056271,99.8783729 Z M43.7785763,100.963661 C45.0696949,100.411661 46.0052881,99.6257627 46.5853559,98.6059661 C46.8941017,98.0165424 47.128,97.3242034 47.2964068,96.5195932 L47.8764746,96.5195932 L47.8764746,99.7099661 C47.8764746,100.439729 48.2226441,100.813966 48.914983,100.813966 L50.4119322,100.813966 C50.8048813,100.813966 51.0949152,100.720407 51.2820339,100.542644 C51.4878644,100.355525 51.6375593,99.7661017 51.7124068,98.7837288 L50.8797288,98.5124068 C50.8423051,99.2234576 50.7674576,99.6538305 50.6645424,99.7848136 C50.570983,99.9157966 50.4306441,99.9812881 50.2435254,99.9812881 L49.1863051,99.9812881 C48.8962712,99.9812881 48.7559322,99.8222373 48.7559322,99.5228475 L48.7559322,96.5195932 L51.5814237,96.5195932 L51.5814237,95.6588475 L47.4367458,95.6588475 C47.4928813,95.1910508 47.5303051,94.7045424 47.5490169,94.1806102 L47.5490169,93.6192542 L50.8423051,93.6192542 L50.8423051,92.7491525 L44.0311864,92.7491525 L44.0311864,93.6192542 L46.6414915,93.6192542 L46.6414915,94.1806102 C46.6227796,94.7045424 46.5853559,95.1910508 46.5292203,95.6588475 L43.4230508,95.6588475 L43.4230508,96.5195932 L46.3701695,96.5195932 C46.2578983,97.0341695 46.0988474,97.5019661 45.9023729,97.932339 C45.4439322,98.8305085 44.5738305,99.5789831 43.2827119,100.168407 L43.7785763,100.963661 Z M55.5233898,94.4051525 L56.1315254,93.787661 C55.7105085,93.3198644 55.1959322,92.8614237 54.5877966,92.4029831 L53.9703051,93.0111186 C54.6345763,93.4976271 55.1491525,93.9654237 55.5233898,94.4051525 Z M59.5651525,100.963661 L59.5651525,97.7077966 L61.988339,97.7077966 L61.988339,96.8657627 L59.5651525,96.8657627 L59.5651525,93.5350508 L61.707661,93.5350508 L61.707661,92.7023729 L56.5806102,92.7023729 L56.5806102,93.5350508 L58.7044068,93.5350508 L58.7044068,96.8657627 L56.3186441,96.8657627 L56.3186441,97.7077966 L58.7044068,97.7077966 L58.7044068,100.963661 L59.5651525,100.963661 Z M60.7814237,96.4634576 C61.0808136,95.7898305 61.3240678,95.0039322 61.5111864,94.1057627 L60.7346441,93.8999322 C60.5288136,94.8261695 60.2949153,95.5933559 60.0329492,96.2014915 L60.7814237,96.4634576 Z M57.3758644,96.4821695 L58.1336949,96.2950508 C57.9278644,95.4062373 57.703322,94.620339 57.4413559,93.9373559 L56.6835254,94.1806102 C56.9642034,94.9103729 57.1981017,95.6775593 57.3758644,96.4821695 Z M54.7374915,100.692339 C55.3736949,100.261966 55.9818305,99.7661017 56.5431864,99.2141017 L56.2999322,98.2785085 C56.0098983,98.5591864 55.7385763,98.8211525 55.4859661,99.0550508 L55.4859661,95.1162034 L53.3247458,95.1162034 L53.3247458,95.9675932 L54.6345763,95.9675932 L54.6345763,99.4105763 C54.6345763,99.5976949 54.5503729,99.7567458 54.400678,99.8877288 L54.7374915,100.692339 Z M66.5571526,96.1172881 C67.5863051,95.4249492 68.4376949,94.4332203 69.120678,93.1514576 C69.6820339,94.2928814 70.5521356,95.2658983 71.7309831,96.0517966 L72.2174915,95.303322 C70.9357288,94.4425763 70.0375593,93.4508475 69.5136271,92.3187797 L68.7183729,92.3187797 C68.1008814,93.5724746 67.2120678,94.5829153 66.0706441,95.3688136 L66.5571526,96.1172881 Z M65.6122034,94.4051525 L66.220339,93.787661 C65.799322,93.3198644 65.2847458,92.8614237 64.6766102,92.4029831 L64.0591187,93.0111186 C64.7233898,93.4976271 65.2379661,93.9654237 65.6122034,94.4051525 Z M64.8169492,100.692339 C65.4999322,100.224542 66.1454915,99.7099661 66.7442712,99.1298983 L66.5197288,98.2410847 C66.1829153,98.5591864 65.8741695,98.8492203 65.5841356,99.1018305 L65.5841356,95.1162034 L63.4696949,95.1162034 L63.4696949,95.9675932 L64.7233898,95.9675932 L64.7233898,99.4105763 C64.7233898,99.5976949 64.6391865,99.7661017 64.4801356,99.8970847 L64.8169492,100.692339 Z M70.4772881,100.80461 C70.9263729,100.80461 71.2538305,100.711051 71.469017,100.523932 C71.7122712,100.327458 71.871322,99.719322 71.9555254,98.6995254 L71.1228475,98.4282034 C71.0854237,99.176678 70.9918644,99.6164068 70.8421695,99.7661017 C70.7298983,99.8970847 70.5614915,99.9719322 70.3182373,99.9719322 L68.699661,99.9719322 C68.4002712,99.9719322 68.2505763,99.8035254 68.2505763,99.4854237 L68.2505763,98.0820339 C69.1955254,97.7265085 70.1966102,97.2212881 71.2444746,96.5570169 L70.7392542,95.8459661 C69.944,96.4260339 69.111322,96.8751186 68.2505763,97.2025763 L68.2505763,95.6682034 L67.3711187,95.6682034 L67.3711187,99.6631864 C67.3711187,100.421017 67.7172881,100.80461 68.428339,100.80461 L70.4772881,100.80461 Z M76.524339,97.4084068 C76.9547119,97.4084068 77.3757288,97.0809492 77.7873899,96.4353898 L77.1792543,96.0143729 C76.936,96.4260339 76.7114577,96.6412203 76.524339,96.6412203 C76.3652882,96.6412203 76.0846102,96.5102373 75.691661,96.2669831 C75.2987119,96.0050169 74.9431865,95.8833898 74.6344407,95.8833898 C74.2040678,95.8833898 73.7830509,96.2014915 73.3713899,96.8470508 L73.9795254,97.2680678 C74.2227797,96.8564068 74.4379661,96.6505763 74.6344407,96.6505763 C74.7934915,96.6505763 75.0741695,96.7722034 75.4764746,97.0341695 C75.8694238,97.2774237 76.2155932,97.4084068 76.524339,97.4084068 Z"></path>
                <ellipse ry="23.5" rx="55.5" cy="54.5" cx="55.5" fill="url(#linearGradient-1)"
                         id="椭圆形备份-11"></ellipse>
                <g transform="translate(36.000000, 0.000000)" id="编组-12">
                  <path stroke-width="0.520000665" stroke="#979797" id="矩形"
                        d="M45.195676,2.66395955 C45.6935344,2.59523267 46.1721177,2.73480918 46.5434182,3.01603201 C46.9104713,3.29403793 47.1726818,3.71046813 47.2450279,4.20092696 L47.2450279,4.20092696 L47.2645603,52.5576806 C47.2645603,53.0010541 47.1047923,53.4121603 46.8357679,53.7311129 C46.5667435,54.0500656 46.1884628,54.2768647 45.7514375,54.3516241 L45.7514375,54.3516241 L4.96973874,61.3279128 C4.47435491,61.4126553 3.99152036,61.2885812 3.61134616,61.0194755 C3.23654608,60.7541739 2.96152446,60.3479121 2.87262472,59.861808 L2.87262472,59.861808 L2.84285689,10.0965745 C2.84285689,9.64208046 3.01052476,9.22242984 3.29074874,8.90086492 C3.57097271,8.57929999 3.96375279,8.35582075 4.41397719,8.29366952 L4.41397719,8.29366952 Z"></path>
                  <path fill="#D8DADD" id="矩形备份-4"
                        d="M1.79556606,5.95610901 L42.5772649,0.326399039 C43.715227,0.169309041 44.7650742,0.964463047 44.9221642,2.10242522 C44.9351755,2.19667891 44.9417041,2.29171431 44.9417041,2.38686182 L44.9417041,50.4776779 C44.9417041,51.4911031 44.2113359,52.3570205 43.2124209,52.5278991 L2.43072211,59.5041878 C1.29841621,59.6978848 0.223478472,58.936992 0.0297814687,57.8046861 C0.00996281825,57.688831 4.31972936e-16,57.5715046 0,57.4539666 L0,8.01657179 C3.16867584e-16,6.97772838 0.766481706,6.09816897 1.79556606,5.95610901 Z"></path>
                  <path fill="#D8DADD" id="路径-15"
                        d="M42.5286432,0.321249918 C44.5299765,0.172482786 45.9162098,0.970516664 46.687343,2.71535155 C47.4584763,4.46018644 47.3274103,7.62874405 46.2941451,12.2210244 L39.2425274,10.9289264 L42.5286432,0.321249918 Z"></path>
                  <path fill="#D8DADD" id="路径-14"
                        d="M0.196147886,58.3425903 C1.53077953,60.4402758 3.06634877,61.4891186 4.80285563,61.4891186 C6.53936249,61.4891186 7.84109459,59.6815728 8.70805195,56.0664811 L0.196147886,58.3425903 Z"></path>
                  <path fill="#E4E6E9" id="矩形备份-3"
                        d="M4.37842262,8.03611167 L45.1601214,2.4064017 C46.2980836,2.2493117 47.3479308,3.04446571 47.5050208,4.18242788 C47.5180321,4.27668157 47.5245607,4.37171697 47.5245607,4.46686449 L47.5245607,52.5576806 C47.5245607,53.5711057 46.7941924,54.4370232 45.7952775,54.6079018 L5.01357867,61.5841905 C3.88127277,61.7778875 2.80633503,61.0169946 2.61263803,59.8846887 C2.59281938,59.7688337 2.58285656,59.6515072 2.58285656,59.5339693 L2.58285656,10.0965745 C2.58285656,9.05773104 3.34933826,8.17817163 4.37842262,8.03611167 Z"></path>
                  <path fill="#FDFDFD" id="路径-16"
                        d="M8.16316093,10.2054339 L8.37584527,10.1763626 L8.37584527,10.1763626 L41.1605748,5.6951126 L42.8187182,5.46846577 C43.6723541,5.35176502 44.4589539,5.94918686 44.5756353,6.80282544 C44.5863219,6.88100852 44.5910611,6.95988976 44.589812,7.03878993 C44.5723908,8.13921451 44.5611363,8.90319242 44.5560485,9.33072365 C44.3995981,22.4773502 44.7396914,32.4187141 45.5763285,39.1548152 C46.4980085,46.57563 48.3035147,50.9342588 50.9928473,52.2307016 L11.9584913,58.4505368 C8.031194,54.5447878 5.89313725,49.442749 5.54432105,43.1444207 C5.2163449,37.2223866 5.33328911,27.248508 5.89515368,13.222785 C5.90039433,13.0919635 5.90782977,12.9093017 5.91746,12.6747996 C5.96913869,11.4164074 6.91531108,10.3759988 8.16316093,10.2054339 Z"></path>
                  <ellipse ry="2.34000299" rx="1.54971394" cy="34.0240135" cx="17.0468533" fill="#D8D8D8"
                           id="椭圆形"></ellipse>
                  <ellipse ry="2.34000299" rx="1.54971394" cy="32.4640115" cx="26.8617082" fill="#D8D8D8"
                           id="椭圆形备份-9"></ellipse>
                  <ellipse ry="2.34000299" rx="1.54971394" cy="30.9040095" cx="35.6434205" fill="#D8D8D8"
                           id="椭圆形备份-10"></ellipse>
                  <path fill="#BBBCBD" id="路径-17备份"
                        d="M13.5176018,4.35752992 L16.6166064,6.02350093 L16.6166064,9.91634554 C16.6165986,11.0651036 17.547851,11.996356 18.6966091,11.996356 C18.7794993,11.996356 18.8623155,11.9914011 18.9446144,11.9815179 C19.6448382,11.8974284 20.4455402,11.7942853 21.3467206,11.6720886 C23.2418445,11.4151167 26.3387699,10.9711755 30.6374968,10.340265 C31.6586436,10.1903881 32.4154535,9.31439609 32.4154535,8.28230892 L32.4154535,3.91784521 L32.4154535,3.91784521 L29.0657667,2.60000333 L13.5176018,4.35752992 Z"></path>
                  <path fill="url(#linearGradient-2)" id="路径-17"
                        d="M14.3905177,3.39784455 L17.649749,5.50350026 L17.649749,9.82636903 C17.649749,10.9751228 18.5809979,11.9063717 19.7297517,11.9063717 C19.8261589,11.9063717 19.9224495,11.8996691 20.017927,11.8863123 L31.6567687,10.2580991 C32.6841729,10.1143707 33.4485961,9.23556482 33.4485961,8.19815591 L33.4485961,3.39784455 L33.4485961,3.39784455 L29.7643972,1.47086512 L14.3905177,3.39784455 Z"></path>
                  <polygon
                      points="14.3905177 3.39784455 13.5176018 3.58841194 13.5176018 4.35752992 16.6166064 6.02350093 17.1844516 5.18526676"
                      fill="#BBBCBD" id="路径-18"></polygon>
                  <polygon points="43.0152985 33.5724077 40.1906292 40.5957612 47.4868298 37.8555629"
                           transform="translate(43.838729, 37.084084) rotate(3.000000) translate(-43.838729, -37.084084)"
                           fill="url(#linearGradient-3)" id="路径-20"></polygon>
                  <path fill="url(#linearGradient-4)" id="路径-19"
                        d="M43.2002139,33.5341253 L68.8685207,7.80915813 L73.1193826,13.6988094 L47.4414541,38.0454324 C46.1718875,37.9643373 45.1767512,37.5404907 44.4560452,36.7738928 C43.7353392,36.0072948 43.3167288,34.9273723 43.2002139,33.5341253 Z"></path>
                  <ellipse ry="3.63171855" rx="2.32993113" cy="10.7539838" cx="70.9939516"
                           transform="translate(70.993952, 10.753984) rotate(-36.000000) translate(-70.993952, -10.753984)"
                           fill="#E6E7E7" id="椭圆形"></ellipse>
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>

</template>

<style scoped>
.comment_mod {
  width: 75%;
  min-height: 423px;
  margin-left: 11%;
  margin-top: 10px;
  padding: 0.1rem 2rem;
  background: rgb(255, 255, 255);
  border-radius: 12px;
  box-shadow:  0 0 6px 5px #FFFFFF33;
}

.writeComment {
  display: flex;
  flex-direction: column;
  height: 130px;
  margin-top: 20px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  background-color: #1c2938;
}


.postComm_container {
  width: 100%;
  height: 100%;
  background-color: transparent;
  color: #FFFFFF;
  font-family: STXihei, serif;
  padding-top: 15px;
  padding-left: 20px;
  border-radius: 20px;
  /*去掉轮廓*/
  outline: none;
  border: 0;
  /*禁止textarea调整大小*/
  resize: none;
}
.chat_mod_write_Emoji {
  padding: 10px 20px;
  display: flex;
}

.chat_mod_write_Emoji img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.emojiPicker {
  width: 280px;
  height: 0;
  z-index: 9;
  position: absolute;
  opacity: 0;
  bottom: 80px;
  /*  transform: scale(0, 0);*/
  transform: translate(0px,40px);
  transition: all 0.3s ease-out;
  overflow: hidden;
}

.emojiPicker.activeE {
  height: 320px;
  opacity: 1;
  /*  transform: scale(1, 1) translate(10px, -20px);*/
}

.chat_mod_write_input {
  width: 100%;
  height: 100px;
}

/*textarea去掉滚动条，但仍具有滚动效果*/
.postComm_container::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.commUtils_mod {
  width: 100%;
  height: 40%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.other_mod {
  display: flex;
  width: 10%;
  justify-content: center;
  align-items: center;
  padding-right: 20px;
}


.other_mod span {
  font-size: large;
  color: #FFFFFF;
  font-family: 微软雅黑, serif;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.other_mod span:hover {
  color: #75c1c4;
  transition: all 0.3s ease-in-out;
}

.comment_list {
  margin-top: 20px;
}

.title {
  font-weight: 900;
  font-size: 20px;
}

.comment_user {
  width: 100%;
  margin-top: 10px;
  display: flex;
  border-bottom: 1px solid #ababab;
}

.Commentator_avatar {
  height: 50px;
  width: 50px;
  background-color: black;
  border-radius: 50%;
}

.nameAndComment {
  width: 90%;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.nameAndComment {
  font-family: STXihei, serif;
}

.commentator {
  width: 100px;
  min-width: 100px;
  color: #e58c43;
  cursor: pointer;
}

.commentator:hover {
  color: #ffbd89;
}

.comment_text {
  font-size: large;
  /*遇到换行或者空格的文本时，就会进行自动解码操作*/
  white-space: pre-wrap;
}

.comment_time {
  margin-top: 15px;
  margin-bottom: 10px;
  font-size: 12px;
  opacity: 0.5;
}

.option_mod {
  width: 100px;
  display: flex;
  align-items: end;
  padding-bottom: 15px;
}

.option_mod_next {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.commentNull_mod {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.commentNull_mod svg {
  width: 200px;
  height: 200px;
}

</style>