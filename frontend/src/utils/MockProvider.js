import React from "react";
import PropTypes from "prop-types";
import { MemoryRouter, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import configureStore from "redux-mock-store";
import thunk from "redux-thunk";

import { store } from "../store";

const initialState = {
  notes: {
    allnotes: [],
    targetNote: {},
    loading: false,
    error: null,
  },
};
const mockStore = configureStore([thunk]);

const MockProvider = (props) => {
  const { children, customStore } = props;

  return <Provider store={customStore || store}>{children}</Provider>;
};

MockProvider.propTypes = {
  children: PropTypes.node,
  customStore: PropTypes.shape({}),
};

MockProvider.defaultProps = {
  children: null,
  customStore: mockStore(initialState),
};

export default MockProvider;
