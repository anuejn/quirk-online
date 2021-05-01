import * as firebase from "firebase/app";
import "firebase/database";
import {gameName} from "./url";
import {internalDispatch} from "./index";
import {firebaseConfig} from "./firebase_config";


firebase.initializeApp(firebaseConfig);
const database = firebase.database()
export const ref = database.ref(gameName || "lobby")

export function firebaseReducerEnhancer(realReducer) {
  return (prevState, action) => {
    let toReturn;
    if (action.type === "firebase_update") {
      toReturn = JSON.parse(action.payload);
    } else {
      ref.transaction(prevFirebaseState => {
        toReturn = realReducer(JSON.parse(prevFirebaseState), action)
        return JSON.stringify(toReturn)
      })
    }

    if (toReturn) {
      return toReturn
    } else {
      return realReducer(prevState, action)
    }
  }
}
ref.on('value', a => internalDispatch({type: "firebase_update", payload: a.val()}))