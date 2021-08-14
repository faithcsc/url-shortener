import React from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import "../../index.css";

const validSizes = ["small", "medium", "large"];

class CopyButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      copyValue: this.props.copyValue,
      originalDisplayMessage: "Copy",
      displaySuccessMessage: "Copied!",
      displayText: "Copy",
      displaySuccessTime: 2000,
      size:
        this.props.size === undefined
          ? "small"
          : validSizes.includes(this.props.size)
          ? this.props.size
          : "small",
    };
    this.handleCopy = this.handleCopy.bind(this);
    this.successfulCopy = this.successfulCopy.bind(this);
  }

  successfulCopy() {
    console.log(`Copied ${this.state.copyValue}`);
    this.setState({
      displayText: this.state.displaySuccessMessage,
    });
    setTimeout(
      function () {
        this.setState({ displayText: this.state.originalDisplayMessage });
      }.bind(this),
      this.state.displaySuccessTime
    );
  }

  handleCopy(e) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(this.state.copyValue).then(
        () => this.successfulCopy(),
        (err) => {}
      );
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = this.state.copyValue;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((res, rej) => {
        if (document.execCommand("copy")) {
          this.successfulCopy();
        }
        textArea.remove();
      });
    }
  }

  render() {
    return (
      <Button
        variant="contained"
        size="small"
        color="primary"
        onClick={this.handleCopy}
        className={this.props.inheritedClassName}
        {...this.props}
      >
        {this.state.displayText}
      </Button>
    );
  }
}

export default CopyButton;
