import React, { Component } from "react";

import NotesList from "./NotesList";

export class Dashboard extends Component {
  render() {
    return (
      <div
        id="notesContainer"
        className="bg-gradient-to-b dark:bg-transparent from-violet-500 to-cyan-300 dark:bg-gradient-to-tl dark:from-gray-700 dark:via-gray-900 dark:to-black w-full h-full min-h-screen pt-2 pb-8"
      >
        <div className="text-center pt-8 pb-4 font-inter">
          <h1 className="uppercase text-2xl md:text-4xl font-semibold md:font-bold tracking-wider dark:text-white text-yellow-300">
            Architect
          </h1>
          <h2 className="text-lg md:text-2xl md:font-semibold tracking-wide uppercase text-yellow-200 dark:text-gray-200">
            Your life planner
          </h2>
        </div>
        <div className="relative my-5">
          <div className="text-left text-xl font-semibold font-inter md:font-bold tracking-wider dark:text-white text-yellow-200 pl-5">
            <h3>Notes</h3>
          </div>
        </div>
        <div>
          <NotesList />
        </div>
      </div>
    );
  }
}

export default Dashboard;
