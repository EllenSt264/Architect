import mockAxios from "axios";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import promiseMiddleware from "redux-promise-middleware";

import { getNotes, getNote, addNote, editNote } from "./notes";

const mockStore = configureMockStore([thunk, promiseMiddleware()]);

describe("Notes actions", () => {
  let store;

  beforeEach(() => (store = mockStore({ notes: [] })));

  afterEach(() => jest.clearAllMocks());

  describe("getNotes action creator", () => {
    it("should dispatch GET_NOTES and return the correct response", async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: [
            { body: "foo", id: 1 },
            { body: "bar", id: 2 },
          ],
        })
      );

      await store.dispatch(getNotes());
      const actions = store.getActions();

      expect.assertions(6);

      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith("/api/notes/");

      expect(actions[0].type).toEqual("NOTES_LOADING");
      expect(actions[1].type).toEqual("GET_NOTES");
      expect(actions[1].payload[0]).toEqual({ id: 1, body: "foo" });
      expect(actions[1].payload[1]).toEqual({ id: 2, body: "bar" });
    });

    it("should handle errors for getNotes appropriately", async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.reject({ error: "Something went wrong" })
      );

      try {
        await store.dispatch(getNotes());
      } catch {
        const actions = store.getActions();

        expect.assertions(6);

        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith("/api/notes/");

        expect(actions[0].type).toEqual("NOTES_LOADING");
        expect(actions[1].type).toEqual("NOTE_REQUEST_FAIL");
        expect(actions[1].payload.error).toEqual("Something went wrong");
      }
    });
  });

  describe("getNote action creator", () => {
    it("should dispatch GET_NOTE and return the correct response", async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.resolve({
          data: { id: 1, body: "hello world" },
        })
      );

      await store.dispatch(getNote(1));
      const actions = store.getActions();

      expect.assertions(5);

      expect(mockAxios.get).toHaveBeenCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith("/api/notes/1/");

      expect(actions[0].type).toEqual("NOTES_LOADING");
      expect(actions[1].type).toEqual("GET_NOTE");
      expect(actions[1].payload).toEqual({ id: 1, body: "hello world" });
    });

    it("should handle errors for getNote appropriately", async () => {
      mockAxios.get.mockImplementationOnce(() =>
        Promise.reject({ error: "Something went wrong" })
      );

      try {
        await store.dispatch(getNote(1));
      } catch {
        const actions = store.getActions();

        expect.assertions(5);

        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        expect(mockAxios.get).toHaveBeenCalledWith("/api/note/1/");

        expect(actions[0].type).toEqual("NOTES_LOADING");
        expect(actions[1].type).toEqual("NOTE_REQUEST_FAIL");
        expect(actions[1].payload.error).toEqual("Something went wrong");
      }
    });
  });

  describe("addNote action creator", () => {
    it("should dispatch ADD_NOTE and return the correct response", async () => {
      mockAxios.post.mockImplementationOnce(() =>
        Promise.resolve({
          data: { id: 3, body: "foo bar" }, // we want the payload to match this
        })
      );

      await store.dispatch(addNote("foo bar"));
      const actions = store.getActions();

      expect.assertions(5);

      expect(mockAxios.post).toHaveBeenCalledTimes(1);
      expect(mockAxios.post).toHaveBeenCalledWith("/api/notes/", {
        body: "foo bar",
      });

      expect(actions[0].type).toEqual("NOTES_LOADING");
      expect(actions[1].type).toEqual("ADD_NOTE");
      expect(actions[1].payload).toEqual({ id: 3, body: "foo bar" });
    });

    it("should handle errors for addNote appropriately", async () => {
      mockAxios.post.mockImplementationOnce(() =>
        Promise.reject({ error: "Something went wrong" })
      );

      try {
        await store.dispatch(addNote("foo bar"));
      } catch {
        const actions = store.getActions();

        expect.assertions(5);

        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(mockAxios.post).toHaveBeenCalledWith("/api/notes/", {
          body: "foo bar",
        });

        expect(actions[0].type).toEqual("NOTES_LOADING");
        expect(actions[1].type).toEqual("NOTE_REQUEST_FAIL");
        expect(actions[1].payload.error).toEqual("Something went wrong");
      }
    });
  });

  describe("editNote action creator", () => {
    it("should dispatch EDIT_NOTE and return the correct response", async () => {
      mockAxios.put.mockImplementationOnce(() =>
        Promise.resolve({
          data: { id: 1, body: "my updated note" },
        })
      );

      await store.dispatch(editNote(1, "my updated note"));

      expect(mockAxios.put).toHaveBeenCalledTimes(1);
      expect(mockAxios.put).toHaveBeenCalledWith("/api/notes/1/", {
        body: "my updated note",
      });

      const actions = store.getActions();

      expect(actions[0].type).toEqual("NOTES_LOADING");
      expect(actions[1].type).toEqual("EDIT_NOTE");
      expect(actions[1].payload).toEqual({ id: 1, body: "my updated note" });
    });

    it("should handle errors for editNote appropriately", async () => {
      mockAxios.put.mockImplementationOnce(() =>
        Promise.reject({ error: "Something went wrong" })
      );

      try {
        await store.dispatch(editNote(1, "foo bar"));
      } catch {
        const actions = store.getActions();

        expect.assertions(5);

        expect(mockAxios.put).toHaveBeenCalledTimes(1);
        expect(mockAxios.put).toHaveBeenCalledWith("/api/notes/1/", {
          body: "foo bar",
        });

        expect(actions[0].type).toEqual("NOTES_LOADING");
        expect(actions[1].type).toEqual("NOTE_REQUEST_FAIL");
        expect(actions[1].payload.error).toEqual("Something went wrong");
      }
    });
  });
});
