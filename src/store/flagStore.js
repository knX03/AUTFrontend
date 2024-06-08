import {defineStore} from 'pinia';

const useFlagStore = defineStore("flagData", {
    state: () => ({
        flag: false,
    }),
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'login_store',
                storage: localStorage,
            },
        ],
    },
})

export default useFlagStore