import React from "react";
import { Link } from "react-router-dom";

function AddButton() {
  return (
    <Link to="/note/new">
      <span id="addNote">
        <svg
          className="w-6 h-6 md:w-7 md:h-7 text-yellow-100 dark:text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
          <path
            fillRule="evenodd"
            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    </Link>
  );
}

export default AddButton;
