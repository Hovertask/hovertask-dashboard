import { HeroUIProvider } from "@heroui/react";
import "material-icons/iconfont/material-icons.css";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import "./App.css";
import RootLayout from "./components/layout";
import Logout from "./components/Logout";
import AddMeUp from "./pages/add-me-up/AddMeUp";
import ListProfile from "./pages/add-me-up/ListProfile";
import ListProfileForm from "./pages/add-me-up/ListProfileForm";
import PointsPage from "./pages/add-me-up/Points";
import Profile from "./pages/add-me-up/Profile";
import AdvertisePage from "./pages/advertise/advertise/Advertise";
import EngagementTasks from "./pages/advertise/engagement-tasks/EngagementTasks";
import PostAdvertPage from "./pages/advertise/post-advert/PostAdvert";
import AdvertTaskPerformancePage from "./pages/advertise/AdvertTaskPerformance";
import AdvertTasksHistoryPage from "./pages/advertise/AdvertTasksHistory";
import EngagementTaskPerformancePage from "./pages/advertise/EngagementTaskPerformance";
import EngagementTasksHistoryPage from "./pages/advertise/EngagementTaskHistory";
import MembershipPage from "./pages/become-a-member/BecomeAMember";
import PaymentCallbackPage from "./pages/PaymentCallback";
import VerifyEmailPage from "./pages/VerifyEmail";
import ChangePasswordPage from "./pages/ChangePassword";
import ChoosePaymentMethodPage from "./pages/choose-online-payment-method/ChoosePaymentMethod";
import Dashboard from "./pages/dashboard/Dashboard";
import AdvertsPage from "./pages/earn/adverts/Adverts";
import AdvertsInfoPage from "./pages/earn/adverts/components/AdvertInfo";
import ConnectAccountsPage from "./pages/earn/connect-accounts/ConnectAccounts";
import Earn from "./pages/earn/earn/Earn";
import ResellPage from "./pages/earn/resell/Resell";
import TasksHistory from "./pages/earn/tasks-history/TasksHistory";
import TaskInfoPage from "./pages/earn/tasks/[id]/TaskInfo";
import Tasks from "./pages/earn/tasks/Tasks";
import EditProfilePage from "./pages/EditProfile";
import FundWalletPage from "./pages/fund-wallet/FundWallet";
import KycVerification from "./pages/kyc/KycVerification";
import KycVerificationForm from "./pages/kyc/KycVerificationForm";
import CartPage from "./pages/marketplace/Cart";
import CategoryPage from "./pages/marketplace/Category";
import SellerChat from "./pages/marketplace/Chat";
import ListProductPage from "./pages/marketplace/ListProduct";
import MarketplacePage from "./pages/marketplace/Marketplace";
import ProductCheckoutPage from "./pages/marketplace/ProductCheckout";
import ProductDashboardPage from "./pages/marketplace/ProductDashboard";
import ProductPerformancePage from "./pages/marketplace/ProductPerformance";
import SellerPage from "./pages/marketplace/Seller";
import SingleProductPage from "./pages/marketplace/SingleProduct";
import NotificationsPage from "./pages/Notifications";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import ReferAndEarnPage from "./pages/refer-and-earn/ReferAndEarn";
import SingleTransactionPage from "./pages/SingleTransaction";
import TermsPage from "./pages/Terms";
import TransactionsHistoryPage from "./pages/TransactionsHistory";
import UpdateBankDetailsPage from "./pages/UpdateBankDetails";
import UpdateLocationPage from "./pages/UpdateLocation";
import store from "./redux/store";
import updateUserApi from "./utils/updateUserApi";
import { listenForUserUpdates } from "./utils/realtimeUserListener";
import { useState, useEffect } from "react";
import { toast } from "sonner";


export default function App() {
	const [user, setUser] = useState<any>(null);

// Request Notification permission early (so the browser can prompt once)
useEffect(() => {
	if ("Notification" in window) {
		try {
			console.log("Notification permission at mount:", Notification.permission);
			if (Notification.permission === 'default') {
				Notification.requestPermission().then((p) => console.log('Notification permission result:', p));
			}
		} catch (e) {
			console.warn('Notification API not available or blocked', e);
		}
	}
}, []);

// 1️⃣ Load logged-in user once
useEffect(() => {
    updateUserApi().then(setUser);
}, []);

// 2️⃣ Start listening for realtime updates
useEffect(() => {
	if (!user?.id) return;

	// register listener and get cleanup function
	const cleanup = listenForUserUpdates(user.id, (ev) => {
		console.log('Realtime event received:', ev);
		console.log('Notification.permission before notify:', "Notification" in window ? Notification.permission : 'not-supported');
		try {
			const payload = ev.payload || {};
			// show a lightweight toast so users see it in-app
			const title = payload.title || (ev.type === 'wallet-updated' ? 'Wallet updated' : 'New notification');
			const body = payload.body || payload.message || '';

			toast(`${title}${body ? ` — ${body}` : ''}`);

			// Browser notification
			if ("Notification" in window) {
				if (Notification.permission === 'granted') {
					const notif = new Notification(title, { body, icon: payload.icon || '/images/logo192.png' });
					notif.onclick = () => {
						window.focus();
						// navigate to notifications page or payload.url
						const url = payload.url || '/notifications';
						window.location.href = url;
						notif.close();
					};
				} else if (Notification.permission !== 'denied') {
					Notification.requestPermission().then((permission) => {
						if (permission === 'granted') {
							const notif = new Notification(title, { body, icon: payload.icon || '/images/logo192.png' });
							notif.onclick = () => {
								window.focus();
								const url = payload.url || '/notifications';
								window.location.href = url;
								notif.close();
							};
						}
					});
				}
			}
		} catch (e) {
			console.error('Error handling realtime event', e);
		}
	});

	return () => {
		if (typeof cleanup === 'function') cleanup();
	};
}, [user?.id]);

	return (
		<HeroUIProvider>
			<Toaster richColors position="top-center" />
			<Provider store={store}>
				<BrowserRouter>
					<Routes>
						<Route element={<RootLayout />} path="*">
							<Route path="logout" element={<Logout />} />
							<Route index element={<Dashboard />} />
							<Route path="become-a-member" element={<MembershipPage />} />
							<Route
								path="choose-online-payment-method"
								element={<ChoosePaymentMethodPage />}
							/>
							<Route path="fund-wallet" element={<FundWalletPage />} />
							<Route path="edit-profile" element={<EditProfilePage />} />
							<Route
								path="update-bank-details"
								element={<UpdateBankDetailsPage />}
							/>
							<Route
								path="transactions-history"
								element={<TransactionsHistoryPage />}
							/>
							<Route
								path="transactions-history/:id"
								element={<SingleTransactionPage />}
							/>
							<Route path="change-password" element={<ChangePasswordPage />} />
							<Route path="update-location" element={<UpdateLocationPage />} />
							<Route path="notifications" element={<NotificationsPage />} />
							<Route path="terms" element={<TermsPage />} />
							<Route path="privacy-policy" element={<PrivacyPolicyPage />} />
							{/* Earn by reselling */}
							<Route path="earn" element={<Earn />} />
							<Route path="earn/tasks" element={<Tasks />} />
							<Route path="earn/tasks-history" element={<TasksHistory />} />
							<Route path="earn/tasks/:id" element={<TaskInfoPage />} />
							<Route path="earn/adverts" element={<AdvertsPage />} />
							<Route path="earn/adverts/:id" element={<AdvertsInfoPage/>} />
							<Route path="earn/resell" element={<ResellPage />} />
							<Route
								path="earn/connect-accounts"
								element={<ConnectAccountsPage />}
							/>
							{/* Marketplace */}
							<Route path="marketplace" element={<MarketplacePage />} />
							<Route
								path="marketplace/list-product"
								element={<ListProductPage />}
							/>
							<Route
								path="marketplace/c/:category"
								element={<CategoryPage />}
							/>
							<Route path="marketplace/p/:id" element={<SingleProductPage />} />
							<Route path="marketplace/s/:id" element={<SellerPage />} />
							<Route path="marketplace/cart" element={<CartPage />} />
							<Route path="marketplace/chat" element={<SellerChat />} />
							<Route
								path="marketplace/checkout/:id"
								element={<ProductCheckoutPage />}
							/>
							<Route
								path="marketplace/listings"
								element={<ProductDashboardPage />}
							/>
							<Route
								path="marketplace/performance"
								element={<ProductPerformancePage />}
							/>
							{/* Advertise */}
							<Route path="advertise" element={<AdvertisePage />} />
							<Route
								path="advertise/post-advert"
								element={<PostAdvertPage />}
							/>
							<Route
								path="advertise/engagement-tasks"
								element={<EngagementTasks />}
							/>
							<Route
								path="advertise/advert-tasks-history"
								element={<AdvertTasksHistoryPage />}
							/>
							<Route
								path="advertise/advert-task-performance/:id"
								element={<AdvertTaskPerformancePage />}
							/>
							<Route
								path="advertise/engagement-tasks-history"
								element={<EngagementTasksHistoryPage />}
							/>
							<Route
								path="advertise/engagement-task-performance/:id"
								element={<EngagementTaskPerformancePage />}
							/>
							{/* Add Me Up */}
							<Route path="add-me-up" element={<AddMeUp />} />
							<Route path="add-me-up/profile" element={<Profile />} />
							<Route path="add-me-up/list-profile" element={<ListProfile />} />
							<Route
								path="add-me-up/list-profile-form"
								element={<ListProfileForm />}
							/>
							<Route path="add-me-up/points" element={<PointsPage />} />
							{/* Refer and Earn */}
							<Route path="refer-and-earn" element={<ReferAndEarnPage />} />
							{/* KYC Verification */}
							<Route path="kyc" element={<KycVerification />} />
							<Route path="kyc/start" element={<KycVerificationForm />} />
							{/* Payment Callback */}
							<Route path="payment/callback" element={<PaymentCallbackPage />} />
							{/* VerifyEmail */}
							<Route path="VerifyEmail" element={<VerifyEmailPage />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</Provider>
		</HeroUIProvider>
	);
}
