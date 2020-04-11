import React from 'react';
import ReactDOM from 'react-dom';
import FlipcardsApp from './components/FlipcardsApp';

import './style.css';
import boxes from "./data/boxes.json";

const useStrictMode = true;
let app = <FlipcardsApp boxes={boxes} />;

if (useStrictMode) {
  app = (<React.StrictMode>
    {app}
  </React.StrictMode>);
}

ReactDOM.render(
  app,
  document.getElementById('root')
);
