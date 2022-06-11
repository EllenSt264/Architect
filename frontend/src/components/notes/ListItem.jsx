import React from "react";

const constructTitle = (note) => {
  var title = note.split("\n")[0];
  title = title.length > 45 ? title.slice(0, 45) : title;
  return title.trim();
};

const constructSummary = (note) => {
  var title = constructTitle(note);
  var content = note.replaceAll("\n", " ");
  content = content.replaceAll(title, "");
  content = content.length > 40 ? content.slice(0, 40) : content;
  return content.trim();
};

const constructTime = (note) => {
  return new Date(note).toLocaleDateString();
};

const ListItem = ({ note }) => {
  return (
    <div className="block p-4 mx-3 my-4 box-border shadow-md dark:shadow-violet-600/25 rounded-md bg-gradient-to-r from-[#8352f1] to-[#95ddff] dark:bg-transparent dark:from-gray-900 dark:via-violet-900 dark:to-gray-900">
      <h3 className="noteCard-title font-inter capitalize text-white dark:text-white text-1xl tracking-wide">
        {constructTitle(note.body)}
      </h3>
      <p>
        <span className="noteCard-summary text-gray-300 dark:text-gray-200 tracking-wide">
          {constructSummary(note.body)}
        </span>
        <span className="noteCard-time text-orange-200 dark:text-gray-300 font-roboto text-sm tracking-wide ml-2">
          {constructTime(note.updated)}
        </span>
      </p>
    </div>
  );
};

export default ListItem;
