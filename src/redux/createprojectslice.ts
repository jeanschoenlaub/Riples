// projectSlice.ts
import { createSlice } from '@reduxjs/toolkit';

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
  initialState: {
    tasks: [],
    goals: [],
    post:"",
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
    setGoals: (state, action) => {
      state.goals = action.payload;
    },
    setPost: (state, action) => {
      state.post= action.payload;
    }
  },
});

export const { setTasks, setGoals, setPost } = projectSlice.actions;
export default projectSlice.reducer;
