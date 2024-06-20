import { combineReducers } from "@reduxjs/toolkit";
import { netatmoReducer } from "./netatmoReducer";
import { userReducer } from "./userReducer";

const rootReducer = combineReducers({
    netatmo: netatmoReducer,
    user: userReducer
});

export default rootReducer;