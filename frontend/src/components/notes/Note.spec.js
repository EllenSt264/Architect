import React from "react";
import { mount } from "enzyme";
import configureStore from "redux-mock-store";

import { screen, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";

import MockProvider from "../../utils/MockProvider";
import Note from "./Note";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

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

describe("Note UI components", () => {
  describe("How note component renders for getNote action request", () => {
    beforeEach(() => {
      render(
        <Provider store={mockStore(myMockStore)}>
          <MemoryRouter initialEntries={[`/note/1`]}>
            <Route path="/note/:id" component={Note} />
          </MemoryRouter>
        </Provider>
      );
    });

    it("should render loading div on initial page load", () => {
      const loading = screen.getByText("Loading...");
      expect(loading).toBeInTheDocument();
    });

    it("should not render a textarea or button on initial page load", () => {
      const textarea = screen.queryByRole("textbox");
      const backBtn = screen.queryByRole("button", { name: /back/i });

      expect(textarea).toBeNull();
      expect(backBtn).toBeNull();
    });

    it("should render the textarea and buttons after a delay", async () => {
      // Loading div should load first
      let loadingDiv = screen.getByText("Loading...");
      expect(loadingDiv).toBeInTheDocument();

      // The loading div should be removed after a delay
      await waitFor(() => {
        loadingDiv = screen.queryByText("Loading...");
        expect(loadingDiv).toBeNull();
      });

      // Then the rest of our component should render
      const textarea = await screen.findByRole("textbox");
      const backBtn = await screen.findByRole("button", { name: /back/i });

      expect(textarea).toBeInTheDocument();
      expect(backBtn).toBeEnabled();
      expect(textarea.value).toBe("foo");
    });
  });
});

describe("Note behaviour", () => {
  let wrapper;

  beforeEach(() => {
    const id = 2;
    wrapper = mount(
      <MemoryRouter initialEntries={[`/note/${id}`]}>
        <Route path="/note/:id" component={Note} />
      </MemoryRouter>,
      {
        wrappingComponent: MockProvider,
      }
    );
    const provider = wrapper.getWrappingComponent();
    provider.setProps({ customStore: mockStore(myMockStore) });
    // This bypasses the loading div
    wrapper.find(Note).children().setState({ dataLoaded: true });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  describe("Component, props and navigation", () => {
    it("should have match params in its props", () => {
      const props = wrapper.find(Note).children().first().props();
      expect(props).toMatchObject({ match: {} });
    });

    it("should redirect to homepage on back button click", async () => {
      const props = wrapper.find(Note).children().first().props();

      // starting url should be "/note/:id"
      expect(props.history.location.pathname).toEqual("/note/2");

      const backBtn = wrapper.findWhere(
        (node) => node.name() === "button" && node.text() === "back"
      );
      backBtn.simulate("click");

      // url should change to home "/" after button click
      await new Promise((resolve, reject) => setTimeout(resolve, 100));
      expect(props.history.location.pathname).toEqual("/");
    });
  });

  describe("GET note action", () => {
    it("should return a single note matching a given id in props", () => {
      expect(wrapper.find(Note).children().props().targetNote).toEqual(
        myMockStore.notes.allnotes.filter((note) => note.id == 2)[0]
      );
    });

    it("should update the state with the target note body", () => {
      const targetNote = myMockStore.notes.allnotes.filter(
        (note) => note.id == 2
      )[0];

      expect(wrapper.find(Note).children().state("targetNote")).toEqual(
        targetNote
      );
    });

    it("should render a textarea with the state note body as its default value", () => {
      const targetNote = myMockStore.notes.allnotes.filter(
        (note) => note.id === 2
      )[0];
      expect(wrapper.find("textarea").length).toEqual(1);
      // Update wrapper to reflect updated state
      wrapper.update();
      expect(wrapper.find("textarea").get(0).props.value).toEqual(
        targetNote.body
      );
    });
  });
});
