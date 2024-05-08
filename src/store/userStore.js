import {defineStore} from 'pinia';

const useUserStore = defineStore("userInfo", {
    state: () => ({
        id: null,
        user_Age: null,
        user_Avatar: "",
        user_Birthday: "",
        user_Email: null,
        user_ID: "",
        user_Introduction: "",
        user_Name: "",
        user_Sex: "",
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

export default useUserStore