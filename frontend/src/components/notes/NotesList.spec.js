import React from "react";
import { mount } from "enzyme";
import toJson from "enzyme-to-json";
import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import MockProvider from "../../utils/MockProvider";
import NotesList from "./NotesList";

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
          body: "bar",
          updated: "2022-05-18T10:45:00",
        },
      ],
      targetNote: {},
      loading: false,
      error: null,
    },
  };

  beforeEach(() => {
    wrapper = mount(<NotesList />, { wrappingComponent: MockProvider });
    const provider = wrapper.getWrappingComponent();
    provider.setProps({ customStore: mockStore(myMockStore) });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("should render a <div />", () => {
    expect(wrapper.find("div").length).toEqual(1);
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
    expect(notesContainer.children().length).toEqual(2);
    expect(notesContainer.children().at(0).text()).toEqual("foo");
    expect(notesContainer.children().at(1).text()).toEqual("bar");
  });
});
