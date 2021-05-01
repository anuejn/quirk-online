import {createSlice} from "@reduxjs/toolkit";
import {internalDispatch} from "./index";
import {endSetup} from "./setup";
import {handName} from "./pieces";
import _ from "lodash";

export const {reducer: playersReducer, actions: {addPlayer, defineOrder, nextPlayer}} = createSlice({
  name: 'players',
  initialState: [],
  reducers: {
    addPlayer(players, {payload, wholeState}) {
      const {name} = payload
      if (players.findIndex(p => p.name === name) === -1 && wholeState.setup && name) {
        players.push({name, points: []})
      }
    },

    defineOrder(players, {payload, wholeState}) {
      const playerPieces = player => wholeState.pieces.filter(piece => piece.location === handName(player))
      if (players.some(player => playerPieces(player).length < 6)) {
        internalDispatch(defineOrder())
        return
      }

      const nMatchingPieces = piecesList => Math.max(..._.flatten([true, false].map(checkColor =>
        piecesList
          .map(basePiece =>
            piecesList
              .map(p => checkColor ? p.color === basePiece.color : p.shape === basePiece.shape)
              .reduce((a, b) => a + b, 0)
          )
      )))
      const maxPieces = Math.max(...players.map(p => nMatchingPieces(playerPieces(p))))
      const maxPiecesPlayers = players.filter(p => nMatchingPieces(playerPieces(p)) === maxPieces)
      const firstPlayer = _.sample(maxPiecesPlayers);
      firstPlayer.nth = 0;
      firstPlayer.current = true;

      const unassignedPlayers = players => players.filter(p => p.nth === undefined)
      for (let i = 1; unassignedPlayers(players).length > 0; i++) {
        const p = _.sample(unassignedPlayers(players))
        p.nth = i;
        p.current = false;
      }

      internalDispatch(endSetup())
    },

    nextPlayer(players, {payload}) {
      const {points} = payload;

      const maxPlayer = Math.max(...players.map(p => p.nth))
      const current = players.find(p => p.current).nth
      players.filter(p => p.nth === (current + 1) % (maxPlayer + 1))
        .forEach(p => p.current = true)
      players.filter(p => p.nth === current)
        .forEach(p => {
          p.current = false;
          p.points.push(points)
        })
    }
  }
})
