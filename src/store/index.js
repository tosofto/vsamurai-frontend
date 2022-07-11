import { createStore } from "vuex";
import wallet from './wallet';
import collectable from './collectable';
export const store = createStore({
  modules: {
    wallet,
    collectable,
  }
})
