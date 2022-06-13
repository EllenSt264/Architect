import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";

import MockProvider from "../utils/MockProvider";
import AddButton from "./AddButton";

describe("Add button", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={["/"]}>
        <AddButton />
      </MemoryRouter>,
      {
        wrappingComponent: MockProvider,
      }
    );
  });

  it("should render a <span />", () => {
    expect(wrapper.find("span").length).toEqual(1);
  });

  it("should contain a link", () => {
    expect(wrapper.getDOMNode().getAttribute("href")).toEqual("/note/new");
  });

  it("should render an icon", () => {
    expect(wrapper.find("#addNote").length).toEqual(1);
    expect(wrapper.find("#addNote").children().first().type()).toEqual("svg");
  });
});
