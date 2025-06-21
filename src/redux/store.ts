import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import tasksReducer from "./slices/tasks";
import productsReducer from "./slices/products";
import cartReducer from "./slices/cart";
import contactsReducer from "./slices/contacts";

const store = configureStore({
	reducer: {
		auth: authReducer,
		tasks: tasksReducer,
		products: productsReducer,
		cart: cartReducer,
		contacts: contactsReducer,
	},
});

export default store;
