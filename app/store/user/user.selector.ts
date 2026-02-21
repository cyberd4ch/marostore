import { createSelector } from 'reselect';

import { RootState } from '../store';

import { UserState } from './user.reducer';

import { UserData } from './user.types';

export const selectUserReducer = (state: RootState): any => state.user;

export const selectCurrentUser = createSelector(
    selectUserReducer,
    (user): UserData | null => user?.currentUser as UserData | null
);