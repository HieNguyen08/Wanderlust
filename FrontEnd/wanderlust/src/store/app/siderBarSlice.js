import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedKey: window.location.pathname,
};

const sideBarSlice = createSlice({
    name: 'sideBar',
    initialState,
    reducers: {
        setSelectedKey: (state, action) => {
            state.selectedKey = action.payload;
        },
    },
});

export const { setSelectedKey } = sideBarSlice.actions;
export default sideBarSlice.reducer;
