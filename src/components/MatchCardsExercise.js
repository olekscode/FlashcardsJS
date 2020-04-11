import React from "react";
import {shuffle} from "../util/random";

class MatchCardsExercise extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    const shuffledSources = this.props.cards.map(card => card.source);
    const shuffledTargets = this.props.cards.map(card => card.target);

    shuffle(shuffledSources);
    shuffle(shuffledTargets);

    return(
      <form onSubmit={this.handleSubmit}>
        <table>
          {shuffledSources.map((source, i) =>
            <tr key={source}>
              <td><button>{shuffledSources[i]}</button></td>
              <td><button>{shuffledTargets[i]}</button></td>
            </tr>)}
        </table>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default MatchCardsExercise;

// <form onSubmit={this.handleSubmit}>
