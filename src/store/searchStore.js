import {defineStore} from 'pinia';
import {store} from "xijs";
import useUserStore from "@/store/userStore.js";

const useSearchStore = defineStore("searchData", {
    state: () => ({
        searchValue: '',
    }),

})

export default useSearchStore