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
      state.ripleContent = action.payload;
    },
  },
});


export const { setRipleContent } = ripleSlice.actions;
export default ripleSlice.reducer;
