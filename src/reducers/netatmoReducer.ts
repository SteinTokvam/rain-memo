const initialState = {
    stations: []
}

export const netatmoReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'SET_STATIONS':
            return {
                ...state,
                stations: action.payload.stations
            }
        default:
            return state
    }
}