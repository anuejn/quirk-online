import {_} from "lodash";
import {colors, shapes} from "../components/Icon";
import {createSlice} from "@reduxjs/toolkit";
import {pieceDimension} from "../components/Piece";
import {internalDispatch, store} from "./index";
import {nextPlayer} from "./players";
import {gameAlmostEnded, isLegalBoard, isPossibleInOneMove, score} from "./game_logic";
import {playerName, role} from "./url";

export const handName = ({name}) => `hand-${name}`;

export const {reducer: piecesReducer, actions: {tighten, change, commit, lay, moveHand, takeBack, setActive}} = createSlice({
  name: 'pieces',
  initialState: _.range(colors.length * shapes.length * 3)
    .map((i) => ({
      color: i % colors.length,
      shape: Math.floor(i / colors.length) % shapes.length,
      location: "bag",
    }))
    .map((piece, i) => ({
      ...piece,
      uid: `color${piece.color}-shape${piece.shape}-no${Math.floor(
        i / (colors.length * shapes.length)
      )}`,
    })),
  reducers: {
    tighten(pieces, {payload}) {
      const {allowDuplicates, player} = payload;
      const handPieces = () => pieces.filter(p => p.location === handName(player));
      const bagPieces = pieces.filter(piece => piece.location === "bag");

      if (handPieces().length === 6 || bagPieces.length === 0) {
        return
      }

      let p;
      do {
        p = _.sample(bagPieces)
      } while (handPieces().some(cmp => cmp.color === p.color && cmp.shape === p.shape) && !allowDuplicates)


      const spacing = 10;
      if (handPieces().length === 0) {
        p.handPosition = {x: 0, y: -pieceDimension / 2}
      } else {
        const yList = handPieces().map(p => p.handPosition.y)
        const averageY = yList.reduce((a, b) => a + b) / yList.length
        const y = averageY < 0 ?
          Math.max(...yList) + pieceDimension + spacing :
          Math.min(...yList) - pieceDimension - spacing

        p.handPosition = {x: 0, y}
      }


      p.location = handName(player);
      p.player = player;
      p.moved = false;

      internalDispatch(tighten({player, allowDuplicates}))
    },

    change(pieces, {payload, wholeState}) {
      const {player} = payload;
      if (!wholeState.players.find(p => p.name === player.name).current) {
        return
      }

      pieces.forEach(p => {
        if(p.location === handName(player)) {
          p.location = "bag"
        }
      })

      internalDispatch(tighten({player, allowDuplicates: true}));
      internalDispatch(nextPlayer({points: 0}))
    },

    moveHand(pieces, {payload}) {
      const {piece, delta} = payload;
      const p = pieces.find(p => p.uid === piece.uid);

      p.handPosition.x += delta.x;
      p.handPosition.y += delta.y;
      p.moved = true;
    },

    setActive(pieces, {payload}) {
      const {piece} = payload;
      pieces.filter(p => p.location === handName({name: playerName})).forEach(p => p.active = false)
      const p = pieces.find(p => p.uid === piece.uid).active = true;
    },

    lay(pieces, {payload, wholeState}) {
      let {piece, boardPosition} = payload;

      if (!piece) {
        const player = role !== "board" ?
          (wholeState.players.find(p => p.name === playerName)) :
          (wholeState.players.find(p => p.current))
        piece = pieces.filter(p => p.location === handName(player)).find(p => p.active)
        if (!piece) {
          return;
        }
      }
      const p = pieces.find(p => p.uid === piece.uid);

      if (p.location !== handName(wholeState.players.find(p => p.current))) {
        return;
      }

      const newBoardPieces = [
        ...pieces.filter(p => p.location === "board" || p.location === "board-prelim"),
        {...piece, boardPosition, location: "board-prelim"}
      ]
      if (!(isLegalBoard(newBoardPieces) && isPossibleInOneMove(newBoardPieces))) {
        return;
      }

      p.boardPosition = boardPosition;
      p.location = "board-prelim";
    },

    takeBack(pieces, {payload, wholeState}) {
      const {piece} = payload;
      const p = pieces.find(p => p.uid === piece.uid);

      if (!(p.location === "board-prelim" && isLegalBoard(pieces.filter(p => p.uid !== p.uid)))) {
        return;
      }

      if (playerName !== wholeState.players.find(p => p.current).name && role !== "board") {
        return;
      }

      p.location = handName(piece.player);
    },

    commit(pieces, {payload, wholeState}) {
      const {player} = payload;
      if (!wholeState.players.find(p => p.name === player.name).current) {
        return
      }

      const points = score(pieces)
      pieces.forEach(p => {
        if(p.location === "board-prelim") {
          p.location = "board"
        }
      })
      const additionalPoints = (gameAlmostEnded(wholeState) ? 6 : 0)

      internalDispatch(nextPlayer({points: points + additionalPoints}))


      internalDispatch(tighten({player, allowDuplicates: true}))
    }
  }
})
