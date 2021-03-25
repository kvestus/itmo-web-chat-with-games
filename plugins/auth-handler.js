export default async context => {
    //console.log(context, 'context')
    //console.log(context.app, 'app')
    context.app.$fire.auth.onAuthStateChanged(async function(user) {
        if (user) {
            // User is signed in.
            await context.store.dispatch('user/authUser', user)
            //context.app.$axios.get('/service/AssociateUser')
            //   var displayName = user.displayName
            //   var email = user.email
            //   var emailVerified = user.emailVerified
            //   var photoURL = user.photoURL
            //   var isAnonymous = user.isAnonymous
            //   var uid = user.uid
            //   var providerData = user.providerData
            // ...
        } else {
            // User is signed out.
            await context.store.dispatch('user/logoutUser')
        }
    })
}
