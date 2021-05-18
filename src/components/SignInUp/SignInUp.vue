<template>
    <div>
        <header>
            <div id="header">
                <a href="/"><img src="../../assets/logo_RecipeNotes.png" alt="RecipeNote" id="logo"></a>
                <nav class="page-menu">
                    <a class="menu-btn" href="" v-on:click.prevent="ChangeStatus_SignIn">Sign In</a>
                    <a class="menu-btn" href="" v-on:click.prevent="ChangeStatus_SignUp">新規登録</a>
                </nav>
            </div>
        </header>
        <div class="main">
            <div class="sign-in-wrapper">
              <section id="login" class="view">
                <div class="container">
                  <div class="row justify-content-center">
                    <div class="col-sm-10 col-md-8 col-lg-6">
                      <form id="login-form" v-on:submit.prevent="FormSubmit">
                        <h3 v-show="IS_SignIn">ユーザーログイン</h3>
                        <h3 v-show="IS_SignUp">ユーザー新規登録</h3>
                        <div class="form-group login__email">
                          <label for="login-email" class="col-form-label">
                            メールアドレス
                          </label>
                          <div>
                            <input id="login-email" type="email" class="form-control" required>
                          </div>
                        </div>
                        <div class="form-group login__password">
                          <label for="login-password" class="col-form-label">
                            パスワード
                          </label>
                          <div>
                            <input id="login-password" type="password" class="form-control" required>
                          </div>
                        </div>
                        <div class="form-group login__submit">
                          <div>
                            <button 
                                id="login__submit-button" 
                                type="submit" 
                                class="btn btn-success"
                                v-bind:class="{'SignInBtn': 'IS_SignIn', 'SignUpBtn': 'IS_SignUp'}">
                                  {{ buttonTitle }}
                            </button>
                            <p>test@gmail.com / testuser</p>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </section>  
            </div>
        </div>
    </div>


</template>

<script>
    import firebase from 'firebase';
    const SignIn = 'SignIn';
    const SignUp = 'SignUp';
    
    export default {
        name: 'HeaderParts',
        data() {
            return { currentStatus: SignIn , buttonTitle: 'サインイン'};
        },
        created() {
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
                        let user = firebase.auth().currentUser;
                        window.location.href = `/top?uid=${user.uid}`;
                      })
                      .catch((error) => {
                        console.error('ユーザログインに失敗:', error);
                      }); 
                }else if(this.currentStatus === SignUp){
                    firebase.auth().createUserWithEmailAndPassword(email,password)
                      .then(() => {
                        console.log('ユーザ作成に成功');
                        let user = firebase.auth().currentUser;
                        window.location.href = `/top?uid=${user.uid}`;
                      })
                      .catch((error) => {
                        console.error('ユーザ作成に失敗:', error);
                      }); 
                }
            }
        }
    };
</script>

<style scoped src='./SignInUp.css'>
</style>
