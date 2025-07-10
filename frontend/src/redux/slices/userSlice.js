import { createSlice } from "@reduxjs/toolkit";

const userStr = localStorage.getItem("user");
const initialState = {
	user: userStr && userStr !== "undefined" ? JSON.parse(userStr) : {},
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
		},
	},
});

export const { setUser } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export default userSlice.reducer;
