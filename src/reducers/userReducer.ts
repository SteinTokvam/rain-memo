

export const userReducer = (state = {}, action: any) => {
    switch (action.type) {
        case 'SET_SESSION':
            return {
                ...state,
                session: action.payload.session
            }
        default:
            return state
    }
}