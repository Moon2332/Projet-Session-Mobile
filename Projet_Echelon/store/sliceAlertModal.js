import { createSlice } from "@reduxjs/toolkit";

const alertModalSlice = createSlice({
  name:"sliceAlertModal",
  initialState:{
    value: false,
  },
  reducers:{
    setValue:(state, action) => {
      state.value = action.payload;
    }
  }
})

export const { 
  setValue
} = alertModalSlice.actions;

export default alertModalSlice.reducer;