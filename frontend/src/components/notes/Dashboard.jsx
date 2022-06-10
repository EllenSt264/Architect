import React, { Component } from "react";

import NotesList from "./NotesList";

export class Dashboard extends Component {
  render() {
    return (
      <div>
        <NotesList />
      </div>
    );
  }
}

export default Dashboard;
