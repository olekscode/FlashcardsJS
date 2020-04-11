import React from "react";
import {shuffle} from "../util/random";

class ToggleButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    this.props.onClick(this.props.value);
  }

  render() {
    return (
      <button
        style={{color: this.props.active ? "red" : "black"}}
        onClick={this.handleClick}>
        {this.props.value}
      </button>
    );
  }
}

class MatchCardsExercise extends React.Component {
  constructor(props) {
    super(props);

    const shuffledSources = this.props.cards.map(card => card.source);
    const shuffledTargets = this.props.cards.map(card => card.target);

    shuffle(shuffledSources);
    shuffle(shuffledTargets);

    this.state = {
      activeSource: undefined,
      activeTarget: undefined,
      shuffledSources: shuffledSources,
      shuffledTargets: shuffledTargets
    };

    this.result = {
      passed: new Set(),
      failed: new Set()
    };
  }

  recordCorrectAnswer(card) {
    // If a card was already failed, it can't pass
    if (!this.result.failed.has(card))
      this.result.passed.add(card);
    console.log(this.result);
  }

  recordWrongAnswer(card) {
    this.result.failed.add(card);
    console.log(this.result);
  }

  checkAnswer(state, props, selectedSource, selectedTarget) {
    // Checking the answer
    const card = props.cards.find(_card =>
      _card.source === selectedSource);

    if (selectedTarget === card.target) {
      // Answer is correct
      this.recordCorrectAnswer(card);

      return {
        activeSource: undefined,
        activeTarget: undefined,
        shuffledSources: state.shuffledSources.filter(source =>
          source !== card.source),
        shuffledTargets: state.shuffledTargets.filter(target =>
          target !== card.target)
      }
    }
    else{
      // Answer is wrong
      this.recordWrongAnswer(card);

      return {
        activeSource: undefined,
        activeTarget: undefined
      }
    }
  }

  handleSourceButtonClick(value) {
    this.setState((state, props) => {
      if (!state.activeSource && state.activeTarget) {
        // Answer is ready
        return this.checkAnswer(state, props, value, state.activeTarget);
      }
      else {
        return {
          activeSource: value
        };
      }
    }, () => {
      if (!this.state.shuffledSources.length)
        this.props.onSubmit(this.result);
    });
  }

  handleTargetButtonClick(value) {
    this.setState((state, props) => {
      if (state.activeSource && !state.activeTarget) {
        // Answer is ready
        return this.checkAnswer(state, props, state.activeSource, value);
      }
      else {
        return {
          activeTarget: value
        };
      }
    }, () => {
      if (!this.state.shuffledSources.length)
        this.props.onSubmit(this.result);
    });
  }

  render() {
    return(
      <table>
        <tbody>
          {this.state.shuffledSources.map((source, i) =>
            <tr key={source}>
              <td>
                <ToggleButton
                  value={this.state.shuffledSources[i]}
                  onClick={(value) => this.handleSourceButtonClick(value)}
                  active={this.state.activeSource === this.state.shuffledSources[i]} />
              </td>
              <td>
                <ToggleButton
                  value={this.state.shuffledTargets[i]}
                  onClick={(value) => this.handleTargetButtonClick(value)}
                  active={this.state.activeTarget === this.state.shuffledTargets[i]} />
              </td>
            </tr>)}
        </tbody>
      </table>
    );
  }
}

export default MatchCardsExercise;

// <form onSubmit={this.handleSubmit}>
