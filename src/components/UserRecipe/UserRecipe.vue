<template>
    <section id=RecipeNote class="view">
        <Header></Header>
        <div id="main">
            <div id="wrapper">
                <div id="tag-wrapper" class="body-wrapper">
                    <div class="tag">
                        <div class="body-title">
                            <p class="ribbon">最新レシピ投稿</p>
                        </div>
                    </div>
                </div>
                <div id="heading-message">
                    <h3>みんなの投稿をチェックしよう！</h3>
                </div>
                <div id="outer-of-outer">
                    <div id="recipe-body-outer">
                        <div class= "recipe-body">
                            <a v-for="recipe in allRecipes" v-bind:key="recipe.key" v-bind:href="'/recipe?recipeId='+recipe.key" class="recipe-item-wrapper">
                                <div class="recipe-item-image-wrapper">
                                    <img v-bind:src="recipe.imagelocation" class="recipe-item-image">
                                </div>
                                <div class="recipe-info">
                                    <p class="recipe-title">{{ recipe.title }}</p>
                                    <p class="recipe-comments">{{ recipe.comment }}</p>
                                </div>
                                    <p id="user-name">posted by : {{ recipe.username }}</p>
                                <div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import Header from '../Header/HeaderParts.vue';
    import firebase from 'firebase';
    
    export default {
        name: 'UserRecipe',
        components: { Header },
        data(){
            return {
                currentUser: '',
                allRecipes: [],
            };
        },
        created(){
            this.currentUser = this.GetParams('uid');
            this.GetRecipeData();
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
            GetRecipeData: function(){
                firebase.
                database().
                ref('recipe').
                on('child_added', (recipeSnapShot) => {
                    const recipeId = recipeSnapShot.key;
                    const recipeData = recipeSnapShot.val();
                    if(recipeData.user !== this.currentUser){
                        this.GetRecipeImage(recipeData, recipeId);
                    }
                });
            },
            GetRecipeImage: function(recipeData, recipeId){
                firebase
                .storage()
                .ref(recipeData.image)
                .getDownloadURL()
                .then((url) => {
                    this.allRecipes.push({
                        key: recipeId,
                        comment: recipeData.comment,
                        createdAt: recipeData.createdAt,
                        title: recipeData.title,
                        image: recipeData.image,
                        imagelocation: url,
                        username: recipeData.username,
                    });
                })
            }
        }
    };

</script>

<style scoped src='./UserRecipe.css'>
    
</style>