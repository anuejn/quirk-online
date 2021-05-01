import {useDispatch, useSelector} from "react-redux";
import {FaCheck, FaRecycle, FaClock, FaSmile, FaFrown} from "react-icons/fa";
import {change, commit} from "../state/pieces";
import React from "react";
import {gameAlmostEnded, score} from "../state/game_logic";
import {playerName} from "../state/url";

export function StateIndicator() {
  const currentPlayer = useSelector(state => state.players.find(p => p.current))
  const myPlayer = useSelector(state => state.players.find(p => p.name === playerName))
  const players = useSelector(state => state.players)
  const boardPieces = useSelector(state => state.pieces.filter(piece => piece.location === "board" || piece.location === "board-prelim"))
  const prelimPieces = boardPieces.filter(p => p.location === "board-prelim")
  const dispatch = useDispatch()
  const gameEnded = useSelector(state => gameAlmostEnded(state))

  if (gameEnded && !boardPieces.some(p => p.location === "board-prelim")) {
    const playerPoints = p => p.points.reduce((a, b) => a + b, 0)
    const maxPoints = Math.max(...players.map(playerPoints))
    const win = playerPoints(myPlayer) === maxPoints
    return <StateIndicatorLower onClick={() => {}} Icon={win ? FaSmile : FaFrown} text={win ? "gewonnen" : "verloren"}/>
  }

  if(playerName !== currentPlayer.name) {
    return <StateIndicatorLower onClick={() => {}} Icon={FaClock}/>
  }


  if (prelimPieces.length > 0) {
    return <StateIndicatorLower onClick={() => dispatch(commit({player: currentPlayer}))} Icon={FaCheck} text={"+" + score(boardPieces)}/>
  } else {
    return <StateIndicatorLower onClick={() => {dispatch(change({player: currentPlayer}))}} Icon={FaRecycle} text={"tauschen"}/>
  }
}

function StateIndicatorLower({onClick, Icon, text}) {
  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      right: 0,
      zIndex: 10,
      margin: 30,
      marginBottom: 5,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}
    >
      <Icon
      style={{
        width: 60,
        height: 60,
        padding: 15,
        margin:5,
        background: "lightgray",
        borderRadius: 5,
        display: "block",
      }}
       onClick={onClick}
      />
      {text}
      <BagPiecesCounter />
    </div>
  )
}

export function BagPiecesCounter() {
  const bagPieces = useSelector(state => state.pieces.filter(p => p.location === "bag").length)

  return <div style={{marginTop: 15}}>{bagPieces} im <br/>Beutel</div>
}