import { configureStore } from '@reduxjs/toolkit'
import sliceAlertModal from './sliceAlertModal'

const store = configureStore({
  reducer: {
    alertModalSlice: sliceAlertModal,
  }
})

export default store