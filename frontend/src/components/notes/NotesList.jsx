import React, { Component } from "react";
import { connect } from "react-redux";

import { getNotes } from "../../actions/notes";
import ListItem from "./ListItem";

export class NotesList extends Component {
  componentDidMount() {
    this.props.getNotes();
  }
  render() {
    return (
      <div id="notesList">
        {this.props.notes?.length > 0 &&
          this.props.notes?.map((note) => (
            <ListItem key={note.id} note={note} />
          ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  notes: state.notes.allnotes,
});

export default connect(mapStateToProps, { getNotes })(NotesList);
