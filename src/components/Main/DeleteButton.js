import React from "react";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";

class DeleteButton extends React.Component {
  render() {
    return (
      <Button
        variant="contained"
        size="small"
        color="secondary"
        onClick={async () =>
          await this.props.handleClick(this.props.displayShortUrl)
        }
        startIcon={<DeleteIcon />}
      >
        Delete
      </Button>
    );
  }
}

export default DeleteButton;
