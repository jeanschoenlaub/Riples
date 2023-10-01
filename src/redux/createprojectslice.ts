
import {  createSlice } from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';

export interface ProjectState {
  tasks: string[];
  goals: string[];
  post: string;
}

const initialState: ProjectState = {
  tasks: [],
  goals: [],
  post: "",
};

const projectSlice = createSlice({
  name: 'project',
  initialState,  // <-- Use the typed initialState here
  reducers: {
    setTasks: (state, action: PayloadAction<string[]>) => {
      state.tasks = action.payload;
    },
    setGoals: (state, action: PayloadAction<string[]>) => {
      state.goals = action.payload;
    },
    setPost: (state, action: PayloadAction<string>) => {
      state.post = action.payload;
    }
  },
});


export const { setTasks, setGoals, setPost } = projectSlice.actions;
export default projectSlice.reducer;
