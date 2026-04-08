import { RootState } from 'store';
import { AppState, AppTheme } from './appTypes';

export const getApp = (state: RootState): AppState => state.app;
export const getAppTheme = (state: RootState): AppTheme => state.app.theme;
