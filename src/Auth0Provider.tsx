import React, { useContext, useEffect, useState } from "react";
import  { createAuth0Client,
  Auth0Client,
  Auth0ClientOptions,
  RedirectLoginOptions,
  RedirectLoginResult,
} from "@auth0/auth0-spa-js";

interface Auth0ProviderOptions {
  children?: React.ReactNode;
  onRedirectCallback?(result: RedirectLoginResult): void;
}

interface IUser {
  picture: string;
  name: string;
  email: string;
  [id: string]: any;
}

interface IAuth0Context {
  isAuthenticated: boolean;
  loginWithRedirect(options?: RedirectLoginOptions): Promise<void>;
  logout(): void;
  loading: boolean;
  user: IUser;
  popupOpen: boolean;
  loginWithPopup(...p: any[]): void;
  handleRedirectCallback(): Promise<void>;

  getIdTokenClaims(...p: any[]): void;
  getTokenSilently(...p: any[]): void;
  getTokenWithPopup(...p: any[]): void;
}

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

const Auth0Context = React.createContext<IAuth0Context>({
  isAuthenticated: false,
  loginWithRedirect: async (options?: RedirectLoginOptions) => {},
  logout: (...p: any[]) => {},
  loading: false,
  user: { picture: "", name: "", email: "" },
  popupOpen: false,
  loginWithPopup: () => {},
  handleRedirectCallback: async () => {},

  getIdTokenClaims: (...p: any[]) => {},
  getTokenSilently: (...p: any[]) => {},
  getTokenWithPopup: (...p: any[]) => {},
});

export const useAuth0 = () => useContext(Auth0Context);

export const Auth0Provider = ({
  children,
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  ...initOptions
}: Auth0ProviderOptions & Auth0ClientOptions) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser>({ picture: "", name: "", email: "" });
  const [auth0Client, setAuth0] = useState<Auth0Client>();
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook: Auth0Client = await createAuth0Client(initOptions);
      setAuth0(auth0FromHook);

      if (
        window.location.search.includes("code=") &&
        window.location.search.includes("state=")
      ) {
        const { appState } = await auth0FromHook.handleRedirectCallback();
        onRedirectCallback(appState);
      }

      const isAuthenticated: boolean = await auth0FromHook.isAuthenticated();

      setIsAuthenticated(isAuthenticated);

      if (isAuthenticated) {
        const user = await auth0FromHook.getUser();
        setUser(user);
      }

      setLoading(false);
    };
    initAuth0();
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    setPopupOpen(true);
    try {
      await auth0Client?.loginWithPopup(params);
    } catch (error) {
      console.error(error);
    } finally {
      setPopupOpen(false);
    }
    const user = await auth0Client!.getUser();

    setUser(user);
    setIsAuthenticated(true);
  };

  const handleRedirectCallback = async () => {
    setLoading(true);
    await auth0Client!.handleRedirectCallback();
    const user = await auth0Client!.getUser();
    setLoading(false);
    setIsAuthenticated(true);
    setUser(user);
  };

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        getIdTokenClaims: (...p: any[]) => auth0Client!.getIdTokenClaims(...p),
        loginWithRedirect: (...p: any[]) =>
          auth0Client!.loginWithRedirect(...p),
        getTokenSilently: (...p: any[]) => auth0Client!.getTokenSilently(...p),
        getTokenWithPopup: (...p: any[]) =>
          auth0Client!.getTokenWithPopup(...p),
        logout: (...p: any[]) => auth0Client!.logout(...p),
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};