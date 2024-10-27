// import React from "react";
// import ReactDOM from "react-dom";
// import history from "./utils/history";
// import App from "./App";
// import { Auth0Provider } from "./auth0";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// // const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
// const rootElement = document.getElementById("root");

// const queryClient = new QueryClient({
//   defaultOptions: { queries: { retry: 5, retryDelay: 1000 } },
// });

// const onRedirectCallback = (appState: any) => {
//   history.push(
//     appState && appState.targetUrl
//       ? appState.targetUrl
//       : window.location.pathname
//   );
// };

//     ReactDOM.render(
//       <React.StrictMode>  
//         <Auth0Provider
//           domain={import.meta.env.VITE_AUTH0_DOMAIN}
//           clientId="ClLkMpCvnDMhkOIkEoIXWtuc0iQT1uQ1"
//           audience={import.meta.env.VITE_AUTH0_AUDIENCE}
//           redirectUri={import.meta.env.VITE_API_REDIRECT_URI}
//           // onRedirectCallback={onRedirectCallback}
//         >
//           <QueryClientProvider client={queryClient}>

//             <App />
//           </QueryClientProvider>
//         </Auth0Provider>,
//       </React.StrictMode>,
//         rootElement
//       );
