export const setStations = (stations: any) => ({
  type: "SET_STATIONS",
  payload: {
    stations,
  },
});

export const setData = (data: any[]) => ({
  type: "SET_DATA",
  payload: {
    data,
  },
});

export const addToData = (data: any[]) => ({
  type: "ADD_TO_DATA",
  payload: {
    data,
  },
});
