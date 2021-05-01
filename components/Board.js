import React from "react";
import _ from "lodash";
import {cartesian} from "../util";
import {LayedPiece, pieceDimension, PlaceholderPiece} from "./Piece";
import {lay, takeBack} from "../state/pieces";
import {boardBoundaries, isLegalBoard, isPossibleInOneMove, pieceAt, rows} from "../state/game_logic";

export class Board extends React.Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return JSON.stringify(nextProps) !== JSON.stringify(this.props)
  }

  render() {
    const {boardPieces, dispatch} = this.props;
    let {minX, maxX, minY, maxY} = boardBoundaries(boardPieces);

    // shift the board so that it seems to be stable
    const transformWrapperStuff = window.transformWrapperStuff;
    window.lastBoardSize = window.lastBoardSize || {minX: 0, minY: 0}
    if (window.lastBoardSize.minX !== minX || window.lastBoardSize.minY !== minY) {
      transformWrapperStuff.setPositionX(
        transformWrapperStuff.positionX +
        pieceDimension * (minX - window.lastBoardSize.minX) * transformWrapperStuff.scale,
        0
      );
      transformWrapperStuff.setPositionY(
        transformWrapperStuff.positionY +
        pieceDimension * (minY - window.lastBoardSize.minY) * transformWrapperStuff.scale,
        0
      );
      window.lastBoardSize = { minX, minY };
    }

    const renderAt = (x, y) => {
      const piece = pieceAt(boardPieces, x, y)
      if(piece) {
        if (piece.location === "board-prelim") {
          return (
            <LayedPiece
              piece={piece}
              key={x + "," + y}
              isNew={piece.location === "board-prelim"}
              onClick={() => {dispatch(takeBack({piece}))}}
            />
          );
        } else {
          return (
            <LayedPiece
              piece={piece}
              key={x + "," + y}
            />
          )
        }
      } else {
        return (
          <PlaceholderPiece
            key={x + "," + y}
            setPiece={piece => dispatch(lay({piece, boardPosition: {x, y}}))}
            outline={boardPieces.length === 0 && x === 0 && y === 0}
          />
        );
      }
    }

    rows(boardPieces)

    return (
      <div
        style={{
          width: (maxX - minX) * pieceDimension,
          height: (maxY - minY) * pieceDimension,
          lineHeight: 0,
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "column",
          transition: "0s all",
        }}
      >
        {cartesian(_.range(minX, maxX), _.range(minY, maxY)).map(([x, y]) =>
          renderAt(x, y)
        )}
      </div>
    );
  }
}