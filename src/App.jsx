import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx";
import { useAuthStore } from "./store/authStore.js";
import { meApi } from "./api/auth.api.js";

function App() {
  const accessToken = useAuthStore(function (s) { return s.accessToken; });
  const setAuth = useAuthStore(function (s) { return s.setAuth; });
  const logout = useAuthStore(function (s) { return s.logout; });

  useEffect(function () {
    if (!accessToken) return;
    meApi()
      .then(function (res) {
        setAuth({ user: res.data.data, accessToken });
      })
      .catch(function () {
        logout();
      });
  }, []);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
