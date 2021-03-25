import { auth } from 'firebase'

export default function({ app, store, redirect, error }) {
    if (!store.state.user.currentUser) {
        if (
            app.getRouteBaseName() != 'signin' &&
            app.getRouteBaseName() != 'signup'
        )
            return redirect(app.localePath('signin'))
    }

    if (store.state.user.currentUser) {
        if (
            app.getRouteBaseName() == 'signin' ||
            app.getRouteBaseName() == 'signup'
        )
            return redirect(app.localePath('/cabinet/chat'))
    }
}
