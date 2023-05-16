import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Layout = lazy(() => import("./components/Shared/layout"));
const RequireAuth = lazy(() => import("./components/Route/RequireAuth"));
const PersistLogin = lazy(() => import("./components/Route/PersistLogin"));
const Chat = lazy(() => import("./pages/Chat"));
const SocialLogin = lazy(() =>
  import("./components/Route/RedirectSocialLogin")
);
const Login = lazy(() => import("./pages/Login"));
const Call = lazy(() => import("./pages/Call"));
const InitComet = lazy(() => import("./components/Shared/InitComet"));
const Loading = lazy(() => import("./components/Shared/Loading"));
const AccountDetails = lazy(() => import("./pages/AccountDetails"));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route path="/login" element={<Login />} />
          <Route
            path="/:type/:id/:username/:accessToken"
            element={<SocialLogin />}
          />
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route element={<InitComet />}>
                <Route path="/" element={<Home />} />
                <Route path="/chat/:cuid" element={<Chat />} />
                <Route path="/call/:type/:cuid" element={<Call />} />
                <Route path="/account" element={<AccountDetails />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
