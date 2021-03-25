<template>
    <div>
        <div class="form-container">
            <div class="row p-0 m-0">
                <div class="form-identity col-12">
                    <h1 class="logo">ITMO Chat</h1>
                    <div class="flex items-center justify-around">
                        <b-button
                            class="form-input"
                            @click="identityWith(_loginWithGoogle)"
                            >Google</b-button
                        >
                        <b-button
                            class="form-input"
                            @click="identityWith(_loginWithFacebook)"
                            >Facebook</b-button
                        >
                        <b-button
                            class="form-input"
                            @click="identityWith(_loginWithGithub)"
                            >Github</b-button
                        >
                        <b-button
                            class="form-input"
                            @click="identityWith(_loginWithMicrosoft)"
                            >Microsoft</b-button
                        >
                    </div>

                    <div class="divider">
                        <div class="line"></div>
                        <div class="text">OR</div>
                        <div class="line"></div>
                    </div>

                    <b-form-input
                        class="form-input"
                        v-model="email"
                        placeholder="Email"
                    ></b-form-input>

                    <b-form-input
                        class="form-input"
                        v-model="password"
                        placeholder="Password"
                    ></b-form-input>

                    <div
                        v-if="error != null"
                        class="ui error message form-input"
                    >
                        <div class="header">Error</div>
                        <span>{{ error }}</span>
                    </div>

                    <b-button
                        class="form-input"
                        v-show="state != 'success'"
                        @click.prevent="
                            loginWith(loginUser, {
                                login: email,
                                password: password
                            })
                        "
                        >Log in</b-button
                    >
                    <div class="text-muted form-input">Forget password</div>

                    <div
                        v-if="state == 'success'"
                        class="ui success message form-input"
                    >
                        <div class="header">Success</div>
                        <span>You will be redirected to your account</span>
                    </div>
                </div>

                <!-- for signin -->
                <template v-if="type == 'signin'">
                    <div
                        class="form-signup form-have-account col-12 text-center"
                    >
                        Do not have an account?
                        <nuxt-link
                            tag="span"
                            :to="localePath('signup')"
                            class="registration-text pl-2"
                        >
                            Registration</nuxt-link
                        >
                    </div>
                </template>

                <!-- for signup -->
                <template v-if="type == 'signup'">
                    <div
                        class="form-signup form-have-account col-12 text-center"
                    >
                        Do you have an account?
                        <nuxt-link
                            tag="span"
                            :to="localePath('signin')"
                            class="registration-text pl-2"
                        >
                            Login</nuxt-link
                        >
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { userMixin } from '~/vuex-mixins/user'
export default {
    mixins: [userMixin],
    props: {
        type: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            email: null,
            password: null,
            error: null,
            state: null
        }
    },
    methods: {
        identityWith(func, args) {
            this.state = 'loading'
            switch (this.type) {
                case 'signin':
                    this.signinWith(func, args)
                    break
                case 'signup':
                    this.signupWith(func, args)
                    break
            }
        },
        signinWith(func, args) {
            func(args)
                .then(() => {
                    this.state = 'success'
                    this.$nuxt.$router.push(this.localePath('index'))
                })
                .catch(error => {
                    this.error = error.message
                    this.state = 'error'
                })
        },
        signupWith(func, args) {
            func(args)
                .then(result => {
                    this.state = 'success'

                    let cred = null
                    if (args) {
                        cred = new PasswordCredential({
                            id: args.login,
                            name: args.name,
                            password: args.password
                        })
                    }
                    this.$nuxt.$router.push(this.localePath('index'))
                })
                .catch(error => {
                    this.error = error.message
                    this.state = 'error'
                })
        }
    },
    mounted() {
        if (window.PasswordCredential || window.FederatedCredential) {
            navigator.credentials
                .get({
                    password: true
                })
                .then(credential => {
                    if (credential) {
                        switch (credential.type) {
                            case 'password':
                                this._loginWith(this.loginUser, {
                                    login: credential.id,
                                    password: credential.password
                                })
                                break
                        }
                    }
                })
        }
    },
    watch: {
        currentUser() {
            if (this.checkCurrentUser()) {
                this.$nuxt.$router.push(this.localePath('/cabinet/chat'))
            }
        }
    }
}
</script>

<style lang="less" scoped>
.form-container {
    color: #262626;
    -webkit-justify-content: center;
    justify-content: center;
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    height: 100vh;
    align-items: center;
}

.form-identity {
    -webkit-align-items: center;
    align-items: center;
    background-color: #fff;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid #dbdbdb;
    border-radius: 1px;
    margin: 0 0 10px;
    padding: 10px 0;
}

.logo {
    font-size: 2rem;
    font-weight: bold;
    margin: 22px auto 12px;
    background-repeat: no-repeat;
    background-position: 0 -130px;
    height: 75px;
    width: 175px;
    text-align: center;
}

.divider {
    display: flex;
    flex-direction: row;
    margin: 10px 40px 18px;
    .line {
        width: 30%;
        background-color: #dbdbdb;
        height: 1px;
        position: relative;
        top: 0.45em;
    }
    .text {
        width: 40%;
        color: #8e8e8e;
        font-size: 13px;
        font-weight: 600;
        line-height: 15px;
        margin: 0 18px;
        text-transform: uppercase;
        text-align: center;
    }
}

.form-input {
    margin: 0 40px 6px;
    width: calc(100% - 80px);
    text-align: center;
}

.form-have-account {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 130px;
}

.registration-text {
    text-decoration: underline;
    cursor: pointer;
}
</style>
