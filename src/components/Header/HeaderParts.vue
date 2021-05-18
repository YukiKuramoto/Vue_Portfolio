<template>
    <header>
        <div id="header">
            <a v-bind:href="'/top?uid='+currentUser"><img src="../../assets/logo_RecipeNotes.png" alt="RecipeNote" id="logo"></a>
            <nav class="page-menu">
                <a class="menu-btn" v-bind:href="'/prof?uid='+currentUser" id="user-Nickname">ユーザー：{{ currentUserName }}</a>
                <a class="menu-btn" v-bind:href="'/top?uid='+currentUser" id="my-recipe-link">My Recipe</a>
                <a class="menu-btn" v-bind:href="'/user?uid='+currentUser">My Friends</a>
                <a class="menu-btn" href="/post?recipeId=new">レシピ投稿</a>
                <a class="menu-btn" v-bind:href="'/UserRecipe?uid='+currentUser">みんなのご飯</a>
                <a class="menu-btn" v-on:click.prevent="SignOut" href="" id="sign-out">サインアウト</a>
            </nav>
        </div>
    </header>
</template>

<script>
    import firebase from 'firebase';
    const SignIn = 'SignIn';
    const SignUp = 'SignUp';
    
    export default {
        name: 'HeaderParts',
        data() {
            return { 
                currentStatus: SignIn ,
                buttonTitle: 'サインイン',
                currentUser: '',
                currentUserName: '',
            };
        },
        created() {
            this.GetUserId();
            return this.ChangeStatus_SignIn;
        },
        computed: {
            IS_SignIn: function(){
                return this.currentStatus === SignIn;
            },
            IS_SignUp: function(){
                return this.currentStatus === SignUp;
            }
        },
        methods: {
            ChangeStatus_SignIn: function(){
                this.currentStatus = SignIn;
                this.buttonTitle = 'サインイン';
            },
            ChangeStatus_SignUp: function(){
                this.currentStatus = SignUp;
                this.buttonTitle = '新規登録';
            },
            FormSubmit: function(e){
                e.prevent;
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                
                if(this.currentStatus === SignIn){
                    firebase.auth().signInWithEmailAndPassword(email,password)
                      .then(() => {
                        console.log('ユーザログインに成功');
                      })
                      .catch((error) => {
                        console.error('ユーザログインに失敗:', error);
                      }); 
                }else if(this.currentStatus === SignUp){
                    firebase.auth().createUserWithEmailAndPassword(email,password)
                      .then(() => {
                        console.log('ユーザ作成に成功');
                      })
                      .catch((error) => {
                        console.error('ユーザ作成に失敗:', error);
                      }); 
                }
            },
            GetUserId: function(){
                firebase.auth().onAuthStateChanged((user) => {
                    this.currentUser = user.uid;
                    
                    firebase
                    .database()
                    .ref('user')
                    .orderByChild('userid')
                    .equalTo(user.uid)
                    .on('child_added', (profSnapShot) => {
                        this.currentUserName = profSnapShot.val().username;
                        this.$emit('SendUserId', this.currentUser, this.currentUserName);
                    });
                });
            },
            SignOut: function(){
                firebase
                .auth()
                .signOut()
                .then(() => {
                    console.log('サインアウトに成功');
                    window.location.href = '/';
                })
                .catch((error) => {
                    console.error('サインアウトに失敗',error);
                });
            }
        }
    };
</script>

<style scoped src='./HeaderParts.css'>
</style>
