import { compose } from '@ngrx/core/compose';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { storeLogger } from 'ngrx-store-logger';
import { routerReducer, RouterState } from '@ngrx/router-store';

// own reducers
import { userrx } from './user.reducer';
import { peerconnrx } from './peerconn.reducer';
import { chatrx } from './chat.reducer';
import { meetingsrx } from './meetings.reducer';
import { personsrx } from './persons.reducer';

export interface AppState {
  router: RouterState;
}

export const reducers = {
  // router: routerReducer,
  user: userrx,
  peerconn: peerconnrx,
  chat: chatrx,
  meetings: meetingsrx,
  persons: personsrx
};

// Generate a reducer to set the root state in dev mode for HMR
function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    if (action.type === 'SET_ROOT_STATE') {
      return action.payload;
    }
    return reducer(state, action);
  };
}

const DEV_REDUCERS = [stateSetter, storeFreeze];
if (['logger', 'both'].includes(STORE_DEV_TOOLS)) { // set in constants.js file of project root
    DEV_REDUCERS.push(storeLogger());
}

const developmentReducer = compose(...DEV_REDUCERS, combineReducers)(reducers);
const productionReducer = combineReducers(reducers);

export function rootReducer(state: any, action: any) {
  if (ENV !== 'development') {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}
