import React from "react";
import { mount } from "enzyme";

import MockProvider from "../utils/MockProvider";
import App from "./App";
import Dashboard from "./notes/Dashboard";

describe("App", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<App />, { wrappingComponent: MockProvider });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("should render the Dashboard component", () => {
    expect(wrapper.containsMatchingElement(<Dashboard />)).toEqual(true);
  });
});
