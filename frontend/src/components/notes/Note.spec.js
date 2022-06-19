import React from "react";
import { mount } from "enzyme";
import configureStore from "redux-mock-store";
import mockAxios from "axios";

import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";

import MockProvider from "../../utils/MockProvider";
import Note from "./Note";
import Modal from "../Modal";

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
      const deleteModalBtn = screen.queryByRole("button", {
        name: /delete_modal/i,
      });
      const submitBtn = screen.queryByRole("button", { name: /done/i });

      expect(textarea).toBeNull();
      expect(backBtn).toBeNull();
      expect(deleteModalBtn).toBeNull();
      expect(submitBtn).toBeNull();
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
      const deleteModalBtn = await screen.findByRole("button", {
        name: /delete_modal/i,
      });

      expect(textarea).toBeInTheDocument();
      expect(backBtn).toBeEnabled();
      expect(deleteModalBtn).toBeEnabled();
      expect(textarea.value).toBe("foo");
    });

    it("should render the done button after a user has started typing", async () => {
      // first we need to wait for the loading div to disappear
      await waitFor(() => {
        const loadingDiv = screen.queryByText("Loading...");
        expect(loadingDiv).toBeNull();
      });

      // submit button should not render until a user starts typing
      var submitBtn = screen.queryByRole("button", { name: /done/i });
      expect(submitBtn).toBeNull();

      // simulate a user typing
      const textarea = await screen.findByRole("textbox");
      expect(textarea.value).toBe("foo");
      userEvent.type(textarea, "foo bar");

      // submit button should now render
      submitBtn = await screen.findByRole("button", { name: /done/i });
      expect(submitBtn).toBeEnabled();
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
      const deleteBtn = screen.queryByRole("button", { name: /delete_modal/i });
      expect(deleteBtn).toBeNull();
    });

    it("should render the render the submit and back button", () => {
      const submitBtn = screen.getByRole("button", { name: /done/i });
      const backBtn = screen.getByRole("button", { name: /back/i });

      expect(submitBtn).toBeEnabled();
      expect(backBtn).toBeEnabled();
    });
  });

  describe("Modal component", () => {
    beforeEach(() => {
      render(
        <Provider store={mockStore(myMockStore)}>
          <MemoryRouter initialEntries={[`/note/1`]}>
            <Route path="/note/:id" component={Note} />
          </MemoryRouter>
        </Provider>
      );
    });

    it("should not render without user input", () => {
      const modal = screen.queryByRole("dialog");
      expect(modal).toBeNull();
    });

    it("should render on settings button click", async () => {
      // we use await because of the delay with the getNote axios request
      const modalBtn = await screen.findByRole("button", {
        name: /delete_modal/i,
      });
      expect(modalBtn).toBeEnabled();

      // modal should render on button click
      userEvent.click(modalBtn);
      const modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();

      // modal buttons should render
      const deleteBtn = await screen.findByRole("button", {
        name: /delete_note/i,
      });
      const closeBtn = await screen.findByRole("button", { name: /cancel/i });
      expect(deleteBtn).toBeEnabled();
      expect(closeBtn).toBeEnabled();
    });

    it("should close the modal on exit button click", async () => {
      const modalBtn = await screen.findByRole("button", {
        name: /delete_modal/i,
      });
      expect(modalBtn).toBeEnabled();

      // modal must render first
      userEvent.click(modalBtn);
      var modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();

      const closeBtn = await screen.findByRole("button", { name: /close/i });
      await userEvent.click(closeBtn);
      modal = screen.queryByRole("dialog");
      expect(modal).toBeNull();
    });

    it("should close the modal on cancel button click", async () => {
      const modalBtn = await screen.findByRole("button", {
        name: /delete_modal/i,
      });

      expect(modalBtn).toBeEnabled();

      // modal must render first
      userEvent.click(modalBtn);
      var modal = await screen.findByRole("dialog");
      expect(modal).toBeInTheDocument();

      const cancelBtn = await screen.findByRole("button", { name: /cancel/i });
      await userEvent.click(cancelBtn);
      modal = screen.queryByRole("dialog");
      expect(modal).toBeNull();
    });

    it("should close the modal when clicking outside the modal container", async () => {
      const modalBtn = await screen.findByRole("button", {
        name: /delete_modal/i,
      });

      // render the modal first
      userEvent.click(modalBtn);
      const modalContainer = await screen.findByRole("dialog");
      expect(modalContainer).toBeInTheDocument();

      await userEvent.click(modalContainer);
      const modal = screen.queryByRole("dialog");
      expect(modal).toBeNull();
    });
  });
});

describe("Note behaviour", () => {
  let wrapper, store;

  describe("Behaviour for GET, PUT and DELETE methods", () => {
    beforeEach(() => {
      store = mockStore(myMockStore);
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
      provider.setProps({ customStore: store });
      // This bypasses the loading div
      wrapper.find(Note).children().setState({ dataLoaded: true });
    });

    afterEach(() => {
      jest.clearAllMocks();
      wrapper.unmount();
    });

    describe("Props and navigation", () => {
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

      it("should return the data for a single note matching a given id", () => {
        expect(wrapper.find(Note).children().props().targetNote).toEqual(
          myMockStore.notes.allnotes.filter((note) => note.id == 2)[0]
        );
      });

      it("should render a textarea with the state note body as its default value", () => {
        const componentNote = myMockStore.notes.allnotes.filter(
          (note) => note.id == 2
        );
        const container = wrapper.children().find("div");
        const textarea = container.children().find("textarea");

        expect(textarea.length).toEqual(1);
        expect(textarea.get(0).props.value).toEqual(componentNote.body);
      });

      it("should contain the Modal component", () => {
        expect(wrapper.containsMatchingElement(Modal)).toEqual(true);
      });
    });

    describe("Component rendering and state for GET note action", () => {
      it("should update the state with the target note body", () => {
        const targetNote = myMockStore.notes.allnotes.filter(
          (note) => note.id == 2
        )[0];

        expect(wrapper.find(Note).children().state("targetNote")).toEqual(
          targetNote
        );
      });
    });

    describe("Component rendering and state for PUT note action", () => {
      it("should setState on textarea change then update the note on back button click", async () => {
        const event = { target: { value: "I've updated note 2" } };

        mockAxios.put.mockImplementationOnce(() =>
          Promise.resolve({
            data: { id: 2, body: event.target.value },
          })
        );

        // trigger onChange event listener
        wrapper.find("textarea").simulate("change", event);

        // check if textarea value has updated
        expect(wrapper.find("textarea").get(0).props.value).toEqual(
          "I've updated note 2"
        );
        // test if state has updated
        expect(wrapper.find(Note).children().state("targetNote")).toEqual({
          body: "I've updated note 2",
        });

        // test that editNote is dispatched on back button click
        const backBtn = wrapper.findWhere(
          (node) => node.name() === "button" && node.text() === "back"
        );
        backBtn.simulate("click");

        expect(mockAxios.put).toHaveBeenCalledTimes(1);
        expect(mockAxios.put).toHaveBeenCalledWith("/api/notes/2/", {
          body: "I've updated note 2",
        });

        const actions = await store.getActions();

        expect(actions[0].type).toEqual("NOTES_LOADING");
        expect(actions[1].type).toEqual("EDIT_NOTE");
        expect(actions[1].payload.body).toEqual("I've updated note 2");
      });

      it("should setState on textarea change then update the note on submit button click", async () => {
        const event = { target: { value: "I've updated note 2" } };

        mockAxios.put.mockImplementationOnce(() =>
          Promise.resolve({
            data: { id: 2, body: event.target.value },
          })
        );

        // trigger onChange event listener
        wrapper.find("textarea").simulate("change", event);

        // check if textarea value has updated
        expect(wrapper.find("textarea").get(0).props.value).toEqual(
          "I've updated note 2"
        );
        // test if state has updated
        expect(wrapper.find(Note).children().state("targetNote")).toEqual({
          body: "I've updated note 2",
        });

        // test that editNote is dispatched on back button click
        const submitBtn = wrapper.findWhere(
          (node) => node.name() === "button" && node.text() === "Done"
        );
        submitBtn.simulate("click");

        expect(mockAxios.put).toHaveBeenCalledTimes(1);
        expect(mockAxios.put).toHaveBeenCalledWith("/api/notes/2/", {
          body: "I've updated note 2",
        });

        const actions = await store.getActions();

        expect(actions[0].type).toEqual("NOTES_LOADING");
        expect(actions[1].type).toEqual("EDIT_NOTE");
        expect(actions[1].payload.body).toEqual("I've updated note 2");
      });
    });

    describe("Component rendering and state for DELETE note action", () => {
      it("should delete the note on settings button click", async () => {
        mockAxios.delete.mockImplementationOnce(() =>
          Promise.resolve({
            data: { id: 2 },
          })
        );

        // render modal
        const deleteModalBtn = wrapper.findWhere(
          (node) => node.name() === "button" && node.text() === "delete_modal"
        );
        deleteModalBtn.simulate("click");

        // click delete button within modal to test that deleteNote is dispatched
        const deleteBtn = await wrapper.find("#deleteNoteBtn");
        deleteBtn.simulate("click");

        expect(mockAxios.delete).toHaveBeenCalledTimes(1);
        expect(mockAxios.delete).toHaveBeenCalledWith("/api/notes/2/");

        await new Promise((resolve, reject) => setTimeout(resolve, 0));
        const actions = store.getActions();

        expect(actions[0].type).toEqual("NOTES_LOADING");
        expect(actions[1].type).toEqual("DELETE_NOTE");
        expect(actions[1].payload).toEqual("2");
      });

      it("should delete the note if updated with an empty string", async () => {
        const event = { target: { value: "" } };

        mockAxios.put.mockImplementationOnce(() =>
          Promise.resolve({
            data: { id: 2, body: event.target.value },
          })
        );

        // trigger onChange event listener
        wrapper.find("textarea").simulate("change", event);

        // check if textarea value has updated
        expect(wrapper.find("textarea").get(0).props.value).toEqual("");
        // test if state has updated
        expect(wrapper.find(Note).children().state("targetNote")).toEqual({
          body: "",
        });

        // test that deleteNote is dispatched on back button click
        const backBtn = wrapper.findWhere(
          (node) => node.name() === "button" && node.text() === "back"
        );
        backBtn.simulate("click");

        // editNote should NOT be called
        expect(mockAxios.put).toHaveBeenCalledTimes(0);
        // deleteNote should be called
        expect(mockAxios.delete).toHaveBeenCalledTimes(1);
        expect(mockAxios.delete).toHaveBeenCalledWith("/api/notes/2/");

        const actions = await store.getActions();

        expect(actions[0].type).toEqual("NOTES_LOADING");
        expect(actions[1].type).toEqual("DELETE_NOTE");
        expect(actions[1].payload).toEqual("2");
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
      jest.clearAllMocks();
      wrapper.unmount();
    });

    describe("Props and navigation", () => {
      it("should have match params in its props", () => {
        const props = wrapper.find(Note).children().props();
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
