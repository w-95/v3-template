import 'vue-router'

declare module 'vue-router' {
    interface RouteMeta {
        isAdmin?: boolean
        requireAuth: boolean
        transition?: string,
        keepAlive?: boolean
        title?: string
    }
}