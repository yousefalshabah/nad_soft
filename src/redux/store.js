import { configureStore } from "@reduxjs/toolkit";
import videoReducer from "./video";
export const store = configureStore({
  reducer: { video: videoReducer },
});
