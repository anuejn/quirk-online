import {addPlayer} from "./players";
import {internalDispatch} from "./index";

export const urlParams = new URLSearchParams(window.location.search);
export const playerName = urlParams.get("player");
export const gameName = urlParams.get("game");
export const role = urlParams.get("role");


internalDispatch(addPlayer({name: playerName}))
