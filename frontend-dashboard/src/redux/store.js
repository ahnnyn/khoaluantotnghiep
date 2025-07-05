import { combineReducers, configureStore } from "@reduxjs/toolkit";
import accountReducer from "@redux/account/accountSlice";
import globalReducer from "@redux/app/globalSlice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  // Nếu không muốn persist account thì thêm vào blacklist:
  // blacklist: ['account'],
};

const rootReducer = combineReducers({
  account: accountReducer,
  global: globalReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
