import {createSlice} from "@reduxjs/toolkit";
import {internalDispatch} from "./index";
import {tighten} from "./pieces";
import {defineOrder} from "./players";

export const {reducer: setupReducer, actions: {prepareEndSetup, endSetup}} = createSlice({
  name: 'setup',
  initialState: true,
  reducers: {
    prepareEndSetup(setup, {payload, wholeState}) {
      const {players} = wholeState;

      players.forEach(player => {
        internalDispatch(tighten({player, allowDuplicates: false}))
      })

      internalDispatch(defineOrder())

      return true
    },

    endSetup(setup, {payload}) {
      return false
    }
  }
})
