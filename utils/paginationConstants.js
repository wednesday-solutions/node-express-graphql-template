export default {
    routes: {
        include: [],
        exclude: ['*']
    },
    query: {
        pagination: {
            name: 'pagination',
            default: true
        },
        limit: {
            name: 'limit',
            default: 10
        },
        page: {
            name: 'page',
            default: 1
        }
    },
    meta: {
        limit: {
            active: true
        },
        page: {
            active: true
        },
        pageCount: {
            active: false
        },
        totalCount: {
            active: true
        },
        previous: {
            active: false
        },
        next: {
            active: false
        },
        last: {
            active: false
        },
        first: {
            active: false
        },
        self: {
            active: false
        },
        count: {
            active: false
        }
    }
};
