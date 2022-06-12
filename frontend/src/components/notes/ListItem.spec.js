import React from "react";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";

import MockProvider from "../../utils/MockProvider";
import ListItem from "./ListItem";

describe("List item", () => {
  let wrapper;

  const props = {
    id: 1,
    body: "Hello react! \n\nHere's some text. ",
    updated: "2022-05-18T07:45:13",
  };

  const constructTitle = () => {
    var title = props.body.split("\n")[0];
    title = title.length > 45 ? title.slice(0, 45) : title;
    return title.trim();
  };

  const constructSummary = () => {
    var title = constructTitle();
    var content = props.body.replaceAll("\n", " ");
    content = content.replaceAll(title, "");
    content = content.length > 40 ? content.slice(0, 40) : content;
    return content.trim();
  };

  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={["/"]}>
        <ListItem note={props} />
      </MemoryRouter>,
      {
        wrappingComponent: MockProvider,
      }
    );
  });

  it("should construct a title from the notes body to display in <h1 /> tag", () => {
    expect(constructTitle()).toEqual("Hello react!");
    expect(wrapper.find(".noteCard-title").text()).toEqual(constructTitle());
  });

  it("should construct a summary from the notes body to display in <p /> tag", () => {
    expect(constructSummary()).toEqual("Here's some text.");
    expect(wrapper.find(".noteCard-summary").text()).toEqual(
      constructSummary()
    );
  });

  it("should change the time to a readable format to display in <p /> tag", () => {
    const date = new Date(props.updated).toLocaleDateString();
    expect(date).toEqual("18/05/2022");
    expect(wrapper.find(".noteCard-time").text()).toEqual(date);
  });

  it("should contain a link", () => {
    expect(wrapper.getDOMNode().getAttribute("href")).toEqual("/note/1");
  });
});
