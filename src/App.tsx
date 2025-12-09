import { HeroUIProvider } from "@heroui/react";
import "material-icons/iconfont/material-icons.css";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router";
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
import ResellerConversionPage from "./pages/ResellerConversionsPage";
import store from "./redux/store";
import { useEffect, useState } from "react";
import getAuthUser from "./utils/getAuthUser";
import { listenForUserUpdates } from "./utils/realtimeUserListener";


// 🔒 Wrapper to protect ALL pages (custom rules included)
function AppAuthWrapper({ children }: { children: any }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Load user once
  useEffect(() => {
    getAuthUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  // Real-time updates
  useEffect(() => {
    if (!user?.id) return;
    listenForUserUpdates(user.id);
  }, [user?.id]);

  // Prevent redirect flicker
  if (loading) return null;

  // Paystack callback stays open
  if (location.pathname === "/payment/callback") return children;

  // User NOT logged in → check special reseller product route
  if (!user) {
    const params = new URLSearchParams(location.search);
    const reseller = params.get("reseller");

    // Match: /marketplace/p/:id
    const match = location.pathname.match(/^\/marketplace\/p\/(\d+)/);

    if (match && reseller) {
      const productId = match[1];

      // Redirect to the original reseller product URL
      return (
        <Navigate
          to={`https://hovertask.com/marketplace/product/${productId}?reseller=${reseller}`}
          replace
        />
      );
    }

    // Default redirect for all other unauthenticated pages
    return <Navigate to="https://hovertask.com/signin" replace />;
  }

  return children;
}



export default function App() {
  return (
    <HeroUIProvider>
      <Toaster richColors position="top-center" />
      <Provider store={store}>
        <BrowserRouter>
          <AppAuthWrapper>
            <Routes>
              <Route element={<RootLayout />} path="*">
                <Route path="logout" element={<Logout />} />
                <Route index element={<Dashboard />} />

                <Route path="become-a-member" element={<MembershipPage />} />
                <Route path="choose-online-payment-method" element={<ChoosePaymentMethodPage />} />
                <Route path="fund-wallet" element={<FundWalletPage />} />
                <Route path="edit-profile" element={<EditProfilePage />} />
                <Route path="update-bank-details" element={<UpdateBankDetailsPage />} />
                <Route path="transactions-history" element={<TransactionsHistoryPage />} />
                <Route path="transactions-history/:id" element={<SingleTransactionPage />} />
                <Route path="change-password" element={<ChangePasswordPage />} />
                <Route path="update-location" element={<UpdateLocationPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="privacy-policy" element={<PrivacyPolicyPage />} />

                {/* Earn */}
                <Route path="earn" element={<Earn />} />
                <Route path="earn/tasks" element={<Tasks />} />
                <Route path="earn/tasks-history" element={<TasksHistory />} />
                <Route path="earn/tasks/:id" element={<TaskInfoPage />} />
                <Route path="earn/adverts" element={<AdvertsPage />} />
                <Route path="earn/adverts/:id" element={<AdvertsInfoPage />} />
                <Route path="earn/resell" element={<ResellPage />} />
                <Route path="earn/connect-accounts" element={<ConnectAccountsPage />} />

                {/* Marketplace */}
                <Route path="marketplace" element={<MarketplacePage />} />
                <Route path="marketplace/list-product" element={<ListProductPage />} />
                <Route path="marketplace/c/:category" element={<CategoryPage />} />
                <Route path="marketplace/p/:id" element={<SingleProductPage />} />
                <Route path="marketplace/s/:id" element={<SellerPage />} />
                <Route path="marketplace/cart" element={<CartPage />} />
                <Route path="marketplace/chat" element={<SellerChat />} />
                <Route path="marketplace/checkout/:id" element={<ProductCheckoutPage />} />
                <Route path="marketplace/listings" element={<ProductDashboardPage />} />
                <Route path="marketplace/performance" element={<ProductPerformancePage />} />

                {/* Advertise */}
                <Route path="advertise" element={<AdvertisePage />} />
                <Route path="advertise/post-advert" element={<PostAdvertPage />} />
                <Route path="advertise/engagement-tasks" element={<EngagementTasks />} />
                <Route path="advertise/advert-tasks-history" element={<AdvertTasksHistoryPage />} />
                <Route path="advertise/advert-task-performance/:id" element={<AdvertTaskPerformancePage />} />
                <Route path="advertise/engagement-tasks-history" element={<EngagementTasksHistoryPage />} />
                <Route path="advertise/engagement-task-performance/:id" element={<EngagementTaskPerformancePage />} />

                {/* Add Me Up */}
                <Route path="add-me-up" element={<AddMeUp />} />
                <Route path="add-me-up/profile" element={<Profile />} />
                <Route path="add-me-up/list-profile" element={<ListProfile />} />
                <Route path="add-me-up/list-profile-form" element={<ListProfileForm />} />
                <Route path="add-me-up/points" element={<PointsPage />} />

                {/* Refer */}
                <Route path="refer-and-earn" element={<ReferAndEarnPage />} />

                {/* KYC */}
                <Route path="kyc" element={<KycVerification />} />
                <Route path="kyc/start" element={<KycVerificationForm />} />

                {/* Callback MUST remain open */}
                <Route path="payment/callback" element={<PaymentCallbackPage />} />

                {/* Verify Email */}
                <Route path="VerifyEmail" element={<VerifyEmailPage />} />
                <Route path="reseller-conversion" element={<ResellerConversionPage />} />
              </Route>
            </Routes>
          </AppAuthWrapper>
        </BrowserRouter>
      </Provider>
    </HeroUIProvider>
  );
}
