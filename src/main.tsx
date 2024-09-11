import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Auth0Provider } from '@auth0/auth0-react';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 5, retryDelay: 1000 } },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
    domain="dev-08mdbfkrg8246q7h.us.auth0.com"
    clientId="pYDU7vndPB3zvW4ENs7AUiQFnnhIA1xJ"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "http://192.168.54.12:5000/api",
      scope: "openid profile email"
    }}
  >
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);
