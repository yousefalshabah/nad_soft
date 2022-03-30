import { createSlice } from "@reduxjs/toolkit";

export const videoSlice = createSlice({
  name: "counter",
  initialState: {
    play: false,
    videoUrl: "",
  },
  reducers: {
    start: (state) => {
      state.play = true;
    },
    stop: (state) => {
      state.play = false;
    },
    save: (state, action) => {
      state.videoUrl = action.payload;
    },
  },
});

export const { start, stop, save, recordAgain } = videoSlice.actions;
export default videoSlice.reducer;
