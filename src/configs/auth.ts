import {UserManagerSettings} from 'oidc-client-ts'

export const authConfig: UserManagerSettings = {
    authority: import.meta.env.VITE_AUTH0_DOMAIN,
    client_id:  import.meta.env.VITE_AUTH0_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
    client_secret: import.meta.env.VITE_AUTH0_CLIENT_SECRET,
    post_logout_redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid profile email',

    automaticSilentRenew: true,
    validateSubOnSilentRenew: true,

    loadUserInfo: false,

    monitorAnonymousSession: true,

    filterProtocolClaims: true,
    revokeTokensOnSignout: true,
}