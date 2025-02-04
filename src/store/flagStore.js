import {defineStore} from 'pinia';

const useFlagStore = defineStore("flagData", {
    state: () => ({
        flag: false,
    }),
    persist: {
        enabled: true,
        strategies:
            {
                key: 'flag_store',
                storage: sessionStorage,
            },

    },
})

export default useFlagStore