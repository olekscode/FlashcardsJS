import React from "react";
import {randomInteger} from "../util/random";

class SelectDefinitionExercise extends React.Component {

  render() {
    const sourceCard = this.props.sourceCard;
    const falseTargets = this.props.falseTargets;

    const randomPosition = randomInteger(0, falseTargets.length);
    falseTargets.splice(randomPosition, 0, sourceCard.target);
    const options = falseTargets;

    return(
      <div>
        <div>{sourceCard.source}</div>
        {options.map(target =>
          <div key={target}>{target}</div>)}
      </div>
    );
  }
}

export default SelectDefinitionExercise;

// <form onSubmit={this.handleSubmit}>
