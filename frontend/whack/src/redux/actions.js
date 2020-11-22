import { INCREASE_POINTS, RESET_POINTS, DECREASE_POINTS} from './actionTypes'

export const addPoint = () => {
    return {
        type: INCREASE_POINTS
    }
}

export const resetPoints = () => {
    return {
        type: RESET_POINTS
    }
}

export const decreasePoints = () => {
    return {
        type: DECREASE_POINTS
    }
}