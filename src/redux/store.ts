import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth";
import tasksReducer from "./slices/tasks";
import productsReducer from "./slices/products";
import cartReducer from "./slices/cart";
import contactsReducer from "./slices/contacts";
import authUserAdsReducer from "./slices/authUserTasks";
import advertsReducer from "./slices/adverts"; // ✅ newly added

const store = configureStore({
	reducer: {
		auth: authReducer,
		tasks: tasksReducer,
		adverts: advertsReducer, // ✅ registered here
		products: productsReducer,
		cart: cartReducer,
		contacts: contactsReducer,
		authUserTasks: authUserAdsReducer,
	},
});

export default store;
