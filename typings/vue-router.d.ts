import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        isAdmin?: boolean
        requireAuth: boolean
        transition?: string,
        transitionOut?: string,
        keepAlive?: boolean,
        title?: string,
        mode?: 'default' | 'out-in' | 'in-out'
    }
}