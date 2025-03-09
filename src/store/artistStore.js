import {defineStore} from 'pinia';

const useArtistStore = defineStore("artistData", {
    state: () => ({
        artistComIndex: 0,


    }),
})

export default useArtistStore