<template>
    <div>
        <section id=RecipeNote class="view">
            <Header v-on:SendUserId="ReciveUserId"></Header>
        </section>
        <form id="form-body">
            <div class="tag">
                <div class="prof-title">
                    <p class="ribbon">プロフィール登録</p>
                </div>
            </div>
            <div id="prof-wrapper">
                <div id="prof-head">
                    <h4>まずはプロフィールを登録しよう！</h4>
                </div>
                <div class="prof-info-wrapper">
                    <div class="prof-info-contents">
                        <p>ニックネーム</p>
                        <h4><input type="text" id="user-nickname" v-bind:value="userName" placeholder="ニックネーム"></h4>
                    </div>
                </div>
                <div class="prof-info-wrapper">
                    <div class="prof-info-contents">
                        <p>プロフィール画像</p>
                        <input type="file" id="prof-image">
                    </div>
                </div>
                <div class="prof-info-wrapper">
                    <div class="prof-info-contents">
                        <p>一言コメント</p>
                        <textarea id="comment-form" v-bind:value="userComment" placeholder="プロフィール用の一言コメントを登録しよう！"></textarea>
                    </div>
                </div>
            </div>
            <div id="submit-button">
                <button type="submit" class="btn btn-secondary btn-block submit-button" v-on:click.prevent="UpdateProf">登録する</button>
            </div>
        </form>
    </div>
</template>

<script>
    import firebase from 'firebase';
    import Header from '../Header/HeaderParts.vue';
    
    export default {
        name: 'ProfPage',
        components: {
            Header,
        },
        data(){
            return {
                userName: '',
                userComment: '',
                userImage: '',
                currentUser: '',
                profId: '',
            };
        },
        created(){
            this.GetUserInfo();
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
            GetUserInfo: function(){
                this.currentUser = this.GetParams('uid');
                firebase
                .database()
                .ref('user')
                .orderByChild('userid')
                .equalTo(this.currentUser)
                .on('child_added', (profSnapShot) => {
                    this.profId = profSnapShot.key;
                    this.userName = profSnapShot.val().username;
                    this.userComment = profSnapShot.val().usercomment;
                    this.userImage = profSnapShot.val().image;
                });
            },
            UpdateProf: function(){
                console.log(document.getElementById('user-nickname').value);
                const profData = {
                    username: document.getElementById('user-nickname').value,
                    usercomment: document.getElementById('comment-form').value,
                };
                let file;
                
                if(document.getElementById('prof-image').files[0] !== undefined){
                    file = document.getElementById('prof-image').files[0];
                    profData.image = document.getElementById('prof-image').files[0].name;
                    firebase
                    .storage()
                    .ref(`prof-images/${profData.image}`)
                    .put(file)
                    .then(() => {
                        firebase.database().ref(`user/${this.profId}`).update(profData).then(() => {
                            window.location.href = `/top?uid=${this.currentUser}`;
                        });
                    });
                }else{
                    profData.image = this.userImage;
                    console.log(profData);
                    firebase.database().ref(`user/${this.profId}`).update(profData).then(() => {
                        window.location.href = `/top?uid=${this.currentUser}`;
                    });
                }
            }
        },
    }
</script>

<style scoped src="./Prof.css">
    
</style>