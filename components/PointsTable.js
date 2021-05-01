import {useSelector} from "react-redux";
import React from "react";
import _ from "lodash"

export function PointsTable() {
  const players = useSelector(state => state.players)
  const sortedPlayers = [...players].sort((a, b) => a.nth - b.nth)

  const maxPointsLength = Math.max(...players.map(p => p.points.length))

  return (
    <table
      style={{
        position: "fixed",
        margin: 20,
        textAlign: "center",
      }}
    >
      <thead>
        <tr>
          {sortedPlayers.map(p => <td key={p.name} style={{fontWeight: p.current ? "bold": "normal", padding: 10}}>{p.name}</td>)}
        </tr>
      </thead>
      <tbody>
        {_.range(0, maxPointsLength + (players.find(p => p.current).nth === 0)).map(i => (
          <tr key={i}>
            {sortedPlayers.map(p => <td key={p.name} style={{height: 18, paddingBottom: i === maxPointsLength - 1 ? 10 : 0}}>
              {p.points[i] === undefined ? "" : p.points[i] === 0 ? "-" : "+" + p.points[i]}
            </td>)}
          </tr>
        ))}

        <tr style={{borderTop: "3px double black"}}>
          {sortedPlayers.map(p => <td key={p.name}>{p.points.reduce((a, b) => a + b, 0)}</td>)}
        </tr>
      </tbody>
    </table>
  )
}