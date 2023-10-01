// store.ts
import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './createprojectslice';
import type { ProjectState } from './createprojectslice';

const store = configureStore({
  reducer: {
    project: projectReducer,
  },
});

export interface RootState {
  project: ProjectState;
}

export default store;
