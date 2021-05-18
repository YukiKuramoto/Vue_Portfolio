<template>
    <section id=RecipeNote class="view">
        <Header v-on:SendUserId="ReciveUserId"></Header>
        <form id="form-wrapper">
            <div id="form-body">
                <div class="tag">
                    <div class="body-title">
                        <p class="ribbon">レシピ投稿</p>
                    </div>
                </div>
                <div id="recipe-info">
                    <div id="form-image-wrapper">
                        <div id="recipe-title-wrapper">
                            <span class="contents-heading">料理名</span>
                            <p>
                                <input v-bind:value="recipeData.title" type="text" placeholder="料理名" class="form-list recipe-title" id="post-recipe-title">
                            </p>
                        </div>
                        <p>
                            <img v-if="IS_New" id="recipe-image" class="recipe-photo" src="../../assets/sample.png">
                            <img v-else-if="IS_New_Selected" id="recipe-image" class="recipe-photo" v-bind:src="sampleImg">
                            <img v-else-if="IS_Edit" id="recipe-image" class="recipe-photo" v-bind:src="recipeData.image">
                        </p>
                        <input v-on:input="GetSampleImg" type="file" name="s_file" class="image-input" id="post-recipe-image">
                    </div>
                    <div id="form-ingredients-wrapper">
                        <span class="contents-heading">
                            材料
                            <section id="plus-btn">
                                <a href="" id="ingredient-plus-btn" class="plus-minus-btn" v-on:click.prevent="AddIngredientsList">
                                    <b-icon-plus-circle></b-icon-plus-circle>
                                </a>
                                <a href="" id="ingredient-minus-btn" class="plus-minus-btn" v-on:click.prevent="RemoveIngredientsList">
                                    <b-icon-dash-circle></b-icon-dash-circle>
                                </a>
                            </section>
                        </span>
                        <section id="form-ingredients">
                            <table id="ingredient-table">
                                <tbody id="table-body">
                                    <tr>
                                        <th>材料</th>
                                        <th>数量</th>
                                    </tr>
                                    <tr class="table-row"
                                        v-for="ingredient in recipeData.ingredientsList"
                                        v-bind:key="ingredient.key">
                                        <td><input v-bind:value="ingredient.name" type="text" placeholder="材料" class="form-list name"></td>
                                        <td><input v-bind:value="ingredient.amount" type="text" placeholder="数量" class="form-list amount"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </section>
                    </div>
                </div>
                <div id="form-recipe">
                    <div id="recipe-cost-comment">
                        <section id="form-cost">
                            <span class="contents-heading">一食あたり費用</span>
                            <p>
                                <input v-bind:value="recipeData.cost" type="text" placeholder="金額" class="form-list recipe-cost" id="post-recipe-cost">
                            </p>
                        </section>
                        <div id="recipe-comment">
                            <span class="contents-heading">一言コメント</span>
                            <div class="recipe-body">
                                <textarea v-bind:value="recipeData.comment" placeholder="一言コメントを入力してください" class="recipe-comment" id="post-recipe-comment"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="form-recipe">
                    <span class="contents-heading">
                        調理手順
                        <section id="plus-btn">
                            <a href="" id="ingredient-plus-btn" class="plus-minus-btn" v-on:click.prevent="AddMethodsList">
                                <b-icon-plus-circle></b-icon-plus-circle>
                            </a>
                            <a href="" id="ingredient-minus-btn" class="plus-minus-btn" v-on:click.prevent="RemoveMethodsList">
                                <b-icon-dash-circle></b-icon-dash-circle>
                            </a>
                        </section>
                    </span>
                    <div class="recipe-insert">
                        <div class="recipe-body" v-for="method in recipeData.methodsList" v-bind:key="method.key">
                            <p>作り方</p>
                            <textarea v-bind:value="method.method" placeholder="作り方を入力してください" class="cook-method"></textarea>
                        </div>
                    </div>
                </div>
                <div id="submit-button">
                    <button type="submit" class="btn btn-secondary btn-block submit-button" v-on:click.prevent="PostRecipe">投稿する</button>
                </div>
            </div>
        </form>
    </section>
</template>

<script>
    import Vue from 'vue';
    import firebase from 'firebase';
    import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
    import Header from '../Header/HeaderParts.vue';
    
    Vue.use(BootstrapVue);
    Vue.use(BootstrapVueIcons);
    
    export default {
        name: 'PostPage',
        components: {
            Header,
        },
        data(){
            return {
                currentUser: '',
                currentUserName: '',
                recipeId: '',
                recipeImageLocation: '',
                sampleImg: '',
                postStatus: 'IS_New',
                recipeData: {
                    ingredientsList: [{
                        key: 'ingredient1',
                        name: '',
                        amoount: '',
                    }],
                    methodsList: [{
                        key: 'method1',
                        method: '',
                    }]
                },
            };
        },
        computed: {
            IS_New: function(){
                return this.postStatus === 'IS_New';
            },
            IS_New_Selected: function(){
                return this.postStatus === 'IS_New_Selected';
            },
            IS_Edit: function(){
                return this.postStatus === 'IS_Edit';
            }
        },
        created(){
            const recipeParams = this.GetParams('recipeId');
            if(recipeParams !== 'new'){
                this.recipeId = recipeParams;
                this.ChangeStatus();
                this.ShowRecipeEditForm(recipeParams);
            }
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
            ReciveUserId: function(...data){
                this.currentUser = data[0];
                this.currentUserName = data[1];
            },
            ChangeStatus: function(){
                this.postStatus = 'IS_Edit';
            },
            ChangeDataOption: function(){
                this.recipeData.title = document.getElementById('post-recipe-title').value;
                this.recipeData.cost = document.getElementById('post-recipe-cost').value;
                this.recipeData.comment = document.getElementById('post-recipe-comment').value;
                this.recipeData.ingredientsList = [];
                this.recipeData.methodsList = [];
                
                for(let i = 0; i < document.getElementsByClassName('cook-method').length; i++){
                    this.recipeData.methodsList.push({
                        key: `ingredient${i}`,
                        method: document.getElementsByClassName('cook-method')[i].value
                    });
                }
                for(let i = 0; i < document.getElementsByClassName('table-row').length; i++){
                    this.recipeData.ingredientsList.push({
                        key: `method${i}`,
                        name: document.getElementsByClassName('name')[i].value,
                        amount: document.getElementsByClassName('amount')[i].value,
                    });
                }
            },
            GetSampleImg: function(){
                const file = document.getElementById('post-recipe-image').files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.ChangeDataOption();
                    this.sampleImg = e.target.result;
                    this.postStatus = 'IS_New_Selected';
                };
                reader.readAsDataURL(file);
            },
            AddIngredientsList: function(){
                const newIngredient = {
                    key: `ingredient${this.recipeData.ingredientsList.length + 1}`,
                    name: '',
                    amount: '',
                };
                this.ChangeDataOption();
                this.recipeData.ingredientsList.push(newIngredient);
            },
            AddMethodsList: function(){
                const newMethod = {
                    key: `method${this.recipeData.methodsList.length + 1}`,
                    method: '',
                };
                this.ChangeDataOption();
                this.recipeData.methodsList.push(newMethod);
            },
            RemoveIngredientsList: function(){
                if(this.recipeData.ingredientsList.length !== 1){
                    const indexDeletion = this.recipeData.ingredientsList.length - 1;
                    this.ChangeDataOption();
                    this.recipeData.ingredientsList.splice(indexDeletion, 1);
                }
            },
            RemoveMethodsList: function(){
                if(this.recipeData.methodsList.length !== 1){
                    const indexDeletion = this.recipeData.methodsList.length - 1;
                    this.ChangeDataOption();
                    this.recipeData.methodsList.splice(indexDeletion, 1);
                }
            },
            PostRecipe: function(){
                let file;
                let recipeImage;
                const recipeData = {
                    title: document .getElementById('post-recipe-title').value,
                    cost: document.getElementById('post-recipe-cost').value,
                    comment: document.getElementById('post-recipe-comment').value,
                    ingredient: [],
                    method: [],
                    user: this.currentUser,
                    username: this.currentUserName
                };
                
                for(let i = 0; i < document.getElementsByClassName('cook-method').length; i++){
                    recipeData.method.push(document.getElementsByClassName('cook-method')[i].value);
                }
                for(let i = 0; i < document.getElementsByClassName('table-row').length; i++){
                    recipeData.ingredient.push({
                        name: document.getElementsByClassName('name')[i].value,
                        amount: document.getElementsByClassName('amount')[i].value,
                    });
                }
                
                if(document.getElementById('post-recipe-image').files[0] !== undefined){
                    file = document.getElementById('post-recipe-image').files[0];
                    recipeImage = document.getElementById('post-recipe-image').files[0].name,
                    recipeData.image = `recipe-images/${recipeImage}`;
                }else if(this.recipeImageLocation !== ''){
                    recipeData.image = this.recipeImageLocation;
                }else{
                    alert('画像が選択されていません');
                    return;
                }
                
                if(this.postStatus === 'IS_New_Selected'){
                    this.PostNewRecipe(recipeData, file);
                }else if(this.postStatus === 'IS_Edit' && this.recipeImageLocation === recipeData.image){
                    this.EditRecipe(recipeData);
                }else if(this.postStatus === 'IS_Edit'  && this.recipeImageLocation !== recipeData.image){
                    this.UpdateStorage(recipeData, file);
                    this.EditRecipe(recipeData);
                }
            },
            PostNewRecipe: function(recipeData, file){
                firebase
                .storage()
                .ref(recipeData.image)
                .put(file)
                .then(() => {
                    recipeData.createdAt = firebase.database.ServerValue.TIMESTAMP;
                    return firebase.database().ref('recipe').push(recipeData);
                }).then(() => {
                    console.log('保存成功');
                    window.location.href = `/top?uid=${this.currentUser}`;
                }).catch((error) => {
                    console.error('エラー', error);
                });
            },
            UpdateStorage: function(recipeData, file){
                firebase
                .storage()
                .ref(recipeData.image)
                .put(file)
                .then(() => {
                    console.log('更新成功');
                });
            },
            EditRecipe: function(recipeData){
                firebase
                .database()
                .ref(`recipe/${this.recipeId}`)
                .update(recipeData)
                .then(()=> {
                    console.log('データ更新完了');
                    window.location.href = `/top?uid=${this.currentUser}`;
                });
            },
            ShowRecipeEditForm: function(recipeId){
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
                    console.log(this.recipeData.ingredientsList)
                    this.recipeData = {
                        title: recipeData.title,
                        cost: recipeData.cost,
                        comment: recipeData.comment,
                        recipeImageLocation: recipeData.image,
                        image: url,
                        ingredientsList: [],
                        methodsList: [],
                    };
                    for(let i = 0; i < recipeData.ingredient.length; i++){
                        this.recipeData.ingredientsList.push({
                            key: `ingredient${i}`,
                            amount: recipeData.ingredient[i].amount,
                            name: recipeData.ingredient[i].name,
                        });
                    }
                    for(let i = 0; i < recipeData.method.length; i++){
                        this.recipeData.methodsList.push({
                            key: `method${i + 1}`,
                            method: recipeData.method[i],
                        });
                    }
                });
                console.log(this.recipeData)
            },
        }
    };
    
</script>

<style src="./Post.css">
    
</style>