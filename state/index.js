import {configureStore} from "@reduxjs/toolkit";
import {piecesReducer} from "./pieces";
import {addPlayer, playersReducer} from "./players";
import {setupReducer} from "./setup";
import {firebaseReducerEnhancer, ref} from "./firebase";
import {playerName} from "./url";


function mainReducer(prevState, action) {
  const reducerMap = {
    pieces: piecesReducer,
    players: playersReducer,
    setup: setupReducer
  }
  return Object.fromEntries(Object.keys(reducerMap).map(key =>
    [key, reducerMap[key](prevState ? prevState[key] : undefined, {...action, wholeState: prevState})]
  ));
}

export const store = configureStore({
  reducer: firebaseReducerEnhancer(mainReducer),
});
window.store = store;

export function internalDispatch(action) {
  setTimeout(() => {
    store.dispatch(action);
  }, 0)
}
