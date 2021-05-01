import React from "react";
import {Provider, useSelector} from "react-redux";
import 'react-splitter-layout/lib/index.css';
import {store} from "../state";
import {Game} from "./Game";
import {Setup} from "./Setup";

export function App() {
  return (
    <Provider store={store}>
      <SetupOrGame />
    </Provider>
  );
}

function SetupOrGame() {
  const setup = useSelector(state => state.setup)

  if(setup) {
    return <Setup />;
  } else {
    return <Game />;
  }
}

