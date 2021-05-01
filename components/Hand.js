import React, {useState} from "react";
import {DraggablePiece, pieceDimension} from "./Piece";
import { useDrop } from "react-dnd";
import { useSelector, useDispatch } from 'react-redux'
import {handName, moveHand, setActive} from "../state/pieces";
import useDimensions from "react-use-dimensions";
import {playerName} from "../state/url";

export function Hand() {
  const handPieces = useSelector(state => state.pieces.filter(piece => piece.location === handName({name: playerName})))
  const dispatch = useDispatch()

  const [sizeRef, { width, height }] = useDimensions();

  const [, dropRef] = useDrop({
    accept: "all",
    drop: (piece, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      dispatch(moveHand({piece, delta}))
    },
  });

  const style = {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    zIndex: 1,
  }

  const [offset, setOffset] = useState({x: 0, y: 0, startX: 0, startY: 0})
  const down = e => {
    console.log(e.target)
    if (e.target.id !== "pan") {
      return
    }
    if(e.buttons) {
      setOffset({...offset, startX: e.pageX - offset.x, startY: e.pageY - offset.y})
    } else if (e.touches) {
      setOffset({...offset, startX: e.touches[0].pageX - offset.x, startY: e.touches[0].pageY - offset.y})
    }
  }
  const move = e => {
    console.log(e.target)
    if (e.target.id !== "pan") {
      return
    }
    if(e.buttons) {
      setOffset({...offset, x: e.pageX - offset.startX, y: e.pageY - offset.startY})
    } else if (e.touches) {
      setOffset({...offset, x: e.touches[0].pageX - offset.startX, y: e.touches[0].pageY - offset.startY})
    }
  }

  return (
    <div style={style} ref={sizeRef}>
      <div ref={dropRef} style={style} /*onMouseDown={down} onMouseMove={move} onTouchStart={down} onTouchMove={move} id={"pan"}*/>
        <div style={{position: "relative"}}>
          {handPieces.map((piece, i) => height && width ?
            <DraggablePiece
              key={i}
              piece={piece}
              onClick={() => dispatch(setActive({piece}))}
              style={{
                top: piece.handPosition.y + (height / 2) - (pieceDimension / 2) + offset.y,
                left: piece.handPosition.x + (width / 2) - (pieceDimension / 2) + offset.x,
                zIndex: 10,
                position: "absolute"
            }}/> : <div key={i} />)}
        </div>
      </div>
    </div>
  );
}
