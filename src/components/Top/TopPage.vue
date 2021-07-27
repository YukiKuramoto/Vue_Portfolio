<template>
    <section id="RecipeNote" class="view">
        <Header></Header>
        <div id="cover">
            <h1 id="cover-title">自慢のレシピを投稿しよう</h1>
        </div>
        <div id="wrapper">
            <div id="sidebar">
                <div id="category">
                    <div id="profile-wrapper">
                        <div class="tag">
                            <h3>Profile</h3>
                        </div>
                        <div id="my-image-wrapper">
                            <img v-bind:src="profImage" id="my-image">
                        </div>
                        <div id="user-name">
                            <p>ニックネーム</p>
                            <p>test</p>
                            <h4 id="nick-name">{{ nickName }}</h4>
                        </div>
                        <div id="prof-wrapper">
                            <div id="prof-info-wrapper">
                                <div class="prof-info-contents" id="post-num">
                                    <p>レシピ数</p>
                                    <h3 id='recipe-num'>{{ recipeNum }}</h3>
                                </div>
                                <div class="prof-info-contents" id="friends-num">
                                    <p>フォロワー</p>
                                    <h3 id='follower-num'>{{ followerNum }}</h3>
                                </div>
                            </div>
                        </div>
                        <div id="prof-comment-wrapper">
                            <div id="prof-comment">
                                <p id="prof-comment-contents">{{ profComment }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="contents">
                <div class="tag">
                    <div class="body-title">
                        <p class="ribbon">投稿レシピ一覧</p>
                    </div>
                </div>
                <div id="recipe-body-outer">
                    <div class= "recipe-body">
                        <a v-for="recipe in myRecipes" 
                            v-bind:key="recipe.key" 
                            v-bind:href="recipe.href" 
                            class="recipe-item-wrapper">
                            <div class="recipe-item-image-wrapper">
                                <img 
                                v-bind:src="recipe.image"
                                class="recipe-item-image">
                            </div>
                            <div class="recipe-info">
                                <p class="recipe-title">{{ recipe.title }}</p>
                                <p class="recipe-comments">{{ recipe.comment }}</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
/* jshint curly:true, debug:true */
// /* globals $ */
    
    import $ from 'jquery';
    import Header from '../Header/HeaderParts.vue';
    import firebase from 'firebase';
    
    export default {
        name: 'TopPage',
        components: { Header },
        created(){
            this.ShowTopPage();
        },
        data() {
            return {
                myRecipes: [],
                profImage: '',
                nickName: '',
                followerNum: '',
                recipeNum: '',
                profComment: '',
            };
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
            ShowTopPage: function(){
                const param = this.GetParams('uid');
                this.GetRecipeData(param);
                this.GetProfInfo(param);
                this.GetFollowerInfo(param);
            },
            GetRecipeData: function(userid){
                const recipeRef = firebase
                .database()
                .ref('recipe')
                .orderByChild('user')
                .equalTo(userid);
                
                recipeRef.once('value', (recipeSnapShot) => {
                    if(recipeSnapShot.numChildren() !== 0){
                        this.recipeNum = recipeSnapShot.numChildren();
                    }else{
                        this.recipeNum = 0;
                    }
                    recipeSnapShot.forEach(item => {
                        this.GetRecipeItem(item.val(), item.key);
                    });
                });
            },
            GetRecipeItem: function(item, RecipeId){
                const params = $.param({
                    uid: item.user,
                    recipeId: RecipeId
                });
                const href = `/recipe?${params}`;
                
                firebase
                .storage()
                .ref(item.image)
                .getDownloadURL()
                .then((url) => {
                    this.myRecipes.push({
                        key: RecipeId,
                        comment: item.comment,
                        createdAt: item.createdAt,
                        title: item.title,
                        href: href,
                        image: url,
                        });
                });
            },
            GetProfInfo: function(userId){
                const ProfRef = firebase
                .database()
                .ref('user')
                .orderByChild('userid')
                .equalTo(userId);
                
                ProfRef.once('value', (profSnapShot) => {
                    profSnapShot.forEach(item => {
                        const itemData = item.val();
                        firebase
                        .storage()
                        .ref(`prof-images/${itemData.image}`)
                        .getDownloadURL()
                        .then((url) => {
                            this.profImage = url;
                            this.nickName = itemData.username;
                            this.profComment = itemData.usercomment;
                        });
                    });
                    
                });
            },
            GetFollowerInfo: function(userId){
                firebase
                .database()
                .ref(`follower/${userId}`)
                .once('value', (followerSnapShot) => {
                    if(followerSnapShot.numChildren() !== 0){
                        this.followerNum = followerSnapShot.numChildren();
                    }else{
                        this.followerNum = 0;
                    }
                });
            }
        }
    };
    
</script>

<style scoped src="./TopPage.css">
    
</style>
