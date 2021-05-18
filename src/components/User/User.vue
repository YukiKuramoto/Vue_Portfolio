<template>
    <section id=RecipeNote class="view">
        <Header></Header>
        <div id="main">
            <div id="wrapper">
                <div id="tag-wrapper" class="body-wrapper">
                    <div class="tag">
                        <div class="body-title">
                            <p class="ribbon">ユーザー</p>
                        </div>
                    </div>
                </div>
                <div id="tabs-menu-wrapper">
                    <div class="tabs-menu">
                        <div id="tabs-menu-all" 
                        v-on:click.prevent="GetAllUserInfo"
                        v-bind:class="{active: IS_AllUser}">
                            All User
                        </div>
                        <div id="tabs-menu-follow" 
                        v-on:click.prevent="GetFollowUserInfo"
                        v-bind:class="{active: IS_FollowUser}">
                            Follow User
                        </div>
                        <div id="tabs-menu-follower" 
                        v-on:click.prevent="GetFollowerUserInfo"
                        v-bind:class="{active: IS_FollowerUser}">
                            Follower User
                        </div>
                    </div>
                </div>
                <div class="tabs-content">
                    <div id="tabs-all">
                        <div id="all-user-wrapper" class="body-wrapper temp-user-wrapper">
                            <div id="user-wrapper-outer" class="temp-user-wrapper-outer">
                                <div class="user-wrapper" v-for="user in Users" v-bind:key="'key-' + user.key">
                                    <div class="user-image-wrapper">
                                        <img class="user-image" v-bind:src="user.image">
                                    </div>
                                    <div class="user-name-wrapper">
                                        <div class="user-name">
                                            <a class="user-name-contents" v-bind:href="'/top?uid='+user.key">{{ user.name }}</a>
                                            <button type="button"
                                            class="btn btn-secondary btn-block fav-button" 
                                            v-bind:id="user.key" 
                                            v-bind:class="{'following-button': user.followStatus === 'フォロー中'}"
                                            v-on:click="FollowUser">
                                                {{ user.followStatus}}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import Vue from 'vue';
    import firebase from 'firebase';
    import $ from 'jquery';
    import Header from '../Header/HeaderParts.vue';
    import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
    
    Vue.use(BootstrapVue);
    Vue.use(BootstrapVueIcons);
    
    export default {
        name: 'UserPage',
        components: {
            Header,
        },
        data() {
            return {
                currentStatus: 'IS_AllUser',
                currentUser:'',
                currentUserName: '',
                currentUserImage: '',
                Users: []
            };
        },
        computed: {
            IS_AllUser: function(){
                return this.currentStatus === 'IS_AllUser';
            },
            IS_FollowUser: function(){
                return this.currentStatus === 'IS_FollowUser';
            },
            IS_FollowerUser: function(){
                return this.currentStatus === 'IS_FollowerUser';
            }
        },
        created(){
            this.currentUser = this.GetParams('uid');
            firebase
            .database()
            .ref('user')
            .orderByChild('userid')
            .equalTo(this.currentUser)
            .on('child_added', (userSnapShot) => {
                this.currentUserName = userSnapShot.val().username;
                this.currentUserImage = userSnapShot.val().image;
            });
            this.GetAllUserInfo();
        },
        methods: {
            GetParams: function(name, url){
                if (!url) url = window.location.href;
                name = name.replace(/[[\]]/g, "\\$&");
                var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));  
            },
            GetAllUserInfo: function(){
                this.currentStatus = 'IS_AllUser';
                this.Users = [];
                this.GetUserFromFirebase('user');
            },
            GetFollowUserInfo: function(){
                this.currentStatus = 'IS_FollowUser';
                this.Users = [];
                this.GetUserFromFirebase(`follow/${this.currentUser}`);
            },
            GetFollowerUserInfo: function(){
                this.currentStatus = 'IS_FollowerUser';
                this.Users = [];
                this.GetUserFromFirebase(`follower/${this.currentUser}`);
            },
            GetUserFromFirebase: function(dirKey){
                firebase
                .database()
                .ref(dirKey)
                .once('value', (userSnapShot) => {
                    userSnapShot.forEach(user => {
                        if(this.currentUser !== user.val().userid){
                            console.log(user.val());
                            this.CheckFollowingOrNot(user.val());
                        }
                    });
                });
            },
            CheckFollowingOrNot: function(user){
                let btnSentence = 'フォロー';
                firebase
                .database()
                .ref(`follow/${this.currentUser}`)
                .once('value', (followSnapShot) => {
                    followSnapShot.forEach(follow => {
                        if(user.userid === follow.key){
                            btnSentence = 'フォロー中';
                        }
                    });
                }).then(() => {
                    this.GetUserImage(user, btnSentence);
                });
            },
            GetUserImage: function(user, btnSentence){
                firebase
                .storage()
                .ref(`prof-images/${user.image}`)
                .getDownloadURL()
                .then((url) => {
                    this.Users.push({
                        key: user.userid,
                        imagelocation: user.image,
                        image: url,
                        name: user.username,
                        followStatus: btnSentence 
                    });
                    console.log(this.Users);
                });
                
            },
            FollowUser: function(e){
                const userId_Follow = e.target.id;
                let dbdata = {};
                dbdata.follow = {};
                firebase
                .database()
                .ref(`follow/${this.currentUser}`)
                .once('value', (followSnapShot) => {
                    followSnapShot.forEach(item => {
                        dbdata.follow[`${item.key}`] = item.val();
                    });
                }).then(() => {
                        if (dbdata.follow[userId_Follow]){
                            firebase
                            .database()
                            .ref(`follow/${this.currentUser}/${userId_Follow}`)
                            .remove();
                            
                            firebase
                            .database()
                            .ref(`follower/${userId_Follow}/${this.currentUser}`)
                            .remove();
                            
                            $(`#${userId_Follow}`).text('フォロー');
                            $(`#${userId_Follow}`).removeClass('following-button');
                        }else{
                            let userName, userImage, userId;
                            firebase
                            .database()
                            .ref('user')
                            .orderByChild('userid')
                            .equalTo(userId_Follow)
                            .once('value', (userSnapShot) => {
                                userSnapShot.forEach(user => {
                                    userName = user.val().username;
                                    userImage = user.val().image;
                                    userId = user.val().userid;
                                });

                                firebase
                                .database()
                                .ref(`follow/${this.currentUser}/${userId_Follow}`)
                                .set({
                                    username: userName,
                                    image: userImage,
                                    userid: userId,
                                    createdAt: firebase.database.ServerValue.TIMESTAMP,
                                });
                                
                                firebase
                                .database()
                                .ref(`follower/${userId_Follow}/${this.currentUser}`)
                                .set({
                                    username: this.currentUserName,
                                    image: this.currentUserImage,
                                    userid: this.currentUser,
                                    createdAt: firebase.database.ServerValue.TIMESTAMP,
                                });
                                $(`#${userId_Follow}`).text('フォロー中');
                                $(`#${userId_Follow}`).addClass('following-button');
                            });
                        }
                });
            },
        }
    };
    
</script>

<style scoped src='./User.css'>
    
</style>