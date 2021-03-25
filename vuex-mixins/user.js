import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

export const userMixin = {
    computed: {
        ...mapState({}),
        ...mapGetters({
            _userToken: 'user/getUserToken',
            currentUser: 'user/getCurrentUser'
        }),
        currentUserUid() {
            if (!this.checkCurrentUser()) return 0
            return this.currentUser.uid
        },
        currentUserLogin() {
            if (!this.checkCurrentUser()) return '@'
            return this.currentUser.email.split('@')[0]
        },
        currentUserFullName() {
            if (!this.checkCurrentUser()) return ''
            if (
                this.currentUserFirstName + ' ' + this.currentUserLastName ==
                ' '
            )
                return this.currentUserLogin
            else
                return (
                    this.currentUserFirstName + ' ' + this.currentUserLastName
                )
        },
        currentUserFirstName() {
            if (!this.checkCurrentUser()) return ''
            return this.currentUser.firstName == undefined
                ? ''
                : this.currentUser.firstName
        },
        currentUserLastName() {
            if (!this.checkCurrentUser()) return ''
            return this.currentUser.lastName == undefined
                ? ''
                : this.currentUser.lastName
        },
        currentUserInitials() {
            if (this.currentUserFullName.length <= 2)
                return this.currentUserFullName
            else return this.currentUserFullName.slice(0, 2)
        }
    },
    methods: {
        checkCurrentUser() {
            return this.currentUser != undefined && this.currentUser != null
        },
        ...mapActions({
            _loginUser: 'user/loginUser',
            _loginWithGoogle: 'user/loginWithGoogle',
            _loginWithFacebook: 'user/loginWithFacebook',
            _loginWithGithub: 'user/loginWithGithub',
            _loginWithMicrosoft: 'user/loginWithMicrosoft',
            _loginPopup: 'user/loginPopup',
            _createUser: 'user/createUser',
            _authUser: 'user/authUser',
            _logoutUser: 'user/logoutUser',
            _updateUser: 'user/updateUser',
            _updateCurrentUserData: 'user/updateCurrentUserData'
        })
    }
}
