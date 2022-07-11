<script>
// @ts-check
import home from "./views/home.vue";
import myDojo from "./views/myDojo.vue";
import breeding from "./views/breeding.vue";
import { store } from './store';


const routes = [
    {
      path: "/",
      component: home,
    },
    {
      path: "/my-dojo",
      component: myDojo,
       beforeEnter: (to, from, next) => {        
         if(store.state.collectable && store.state.collectable.collectable && store.state.collectable.collectable.userNFTs && store.state.collectable.collectable.userNFTs.length){
           next()
         }
         next('/')
       }
    },
    // {
    //   path: "/breeding",
    //   component: breeding,
    //    beforeEnter: (to, from, next) => {        
    //      if(store.state.collectable && store.state.collectable.collectable && store.state.collectable.collectable.userNFTs && store.state.collectable.collectable.userNFTs.length){
    //        next()
    //      }
    //      next('/')
    //    }
    // },
  ]

export default routes;
</script>
