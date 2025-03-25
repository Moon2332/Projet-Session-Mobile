import { createSlice } from "@reduxjs/toolkit";

const alertModalSlice = createSlice({
  name:"sliceAlertModal",
  initialState:{
    value: false,
  },
  reducers:{
    showAlert:(state) => {
      state.value = true
    }, 
    hideAlert:(state) => {
      state.value = false
    } 
  }
})

export const { 
  showAlert, hideAlert
} = alertModalSlice.actions;

export default alertModalSlice.reducer;