import { ActionReducer, Action } from '@ngrx/store';

let init: any = {
    messages: []
};

export const chatrx: ActionReducer<any> = (state: any = init, action: Action) => {
    switch (action.type) {

        case 'ADD_PEER_MESSAGE':
            return Object.assign(
                {},
                state,
                {
                    messages: [
                        ...state.messages,
                        action.payload
                    ]
                }
            );
        case 'ADD_OWN_MESSAGE':
            return Object.assign(
                {},
                state,
                {
                    messages: [
                        ...state.messages,
                        action.payload
                    ]
                }
            );
        default:
            return state;
    }
};
