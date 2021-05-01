import _ from "lodash";
import {supportsPassive} from "react-dnd-touch-backend/lib/utils/supportsPassive";
import {handName} from "./pieces";

export const boardBoundaries = (boardPieces) => {
  if (boardPieces.length === 0) {
    return {minX: 0, maxX: 1, minY: 0, maxY: 1}
  }

  const minX = Math.min(...boardPieces.map((piece) => piece.boardPosition.x)) - 1;
  const maxX = Math.max(...boardPieces.map((piece) => piece.boardPosition.x)) + 2;

  const minY = Math.min(...boardPieces.map((piece) => piece.boardPosition.y)) - 1;
  const maxY = Math.max(...boardPieces.map((piece) => piece.boardPosition.y)) + 2;

  return {minX, maxX, minY, maxY}
}
export const pieceAt = (boardPieces, x, y) => {
  const candidates = boardPieces.filter((p) => p.boardPosition.x === x && p.boardPosition.y === y);
  if (candidates.length > 0) {
    return _.head(candidates);
  } else {
    return null;
  }
}
export const isLegalBoard = (boardPieces) => {
  if (boardPieces.length === 1) {
    return true;
  }

  const allRowsLegal = rows(boardPieces).every(isValidRow);
  const allHaveNeighbours = boardPieces.every(piece => hasNeighbour(boardPieces, piece))
  return allRowsLegal && allHaveNeighbours
}
export const rows = boardPieces => {
  const {minX, maxX, minY, maxY} = boardBoundaries(boardPieces);

  let rows = []

  _.range(minX, maxX).forEach(x => {
    let current_row = [];
    _.range(minY, maxY).forEach(y => {
      const p = pieceAt(boardPieces, x, y);
      if (p !== null) {
        current_row.push(p)
      } else if (current_row.length > 0) {
        rows.push(current_row);
        current_row = [];
      }
    })
  })

  _.range(minY, maxY).forEach(y => {
    let current_row = [];
    _.range(minX, maxX).forEach(x => {
      const p = pieceAt(boardPieces, x, y);
      if (p !== null) {
        current_row.push(p)
      } else if (current_row.length > 0) {
        rows.push(current_row);
        current_row = [];
      }
    })
  })

  return rows;
}
const isValidRow = row => {
  if (row.length === 1) {
    return true;
  }

  // check if the same piece is present twice in a row
  if (row.some(a => row.some(b => a.uid !== b.uid && a.color === b.color && a.shape === b.shape))) {
    return false;
  }

  if (row[0].color === row[1].color) {
    return !row.some(x => x.color !== row[0].color)
  } else if (row[0].shape === row[1].shape) {
    return !row.some(x => x.shape !== row[0].shape)
  }
}
const hasNeighbour = (boardPieces, piece) => {
  const {x, y} = piece.boardPosition;
  return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].some(([x, y]) => pieceAt(boardPieces, x, y) !== null)
}
export const isPossibleInOneMove = (boardPieces) => {
  return rows(boardPieces).some(row =>
    boardPieces.filter(p => p.location === "board-prelim").every(p =>
      row.some(cmp => cmp.uid === p.uid)
    )
  )
}
export const score = (pieces) => {
  const boardPieces = pieces.filter(p => p.location === "board" || p.location === "board-prelim")
  if (boardPieces.length === 1) {
    return 1
  }
  return rows(boardPieces).filter(r =>
    r.some(p => p.location === "board-prelim")).map(r =>
    r.length === 1 ? 0 : (r.length === 6 ? 12 : r.length
    )).reduce((a, b) => a + b, 0)
}

export const gameAlmostEnded = state => (
  !state.pieces.some(p => p.location === "bag") &&
  state.players.some(player => state.pieces.every(piece => piece.location !== handName(player)))
)