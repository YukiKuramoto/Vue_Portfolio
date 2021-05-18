<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
  import firebase from 'firebase';
  
  const BeforeSignIn = 'beforeSignIn';
  const AfterSignIn = 'afterSignIn';
  
  export default {
    head:{
      title() {
        return {
          inner: 'RecipeNote',
          separator: '|',
          complement: '手軽にレシピ投稿'
        };
      },        
      meta: [
            { name: 'description', content: 'My description', id: 'desc' }
            ],
        },
      data(){
        return { currentState: BeforeSignIn }
      },
      create(){
        this.currentState = BeforeSignIn;
      },
      computed: {
        IS_BeforeSignIn: function(){
          return this.currentState === BeforeSignIn;
        },
        IS_AfterSignIn: function(){
          return this.currentState === AfterSignIn;
        }
      },
      methods: {
        ToSignIn: function(){
          this.currentState = AfterSignIn;
        },
        ToChangeStatus: function(e){
          console.log(e);
          if(this.currentState === BeforeSignIn){
            this.currentState = AfterSignIn;
          }else{
            this.currentState = BeforeSignIn;
          }
        }
      }
    };
    
  const config = {
    apiKey: "AIzaSyDiP6LLW-6kYjD2Pg4fEKkn-LUqs9vZu_c",
    authDomain: "recipe-note-cdf02.firebaseapp.com",
    databaseURL: "https://recipe-note-cdf02-default-rtdb.firebaseio.com",
    projectId: "recipe-note-cdf02",
    storageBucket: "recipe-note-cdf02.appspot.com",
    messagingSenderId: "955384232949",
    appId: "1:955384232949:web:ebf309de56fdc54dab3ebc",
    measurementId: "G-6Q92J35YJ7"
  };
  
  firebase.initializeApp(config);
  
</script>

<style>

</style>
