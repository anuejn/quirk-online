import {usePreview} from "react-dnd-preview";
import {LayedPiece} from "./Piece";
import React from "react";
import {DndProvider} from "react-dnd";
import {TouchBackend} from "react-dnd-touch-backend";
import {StateIndicator} from "./StateIndicator";
import SplitterLayout from "react-splitter-layout";
import {TransformComponent, TransformWrapper} from "react-zoom-pan-pinch";
import {Board} from "./Board";
import {Hand} from "./Hand";
import {useDispatch, useSelector} from "react-redux";
import {PointsTable} from "./PointsTable";
import {role} from "../state/url";



export function Game() {
  return (
    <DndProvider backend={TouchBackend} options={{enableMouseEvents: true}}>
      <DnDPreview/>

      <MainGame />

    </DndProvider>
  )
}

export function MainGame() {
  if (role === "board") {
    return <BoardFragment />
  } else if (role === "hand") {
    return <HandFragment />
  } else {
    return (
      <SplitterLayout vertical={false} secondaryInitialSize={300}>
        <BoardFragment />
        <HandFragment/>
      </SplitterLayout>
    )
  }
}

function HandFragment() {
  return (
    <>
      <StateIndicator/>
      <Hand />
    </>
  )
}

function BoardFragment() {
  const boardPieces = useSelector(state => state.pieces.filter(piece => piece.location === "board" || piece.location === "board-prelim"))
  const dispatch = useDispatch()

  return (
    <div style={{position: "absolute", height: "100%", width: "100%"}}>

      <PointsTable/>

      <TransformWrapper options={{centerContent: true, minScale: 0.25, limitToBounds: false, velocity: false}} wheel={{wheelEnabled: true, touchPadEnabled: true, limitsOnWheel: false, step: 3}} doubleClick={false}>
        {(transformWrapperStuff) => {
          window.transformWrapperStuff = transformWrapperStuff;
          return <TransformComponent>
            <Board boardPieces={boardPieces} dispatch={dispatch}/>
          </TransformComponent>
        }}
      </TransformWrapper>
    </div>
  )
}


function DnDPreview() {
  const {display, item, style} = usePreview();
  if (!display) {
    return null;
  }
  return <LayedPiece style={style} piece={item}/>;
}

