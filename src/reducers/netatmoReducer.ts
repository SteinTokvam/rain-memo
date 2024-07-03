const initialState = {
  stations: [],
  data: [],
};

export const netatmoReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case "SET_STATIONS":
      return {
        ...state,
        stations: action.payload.stations,
      };
    case "SET_DATA":
      return {
        ...state,
        data: action.payload.data,
      };
    case "ADD_TO_DATA":
      return {
        ...state,
        data: [...state.data, ...action.payload.data],
      };
    default:
      return state;
  }
};
