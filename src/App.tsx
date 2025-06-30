import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import RootLayout from "./components/Layout";
import store from "./redux/store";
import "./App.css";
import "material-icons/iconfont/material-icons.css";
import { HeroUIProvider } from "@heroui/react";
import { Toaster } from "sonner";
import ChangePasswordPage from "./pages/ChangePassword";
import EditProfilePage from "./pages/EditProfile";
import NotificationsPage from "./pages/Notifications";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import SingleTransactionPage from "./pages/SingleTransaction";
import TermsPage from "./pages/Terms";
import TransactionsHistoryPage from "./pages/TransactionsHistory";
import UpdateBankDetailsPage from "./pages/UpdateBankDetails";
import UpdateLocationPage from "./pages/UpdateLocation";
import AddMeUp from "./pages/add-me-up/AddMeUp";
import ListProfile from "./pages/add-me-up/ListProfile";
import ListProfileForm from "./pages/add-me-up/ListProfileForm";
import PointsPage from "./pages/add-me-up/Points";
import Profile from "./pages/add-me-up/Profile";
import AdvertisePage from "./pages/advertise/Advertise";
import EngagementTasks from "./pages/advertise/EngagementTasks";
import PostAdvertPage from "./pages/advertise/PostAdvert";
import TaskPerformancePage from "./pages/advertise/TaskPerformance";
import TasksHistoryPage from "./pages/advertise/TasksHistory";
import MembershipPage from "./pages/become-a-member/BecomeAMember";
import ChoosePaymentMethodPage from "./pages/choose-online-payment-method/ChoosePaymentMethod";
import Dashboard from "./pages/dashboard/Dashboard";
import AdvertsPage from "./pages/earn/adverts/Adverts";
import ConnectAccountsPage from "./pages/earn/ConnectAccounts";
import Earn from "./pages/earn/earn/Earn";
import ResellPage from "./pages/earn/Resell";
import TaskInfoPage from "./pages/earn/TaskInfo";
import Tasks from "./pages/earn/tasks/Tasks";
import FundWalletPage from "./pages/fund-wallet/FundWallet";
import KycVerification from "./pages/kyc/KycVerification";
import KycVerificationForm from "./pages/kyc/KycVerificationForm";
import CartPage from "./pages/marketplace/Cart";
import CategoryPage from "./pages/marketplace/Category";
import SellerChat from "./pages/marketplace/Chat";
import ListProductPage from "./pages/marketplace/ListProduct";
import MarketplacePage from "./pages/marketplace/Marketplace";
import ProductCheckoutPage from "./pages/marketplace/ProductCheckout";
import ProductListingsPage from "./pages/marketplace/ProductListings";
import ProductPerformancePage from "./pages/marketplace/ProductPerformance";
import SellerPage from "./pages/marketplace/Seller";
import SingleProductPage from "./pages/marketplace/SingleProduct";
import ReferAndEarnPage from "./pages/refer-and-earn/ReferAndEarn";
import TasksHistory from "./pages/earn/TasksHistory";

export default function App() {
	return (
		<HeroUIProvider>
			<Toaster richColors position="top-center" />
			<Provider store={store}>
				<BrowserRouter>
					<Routes>
						<Route element={<RootLayout />} path="*">
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
								element={<ProductListingsPage />}
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
								path="advertise/tasks-history"
								element={<TasksHistoryPage />}
							/>
							<Route
								path="advertise/task-performance/:id"
								element={<TaskPerformancePage />}
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
						</Route>
					</Routes>
				</BrowserRouter>
			</Provider>
		</HeroUIProvider>
	);
}
