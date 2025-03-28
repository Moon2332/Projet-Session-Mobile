import { configureStore } from '@reduxjs/toolkit'
import sliceNotification from './sliceNotification'

const store = configureStore({
  reducer: {
    notificationSlice: sliceNotification
  }
})

export default store