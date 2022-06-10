import React from "react";
import { mount } from "enzyme";

import MockProvider from "../../utils/MockProvider";
import Dashboard from "./Dashboard";
import NotesList from "./NotesList";

describe("Dashboard", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<Dashboard />, { wrappingComponent: MockProvider });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("should render a <div />", () => {
    expect(wrapper.find("div").length).toEqual(2);
  });

  it("should render the NotesList component", () => {
    expect(wrapper.containsMatchingElement(<NotesList />)).toEqual(true);
  });
});
