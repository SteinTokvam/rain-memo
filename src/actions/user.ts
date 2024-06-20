export const setSession = (session: any) => ({
  type: "SET_SESSION",
  payload: {
    session,
  },
});
