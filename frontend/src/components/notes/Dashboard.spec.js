import React from "react";
import { MemoryRouter } from "react-router-dom";
import { mount } from "enzyme";
import { screen, render } from "@testing-library/react";
import "@testing-library/jest-dom";

import MockProvider from "../../utils/MockProvider";
import Dashboard from "./Dashboard";
import NotesList from "./NotesList";
import AddButton from "../AddButton";

describe("Dashboard UI components", () => {
  beforeEach(() => {
    render(
      <MockProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Dashboard />
        </MemoryRouter>
      </MockProvider>
    );
  });

  it("should container a header", () => {
    const header = screen.getByText("Architect");
    expect(header).toBeInTheDocument();
  });

  it("should render a sub-heading", () => {
    const subheading = screen.getByText("Your life planner");
    expect(subheading).toBeInTheDocument();
  });

  it("should render a title for the notes list", () => {
    const title = screen.getByText("Notes");
    expect(title).toBeInTheDocument();
  });
});

describe("Dashboard behaviour", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={["/"]}>
        <Dashboard />
      </MemoryRouter>,
      { wrappingComponent: MockProvider }
    );
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("should render the NotesList component", () => {
    expect(wrapper.containsMatchingElement(<NotesList />)).toEqual(true);
  });

  it("should render the AddButton component", () => {
    expect(wrapper.containsMatchingElement(<AddButton />)).toEqual(true);
  });
});
