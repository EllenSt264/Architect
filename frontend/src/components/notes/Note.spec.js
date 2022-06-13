import React from "react";
import { mount } from "enzyme";
import configureStore from "redux-mock-store";
import mockAxios from "axios";

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
        <MockProvider customStore={mockStore(myMockStore)}>
          <MemoryRouter initialEntries={[`/note/1`]}>
            <Route path="/note/:id" component={Note} />
          </MemoryRouter>
        </MockProvider>
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

  describe("How note component renders for addNote action request", () => {
    beforeEach(() => {
      render(
        <Provider store={mockStore(myMockStore)}>
          <MemoryRouter initialEntries={["/note/new"]}>
            <Route path="/note/:id" component={Note} />
          </MemoryRouter>
        </Provider>
      );
    });

    it("should render a textarea with an empty value on page load", () => {
      const textarea = screen.getByPlaceholderText("Start typing...");
      expect(textarea).toBeInTheDocument();
      expect(textarea.value).toBe("");
    });

    it("should not render the loading div", () => {
      const loadingDiv = screen.queryByText("Loading...");
      expect(loadingDiv).toBeNull();
    });

    it("should not render the delete button", () => {
      // const settingBtn = screen.queryByTestId("settingsBtn");
      const deleteBtn = screen.queryByRole("button", { name: /delete/i });
      expect(deleteBtn).toBeNull();
    });

    it("should render the render the back button", () => {
      const backBtn = screen.getByRole("button", { name: /back/i });
      expect(backBtn).toBeEnabled();
    });
  });
});

describe("Note behaviour", () => {
  let wrapper, store;

  describe("Behaviour for GET, PUT and DELETE methods", () => {
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

    describe("Props and navigation", () => {
      it("should have match params in its props", () => {
        const props = wrapper.find(Note).children().first().props();
        expect(props).toMatchObject({ match: {} });
      });

      it("should redirect to homepage on back button click", () => {
        const props = wrapper.find(Note).children().first().props();

        // starting url should be "/note/:id"
        expect(props.history.location.pathname).toEqual("/note/2");

        const backBtn = wrapper.findWhere(
          (node) => node.name() === "button" && node.text() === "back"
        );
        backBtn.simulate("click");

        // url should change to home "/" after button click
        expect(props.history.location.pathname).toEqual("/");
      });
    });

    describe("Component rendering and state for GET note action", () => {
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

  describe("Behaviour for POST methods", () => {
    beforeEach(() => {
      store = mockStore(myMockStore);
      wrapper = mount(
        <MemoryRouter initialEntries={["/note/new"]}>
          <Route path="/note/:id" component={Note} />
        </MemoryRouter>,
        {
          wrappingComponent: MockProvider,
        }
      );
      const provider = wrapper.getWrappingComponent();
      provider.setProps({
        customStore: store,
      });
    });

    afterEach(() => {
      wrapper.unmount();
    });

    describe("Props and navigation", () => {
      it("should have match params in its props", () => {
        const props = wrapper.find(Note).children().first().props();
        expect(props).toMatchObject({ match: {} });
      });

      it("should redirect to homepage on back button click", () => {
        const props = wrapper.find(Note).children().first().props();

        // starting url should be "/note/:id"
        expect(props.history.location.pathname).toEqual("/note/new");

        const backBtn = wrapper.findWhere(
          (node) => node.name() === "button" && node.text() === "back"
        );
        backBtn.simulate("click");

        // url should change to home "/" after button click
        expect(props.history.location.pathname).toEqual("/");
      });
    });

    describe("Component rendering and state", () => {
      it("should render an empty textarea, displaying only the placeholder", () => {
        expect(wrapper.find("textarea").props.value).toEqual(null || undefined);
      });

      it("should set the state for the note object on textarea change", () => {
        const event = { target: { value: "my new note!" } };

        // trigger onChange event listener
        wrapper.find("textarea").simulate("change", event);

        // check if textarea value has updated
        expect(wrapper.find("textarea").get(0).props.value).toEqual(
          event.target.value
        );
        // test if state has updated
        expect(
          wrapper.find(Note).children().first().state("targetNote")
        ).toEqual({
          body: "my new note!",
        });
      });

      it("should add a new note to the store", async () => {
        const event = { target: { value: "my new note!" } };

        mockAxios.post.mockImplementationOnce(() =>
          Promise.resolve({
            data: { body: event.target.value },
          })
        );

        // trigger onChange event listener to trigger the handleChange function
        wrapper.find("textarea").simulate("change", event);

        // test that the note exists within the state
        expect(
          wrapper.find(Note).children().first().state("targetNote")
        ).toEqual({
          body: "my new note!",
        });

        // test that addNote is dispatched on back button click
        const backBtn = wrapper.findWhere(
          (node) => node.name() === "button" && node.text() === "back"
        );
        backBtn.simulate("click");

        const actions = await store.getActions();
        expect(actions[0].type).toEqual("NOTES_LOADING");
        expect(actions[1].type).toEqual("ADD_NOTE");
        expect(actions[1].payload.body).toEqual("my new note!");
      });

      it("should not add a new note to the store if the texarea is empty", async () => {
        mockAxios.post.mockImplementationOnce(() =>
          Promise.resolve({
            data: { body: "" },
          })
        );

        const targetNote = wrapper
          .find(Note)
          .children()
          .first()
          .state("targetNote");

        expect(wrapper.find("textarea").props.value).toEqual(null || undefined);
        expect(Object.keys(targetNote).length).toEqual(0);

        // test that addNote is ignored on back button click
        const backBtn = wrapper.findWhere(
          (node) => node.name() === "button" && node.text() === "back"
        );
        backBtn.simulate("click");

        const actions = await store.getActions();
        expect(actions.length).toEqual(0);
      });
    });
  });
});
