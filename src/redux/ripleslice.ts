import {  createSlice } from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';

export interface RipleState {
  ripleContent: string;
}

const initialState: RipleState = {
  ripleContent: "",
};

const ripleSlice = createSlice({
  name: 'riple',
  initialState,
  reducers: {
    setRipleContent: (state, action: PayloadAction<string>) => {
      state.ripleContent += action.payload;  // <-- modified this line to append data
    },
    resetRipleContent: (state) => {  // <-- new action for resetting the content
      state.ripleContent = '';
    }
  },
});


export const { setRipleContent, resetRipleContent } = ripleSlice.actions;
export default ripleSlice.reducer;
