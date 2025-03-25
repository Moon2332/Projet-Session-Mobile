import { configureStore } from '@reduxjs/toolkit'
// import sliceAlertModal from './sliceAlertModal'
import sliceNotification from './sliceNotification'

const store = configureStore({
  reducer: {
    // alertModalSlice: sliceAlertModal,
    notificationSlice: sliceNotification
  }
})

export default store