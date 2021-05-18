<template>
    <section id="RecipeNote" class="view">
        <Header v-on:SendUserId="ReciveUserId"></Header>
        <div id="form-wrapper">
            <div id="form-body">
                <div class="tag">
                    <div class="body-title">
                        <p class="ribbon">レシピ</p>
                    </div>
                </div>
                <div id="recipe-info">
                    <div id="form-image-wrapper">
                        <div id="recipe-title-wrapper">
                            <span class="contents-heading">料理名</span>
                            <h4 id="recipe-title">{{ recipeData.title }}</h4>
                        </div>
                        
                        <div id="recipe-image-wrapper">
                            <p id="recipe-image"><img class="image-template" v-bind:src="recipeData.image"></p>
                        </div>
                    
                    </div>
                    <div id="form-ingredients-wrapper">
                        <span class="contents-heading">材料</span>
                        <section id="form-ingredients">
                            <table id="ingredient-table" class=table-striped>
                                <tbody id="table-body">
                                    <tr>
                                        <th>材料</th>
                                        <th>数量</th>
                                    </tr>
                                    <template v-for="ingredient in recipeData.ingredients">
                                        <tr class="table-row" v-bind:key="ingredient.key">
                                            <td>{{ ingredient.name }}</td>
                                            <td>{{ ingredient.amount }}</td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </section>
                    </div>
                </div>
                    <div id="form-recipe">
                <div id="recipe-cost-comment">
                    <section id="form-cost">
                        <span class="contents-heading">一食あたり費用</span>
                        <p id="recipe-cost">{{ recipeData.cost }}</p>
                    </section>
                    <div id="recipe-comment-wrapper">
                        <span class="contents-heading">一言コメント</span>
                        <div class="recipe-body recipe-body-contents">
                            <p id="recipe-comment">{{ recipeData.comment }}</p>
                        </div>
                    </div>
                    </div>
                    
                </div>
                <div id="form-recipe">
                    <span class="contents-heading">調理手順</span>
                    <div id="recipe-insert">
                        <div v-for="method in recipeData.methods"
                            v-bind:key="method.key"
                            class="recipe-body recipe-method">
                            <p class="method-heading">{{ method.methodTitle }}</p>
                            <p class="method-body recipe-body-contents">{{ method.method }}</p>
                        </div>
                    </div>
                    <div class="button-area">
                        <div>
                            <form id="edit-area" v-show="IS_USER" class="button-area">
                                <button id="edit" 
                                v-on:click.prevent="MoveToEdit"
                                type="submit" 
                                class="btn btn-secondary user-button">
                                    編集
                                </button>
                            </form>
                        </div>
                        <div>
                            <form id="delete-area" v-show="IS_USER" class="button-area">
                                <button id="delete" 
                                v-on:click.prevent="DeleteData"
                                type="submit" 
                                class="btn btn-secondary user-button">
                                    削除
                                </button>
                            </form>
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
    import $ from 'jquery';
    
    export default {
        name: 'RecipePage',
        components: {
            Header,
        },
        data(){
            return {
                recipeData: {},
                currentUser: '',
                postUser: '',
            };
        },
        computed: {
            IS_USER: function(){
                return this.currentUser === this.postUser;
            }
        },
        created(){
            this.GetRecipeInfo();  
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
            ReciveUserId: function(uid){
                this.currentUser = uid;
            },
            GetRecipeInfo: function(){
                const recipeId = this.GetParams('recipeId');
                this.postUser = this.GetParams('uid');
                
                firebase
                .database()
                .ref(`recipe/${recipeId}`)
                .once('value', (recipeSnapShot) => {
                    const recipeData = recipeSnapShot.val();
                    console.log(recipeData)
                    this.PushRecipeInfo(recipeData);
                });
            },
            PushRecipeInfo: function(recipeData){
                firebase
                .storage()
                .ref(recipeData.image)
                .getDownloadURL()
                .then((url) => {
                    this.recipeData = {
                        title: recipeData.title,
                        cost: recipeData.cost,
                        comment: recipeData.comment,
                        imageLocation: recipeData.image,
                        image: url,
                        ingredients: [],
                        methods: [],
                    };
                    for(let i = 0; i < recipeData.ingredient.length; i++){
                        this.recipeData.ingredients.push({
                            key: `ingredient${i}`,
                            amount: recipeData.ingredient[i].amount,
                            name: recipeData.ingredient[i].name,
                        });
                    }
                    for(let i = 0; i < recipeData.method.length; i++){
                        this.recipeData.methods.push({
                            key: `method${i}`,
                            methodTitle: `作り方${i+1}`,
                            method: recipeData.method[i],
                        });
                    }
                    console.log(this.recipeData.title)
                });
                console.log(this.recipeData)
            },
            MoveToEdit: function(){
                const recipeId = this.GetParams('recipeId');
                const params = $.param({
                    recipeId: recipeId
                });
                window.location.href=`/post?${params}`;
            },
            DeleteData: function(){
                const recipeId = this.GetParams('recipeId');
                console.log(this.recipeImageLocation);
                let result = window.confirm('このレシピを削除しますか？');
                if(result === true){
                    firebase
                    .database()
                    .ref(`recipe/${recipeId}`)
                    .remove();
                    window.location.href = `/top?uid=${this.currentUser}`;
                }
            },
        },
    };
</script>

<style scoped src="./Recipe.css">
    
</style>

















                    <!--// firebase-->
                    <!--// .storage()-->
                    <!--// .ref(this.recipeImageLocation)-->
                    <!--// .delete()-->
                    <!--// .then(() => {-->
                    <!--//     console.log('画像削除完了');-->
                    <!--// }).catch((error) => {-->
                    <!--//     console.error('削除に失敗しました。', error);-->
                    <!--// });-->
                    