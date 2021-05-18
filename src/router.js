
import Vue from 'vue';
import Router from 'vue-router';
import VueHead from 'vue-head';
import SignInUp from './components/SignInUp/SignInUp';
import Top from './components/Top/TopPage.vue';
import Recipe from './components/Recipe/Recipe.vue';
import Post from './components/Post/Post.vue';
import User from './components/User/User.vue';
import UserRecipe from './components/UserRecipe/UserRecipe.vue';
import Profile from './components/Prof/Prof.vue';



 Vue.use(Router);
 Vue.use(VueHead);

export default new Router({
  mode: 'history',                  
  base: process.env.BASE_URL,
  routes: [
      {
          path: '/',
          name: 'App',
          components: {
              default: SignInUp,
              afterSignIn: Top
          },
      },
      {
          path: '/top',
          name: 'Top',
          component: Top
      },
      {
          path: '/recipe',
          name: 'Recipe',
          component: Recipe
      },
      {
          path: '/post',
          name: 'Post',
          component: Post
      },
      {
          path: '/user',
          name: 'User',
          component: User
      },
      {
          path: '/userrecipe',
          name: 'UserRecipe',
          component: UserRecipe
      },
      {
          path: '/prof',
          name: 'Profile',
          component: Profile
      }
      ]
});
