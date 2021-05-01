import fs from "fs";
import React from "react";

const icons = {
  circle: fs.readFileSync(__dirname + "/../icons/circle.svg", "utf-8"),
  romp: fs.readFileSync(__dirname + "/../icons/romp.svg", "utf-8"),
  sharp: fs.readFileSync(__dirname + "/../icons/sharp.svg", "utf-8"),
  square: fs.readFileSync(__dirname + "/../icons/square.svg", "utf-8"),
  star: fs.readFileSync(__dirname + "/../icons/star.svg", "utf-8"),
  star2: fs.readFileSync(__dirname + "/../icons/star2.svg", "utf-8"),
};

export const shapes = Object.keys(icons);

/*
export const colors = [
  "#EF476F",
  "#F78C6B",
  "#FFD166",
  "#06D6A0",
  "#118AB2",
  "#F7FFF7",
];
*/
/*export const colors = [
  "#427ff0",
  "#da44cd",
  "#ff5c5c",
  "#F88B25",
  "#F9C807",
  "#99D336",
];*/

export const colors = [
  "#238BFB",
  "#8F3DF3",
  "#DC2E2E",
  "#F57905",
  "#F1E104",
  "#1FAC0C",
]


export const Icon = ({shape, color}) => {
  const colored_icon = Object.values(icons)[shape].replace(/#ff0000/g, colors[color]);
  return (
    <img
      src={`data:image/svg+xml;utf8,${encodeURIComponent(colored_icon)}`}
      style={{
        width: "100%",
        height: "100%",
      }}
      onDragStart={(event) => event.preventDefault()}
    />
  );
};