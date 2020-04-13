import React from "react";
import {Redirect} from "react-router-dom";

class AddCardForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      source: "",
      target: "",
      redirectToDashboard: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleSubmit(event) {
    try {
      this.props.onSubmit(this.state);
    }
    catch(exception) {
      alert(exception);
    }
    this.setState({redirectToDashboard: true});
    event.preventDefault();
  }

  handleInputChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({[name]: value});
  }

  render() {
    if (this.state.redirectToDashboard) {
      return <Redirect to="/" />
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Source:
          <input
            type="text"
            name="source"
            value={this.state.source}
            onChange={this.handleInputChange}
            required={true} />
        </label>
        <label>
          Target:
          <input
            type="text"
            name="target"
            value={this.state.target}
            onChange={this.handleInputChange}
            required={true} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default AddCardForm;
