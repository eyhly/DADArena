// import React, { useState, useEffect, useContext, ReactNode } from 'react';
// import  { Auth0Client, createAuth0Client, GetTokenSilentlyOptions, LogoutOptions, PopupLoginOptions, RedirectLoginOptions } from "@auth0/auth0-spa-js";
// import { useNavigate } from 'react-router-dom';

// // const DEFAULT_REDIRECT_CALLBACK = () => 
// //     window.history.replaceState({}, document.title, window.location.pathname);

// interface Auth0ContextInterface {
//     isAuthenticated: boolean | undefined;
//     user: any;
//     loading: boolean;
//     popupOpen: boolean;
//     loginWithPopup: (params?: PopupLoginOptions) => Promise<void>;
//     handleRedirectCallback: () => Promise<void>;
//     getIdTokenClaims: (p?: GetTokenSilentlyOptions) => Promise<any>;
//     loginWithRedirect: (p?: RedirectLoginOptions) => Promise<void>;
//     getTokenSilently: (p?: GetTokenSilentlyOptions) => Promise<string | undefined>;
//     logout: (p?: LogoutOptions) => void;
// }

// export const Auth0Context = React.createContext<Auth0ContextInterface >();
// export const useAuth0 = () => {
//     const context = useContext(Auth0Context);
//     if (!context) {
//         throw new Error('useAuth0 must be used within an Auth0Provider');
//     }
//     return context;
// };

// interface Auth0ProviderProps {
//     children: ReactNode;
//     onRedirectCallback?: (appState?: any) => void;
//     domain: string;
//     clientId: string;
//     redirectUri?: string;
//     audience?: string;
//     scope?: string;
// }

// export const Auth0Provider: React.FC<Auth0ProviderProps> = ({
//     children,
//     onRedirectCallback,
//     ...initOptions
// }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
//     const [user, setUser] = useState(undefined);
//     const [auth0Client, setAuth0] = useState<Auth0Client | null>();  // Perbaikan tipe awal
//     const [loading, setLoading] = useState(true);
//     const [popupOpen, setPopupOpen] = useState(false);
//     // const navigate = useNavigate();

//     useEffect(() => {
//         const initAuth0 = async () => {
//             const auth0FromHook = await createAuth0Client(initOptions);
//             console.log(auth0FromHook,  'auth0FromHook');

            
//             setAuth0(auth0FromHook);

//             if (window.location.search.includes("code=")) {
//                 const { appState } = await auth0FromHook.handleRedirectCallback();
//                 onRedirectCallback(appState);
//             }

//             const isAuthenticated = await auth0FromHook.isAuthenticated();
//             setIsAuthenticated(isAuthenticated);

//             if (isAuthenticated) {
//                 const user = await auth0FromHook.getUser();
//                 setUser(user);
//             }

//             setLoading(false);
//         };
//         initAuth0();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const loginWithPopup = async (params: PopupLoginOptions = {}) => {
//         setPopupOpen(true);
//         try {
//             await auth0Client?.loginWithPopup(params);  
//         } catch (error) {
//             console.error(error);
//         } finally {
//             setPopupOpen(false);
//         }
//         const user = await auth0Client?.getUser();
//         setUser(user);
//         setIsAuthenticated(true);
//     };

//     const handleRedirectCallback = async () => {
//         setLoading(true);
//         await auth0Client?.handleRedirectCallback();  
//         const user = await auth0Client?.getUser();
//         setLoading(false);
//         setIsAuthenticated(true);
//         setUser(user);
//     };

//     return (
//       <Auth0Context.Provider
//         value={{
//             isAuthenticated,
//             user,
//             loading,
//             popupOpen,
//             loginWithPopup,
//             handleRedirectCallback,
//             getIdTokenClaims: (...p) => auth0Client?.getIdTokenClaims(...p) || Promise.resolve(undefined),
//             loginWithRedirect: (...p) => auth0Client?.loginWithRedirect(...p) || Promise.resolve(),
//             getTokenSilently: (...p) => auth0Client?.getTokenSilently(...p) || Promise.resolve(undefined),
//             logout: (...p) => auth0Client?.logout(...p),
//         }}
//       >
//         {children}
//       </Auth0Context.Provider>
//     );
// };
