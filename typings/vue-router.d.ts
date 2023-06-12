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

    interface RouteLocationNormalizedLoaded {
        query: {
            productId?: string,
            statusId?: number, 
            locationId?: number, 
            defalutTab?: 1 | 2 | 3 | 4
        };
      }
}