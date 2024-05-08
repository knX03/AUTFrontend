import {createRouter, createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Test from '../views/test.vue'
import navAUT from '../components/utils/AUTnav.vue'
import MY from '../views/MY.vue'
import secondNav from '../components/utils/secondNav.vue'
import singer from '../views/singer.vue'
import songList from '../views/songList.vue'
import album from '../views/album.vue'
import myInfo from '../views/myInfo.vue'
import playlistDetails from '../views/SecondPage/playlistDetail.vue'
import albumDetail from '../views/SecondPage/albumDetail.vue'
import singerDetail from '../views/SecondPage/singerDetail.vue'
import dailyRecomm from '../views/SecondPage/dailyRecomm.vue'
import signIn from '../views/LRF/signIn.vue'
import signUp from '../views/LRF/signUp.vue'
import forgetPass from '../views/LRF/fogerPass.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/test',
            name: 'Test',
            component: Test
        },
        {
            path: '/MY',
            name: 'MY',
            component: MY
        },
        /*{
            path: '/nav',
            name: 'navAUT',
            component: navAUT
        },
        {
            path: '/secondNav',
            name: 'secondNav',
            component: secondNav
        },*/
        {
            path: '/singer',
            name: 'singer',
            component: singer
        },
        {
            path: '/songList',
            name: 'songList',
            component: songList
        },
        {
            path: '/album',
            name: 'album',
            component: album
        },
        {
            path: '/myInfo',
            name: 'myInfo',
            component: myInfo
        },
        {
            path: '/playlistDetails',
            name: 'playlistDetails',
            component: playlistDetails
        },
        {
            path: '/albumDetail',
            name: 'albumDetail',
            component: albumDetail
        },
        {
            path: '/singerDetail',
            name: 'singerDetail',
            component: singerDetail
        },
        {
            path: '/dailyRecomm',
            name: 'dailyRecomm',
            component: dailyRecomm
        },{
            path: '/signIn',
            name: 'signIn',
            component: signIn
        },{
            path: '/signUp',
            name: 'signUp',
            component: signUp
        },{
            path: '/forgetPass',
            name: 'forgetPass',
            component: forgetPass
        }

    ]
})

export default router
