import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {endSetup, prepareEndSetup} from "../state/setup";
import {gameName, playerName, role, urlParams} from "../state/url";

export function Setup() {
  if (gameName === null) {
    urlParams.set("game", Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))
    window.location.search = urlParams.toString()
  }

  return (
    <div style={{
      margin: "100px auto",
      textAlign: "center",
      fontSize: 30
    }}>
      <div style={{margin: 50}}>
        <h2>Spiel-Link (zum teilen):</h2>
        <p style={{userSelect: 'all'}}>{window.location.toString().replace(/&.*/, "")}</p>
      </div>

      {playerName == null && role !== "board" ? <PlayerNameInput /> : <Lobby />}
    </div>
  )
}

function PlayerNameInput() {
  const [fieldValue, setFieldValue] = useState("")

  return (
    <form onSubmit={e => {
      urlParams.set("player", fieldValue)
      window.location.search = urlParams.toString()
      e.preventDefault()
    }}>
      <input type="text" onChange={e => setFieldValue(e.target.value)} value={fieldValue} placeholder={"name"}/>
      <br/>
      <input type="submit" value={"ONLINE SPIELEN"}/>
      <br/>
      <input type="button" value={"SPIELFELD"} onClick={() => {
        urlParams.set("role", "board")
        window.location.search = urlParams.toString()
        e.preventDefault()
      }}/>
      <input type="button" value={"HAND"} onClick={() => {
        urlParams.set("player", fieldValue)
        urlParams.set("role", "hand")
        window.location.search = urlParams.toString()
        e.preventDefault()
      }}/>
    </form>
  )
}

function Lobby() {
  const players = useSelector(state => state.players)
  const dispatch = useDispatch()

  return (
    <div>
      <h3>Im spiel:</h3>
      <ul style={{margin: 5}}>
        {players.map(p => <li key={p.name} style={{textDecoration: p.name === playerName ? "underline": "normal"}}>{p.name}</li>)}
      </ul>

      {<button
        onClick={() => {
          if (players.length > 1) {
            dispatch(prepareEndSetup({players}))
          }
        }}
        disabled={players.length < 2}
        style={{fontSize: 50, margin: 50}}
      >START</button>}
    </div>
  )
}
