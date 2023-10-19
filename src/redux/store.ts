// store.ts
import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './createprojectslice';
import ripleReducer from './ripleslice';
import type { RipleState } from './ripleslice';
import type { ProjectState } from './createprojectslice';

const store = configureStore({
  reducer: {
    project: projectReducer,
    riple: ripleReducer,
  },
});

export interface RootState {
  project: ProjectState;
  riple: RipleState;
}

export default store;
