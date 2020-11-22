export default {
    api: {
        endpoints : {
            main : {
                test: { auth: false, method: 'get', path: '/test'},
                user: { auth: true, method: 'get', path: '/id/details'},
                signup: { auth: false, method: 'post', path: '/signup' },
                login: { auth: false, method: 'post', path: '/login'},
                scoreboard: { auth: true, method: 'get', path: '/scoreboard'},
                updateScore: { auth: true, method: 'post', path: '/score'},
                getUserTopScore: { auth: true, method: 'get', path: '/score'},
                verify: { auth: true, method: 'get', path: '/verify/:userId/:code'}
            }
        }
    },
    keys: {
        crypto: {
            auth: 'crypto-key'
        }
    },
    nodeMailer: {
        user: 'whack_end01@yahoo.com',
        password: 'bjldqcdtuzmvwexn'
    }
}