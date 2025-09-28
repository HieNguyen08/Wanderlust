import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    isAuthenticated: false,
    token: null,
    username: '',
    avatar: '',
  },
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.username = action.payload.username;
      state.token = action.payload.token;
      state.avatar = action.payload.avatar;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.username = '';
      state.token = null;
      state.avatar = '';
      localStorage.removeItem('jwtToken');
    },
  }
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
