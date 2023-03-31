import thunk from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";
import { routerMiddleware, connectRouter } from "connected-react-router";
import appSlice from "./slices/appSlice";

export const history = createBrowserHistory();

const middlewares = [routerMiddleware(history), thunk];

const store = configureStore({
  reducer: {
    app: appSlice,
  },
  middleware: middlewares,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
