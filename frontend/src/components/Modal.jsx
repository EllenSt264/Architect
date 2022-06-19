import React from "react";

const Modal = (props) => {
  return (
    <div
      role="dialog"
      className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline"
      onClick={props.onDismiss}
    >
      <div className="relative w-full max-w-md p-4 h-auto">
        <div className="relative  bg-white rounded-lg shadow dark:bg gray-700">
          <div className="p-6">
            <div className="flex">
              <div className="grow text-center">
                <h5 className="text-lg font-inter font-bold tracking-wide uppercase text-red-400 dark:text-gray-300">
                  Delete Note?
                </h5>
                <p className="mb-5 mt-2 text-sm font-inter text-gray-600 dark:text-gray-300">
                  You cannot recover the note once deleted.
                </p>
              </div>
              <div className="flex-none mt-2">
                <button onClick={props.onDismiss}>
                  <svg
                    className="w-8 h-8 text-gray-300 hover:text-gray-400 focus:outline-none"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>close_modal</title>
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex justify-center border-t-2 pt-4">
              <button
                type="button"
                id="deleteNoteBtn"
                className="text-red-600 font-semibold tracking-wide bg-gray-100 hover:bg-gray-200 focus:outline-none rounded-lg inline-flex items-center px-5 py-2 text-center mr-4"
                onClick={props.deleteNote}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>delete_note</title>
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </button>
              <button
                type="button"
                className="text-gray-600 font-semibold bg-gray-100 hover:bg-gray-200 focus:outline-none rounded-lg inline-flex items-center px-5 py-2 text-center"
                onClick={props.onDismiss}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
