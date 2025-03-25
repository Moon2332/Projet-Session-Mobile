import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name:"sliceNotification",
  initialState: {
    nb: 0
  },
  reducers:{
    incrementNotificationCount: (state) => {
      state.nb += 1;
    },
    resetNotificationCount: (state) => {
      state.nb = 0;
    },
  }
})

export const { 
  incrementNotificationCount, resetNotificationCount
} = notificationSlice.actions;

export default notificationSlice.reducer;