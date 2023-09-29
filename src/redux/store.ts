// store.ts
import { configureStore } from '@reduxjs/toolkit';
import projectReducer, { ProjectState } from './createprojectslice';

const store = configureStore({
  reducer: {
    project: projectReducer,
  },
});

export interface RootState {
  project: ProjectState;
}

export default store;
