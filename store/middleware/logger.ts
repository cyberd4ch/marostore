import { Middleware } from 'redux';
import { UnknownAction } from 'redux';
import { RootState } from '../store';

export const loggerMiddleware: Middleware<{}, RootState> =
    (store) => (next) => (action) => {
        // action is unknown here
        if (typeof action === 'object' && action !== null && 'type' in action) {
            const typedAction = action as UnknownAction;
            console.log('type: ', typedAction.type);
            if ('payload' in typedAction) {
                console.log('payload: ', typedAction.payload);
            }
        } else {
            // Not a valid action? maybe just pass through
            return next(action);
        }
        console.log('currentState: ', store.getState());

        const result = next(action);

        console.log('next state: ', store.getState());

        return result;
    };