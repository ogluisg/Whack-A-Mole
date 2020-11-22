let baseURL = 'http://localhost:3000/api'

baseURL = 'https://whack-backend.herokuapp.com/api'

export default {
    API: {
        ENDPOINTS: {
            LOGIN: `${baseURL}/login`,
            SIGNUP: `${baseURL}/signup`,
            SCOREBOARD: `${baseURL}/scoreboard`,
            SCORE: `${baseURL}/score`,
        }
    }
}