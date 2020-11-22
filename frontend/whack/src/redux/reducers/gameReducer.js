import { INCREASE_POINTS, RESET_POINTS, DECREASE_POINTS } from '../actionTypes';

const initialState = {
    score: 0
}

const gameReducer = (state = initialState, action) => {
    switch(action.type) {
        case INCREASE_POINTS:
            return {
                ...state,
                score: state.score + 1
            }
        case RESET_POINTS:
            return {
                ...state,
                score: 0
            }
        case DECREASE_POINTS:
            return {
                ...state,
                score: state.score >= 2 ? state.score - 2 : state.score
            }
        default: return state
    }
}

export default gameReducer;