import React from "react";
import { MemoryRouter } from "react-router-dom";

import { mount } from "enzyme";
import toJson from "enzyme-to-json";

import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import MockProvider from "../../utils/MockProvider";
import NotesList from "./NotesList";
import ListItem from "./ListItem";
import notes from "../../reducers/notes";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("NotesList", () => {
  let wrapper;

  const myMockStore = {
    notes: {
      allnotes: [
        {
          id: 1,
          body: "foo",
          updated: "2022-05-16T07:00:00",
        },
        {
          id: 2,
          body: "Hello react! \n\nHere's some text. ",
          updated: "2022-05-18T10:45:00",
        },
      ],
    },
  };

  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter initialEntries={["/"]}>
        <NotesList />
      </MemoryRouter>,
      { wrappingComponent: MockProvider }
    );
    const provider = wrapper.getWrappingComponent();
    provider.setProps({ customStore: mockStore(myMockStore) });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("should render with the given state from Redux store", () => {
    // make a snapshot from the component itself, not the router
    const component = wrapper.find(NotesList);
    expect(toJson(component)).toMatchSnapshot();
  });

  it("should update the component's props to match the store", () => {
    expect(wrapper.children().props().allnotes).toEqual(myMockStore.allnotes);
  });

  it("should display a list of all notes from store", () => {
    const notesContainer = wrapper.find("#notesList");
    const noteTitleDiv = notesContainer.find(".noteCard-title");
    const noteSummaryDiv = notesContainer.find(".noteCard-summary");
    const noteTimeDiv = notesContainer.find(".noteCard-time");

    // assertions for first note
    expect(noteTitleDiv.at(0).text()).toEqual("foo");
    expect(noteSummaryDiv.at(0).text()).toEqual("");
    expect(noteTimeDiv.at(0).text()).toEqual("16/05/2022");

    // assertions for second note
    expect(noteTitleDiv.at(1).text()).toEqual("Hello react!");
    expect(noteSummaryDiv.at(1).text()).toEqual("Here's some text.");
    expect(noteTimeDiv.at(1).text()).toEqual("18/05/2022");
  });

  it("should render the ListItem component", () => {
    expect(wrapper.containsMatchingElement(<ListItem />)).toEqual(true);
  });
});
