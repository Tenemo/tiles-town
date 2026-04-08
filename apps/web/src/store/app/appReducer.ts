import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AppState, AppTheme } from 'store/app/appTypes';

export const initialAppState: AppState = {
    theme: 'dark',
};

const appSlice = createSlice({
    name: 'app',
    initialState: initialAppState,
    reducers: {
        setTheme: (state, action: PayloadAction<AppTheme>) => {
            state.theme = action.payload;
        },
    },
});

export const { setTheme } = appSlice.actions;
export const appReducer = appSlice.reducer;
