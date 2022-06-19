import React, { Component } from "react";
import { connect } from "react-redux";

import { getNote, addNote, editNote, deleteNote } from "../../actions/notes";
import Modal from "../Modal";

export class Note extends Component {
  constructor(props) {
    super(props);

    const { targetNote } = this.props;
    this.state = {
      targetNote,
      dataLoaded: false,
      isNew: false,
      isChanged: false,
      showModal: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id === "new") {
      this.setState({ isNew: true });
    }
    this.loadData();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  loadData = async () => {
    await this.props.getNote(this.props.match.params.id);
    const { targetNote } = this.props;
    this.setState({
      targetNote: targetNote,
    });
    this.timer = setTimeout(() => {
      this.hasLoaded();
    }, 300);
  };

  hasLoaded() {
    this.setState({ dataLoaded: true });
  }

  handleChange(event) {
    this.setState({
      targetNote: { body: event.target.value },
      isChanged: true,
    });
  }

  handleSubmit = async () => {
    const { id } = this.props.match.params;
    const { targetNote } = this.state;

    if (
      id !== "new" &&
      (!targetNote.body || targetNote.body.trim().length === 0)
    ) {
      await this.props.deleteNote(id);
    } else if (id === "new" && Object.keys(targetNote).length !== 0) {
      await this.props.addNote(targetNote.body);
    } else if (id !== "new") {
      await this.props.editNote(id, targetNote.body);
    }

    this.props.history.push("/");
  };

  deleteNote = async () => {
    const { id } = this.props.match.params;

    await this.props.deleteNote(id);
    this.props.history.push("/");
  };

  render() {
    return (
      <>
        {!this.state.dataLoaded && !this.state.isNew && (
          <div className="h-screen w-screen pt-8 pl-5 bg-[#8984f6] dark:bg-[#1e163a]">
            Loading...
          </div>
        )}
        {(this.state.dataLoaded || this.state.isNew) && (
          <div className="h-screen w-screen pt-8 pl-5 bg-[#8984f6] dark:bg-[#1e163a]">
            {/* Header */}
            <div className="flex justify-between">
              {/* Back button */}
              <button onClick={this.handleSubmit}>
                <svg
                  className="w-7 h-7 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>back</title>
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {/* Delete and submit buttons */}
              <div>
                {/* Delete modal */}
                {!this.state.isNew && (
                  <button
                    type="button"
                    className="mx-3 mr-10 text-amber-100"
                    onClick={() => {
                      this.setState({ showModal: true });
                    }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <title>delete_modal</title>
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
                {/* Submit changes */}
                {(this.state.isChanged || this.state.isNew) && (
                  <button
                    className="w-10 text-center ml-4 mr-10 align-top text-amber-200 font-inter font-semibold md:font-bold"
                    onClick={this.handleSubmit}
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
            {/* Textarea */}
            <div className="my-5 flex flex-wrap h-[91%]">
              <textarea
                name="noteBody"
                id="noteBody"
                value={this.state.targetNote?.body}
                onChange={this.handleChange}
                placeholder="Start typing..."
                className="resize-none h-full p-10 flex-1 bg-[#8984f6] dark:bg-[#1e163a] text-gray-100 placeholder:text-gray-300 placeholder:font-inter border-none focus:border-none focus:outline-none font-inter tracking-wide"
              ></textarea>
            </div>
          </div>
        )}

        {this.state.showModal && (
          <Modal
            onDismiss={() => this.setState({ showModal: false })}
            deleteNote={this.deleteNote}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const noteMatch = Array.isArray(state.notes.allnotes)
    ? state.notes.allnotes.filter((obj) => obj.id == ownProps.match.params.id)
    : "";
  return {
    targetNote: Object.assign({}, ...noteMatch),
  };
};

export default connect(mapStateToProps, {
  getNote,
  addNote,
  editNote,
  deleteNote,
})(Note);
