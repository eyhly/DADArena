import {User, UserManager} from 'oidc-client-ts'
import { authConfig } from '../configs/auth'
import { hasAuthParams } from '../utils/hasAuthParams'
import { useMutation, UseMutationOptions, useQuery } from '@tanstack/react-query'

const mgr = new UserManager(authConfig)

export const queryKeySignInRedirect = (redirect?: string) => [
    'auth',
    {navigator: 'signInRedirect', redirect},
]

export const queryFn = async ({queryKey}) => {
    let user: User | null = null
    let isAuthenticated = false

    try {
        if (hasAuthParams()){
            user = await mgr.signinRedirectCallback()
            isAuthenticated = true

            //bentar kayaknya ini salah 
            window.history.replaceState({}, document.title, window.location.pathname);

          } else {
            await mgr.signinRedirect({url_state: queryKey[1].redirect})
        }
    } catch (error) {
        console.error('signinRedirect error', error)
        isAuthenticated = false
    }

    return{
        isAuthenticated,
        user,
    }
}

export function useSigninRedirect() {
    return useQuery({
        queryKey: queryKeySignInRedirect(),
        queryFn,
    })
}

export const queryKeyRemoveUser = () => ['auth', {navigator: 'removeUser'}]
export const mutationFnRemoveUser = async () => {
    try {
        await mgr.removeUser()
    } catch (error) {
        console.error('signinRedirect error', error)
    }
}

export function useRemoveUser(mutationOptions: UseMutationOptions = {}) {
    return useMutation({
        mutationFn: mutationFnRemoveUser,
        ...mutationOptions,
    })
}

export const queryKeySignInSilent = ['auth', {navigator: 'signInSilent'}]
export const queryFnSignInSilent = async () => {
  mgr.events.addAccessTokenExpiring(async () => {
    console.log('token expiring')

    try {
      const user = await mgr.signinSilent()
      console.log('silent renew success', user)
    } catch (e) {
      console.log('silent renew error', e.message)
    }
    // maybe do this code manually if automaticSilentRenew doesn't work for you
  })
}

export function useSignInSilent() {
  return useQuery({
    queryKey: queryKeySignInSilent,
    queryFn: queryFnSignInSilent,
  })
}

export const queryKeySignOutRedirect = ['auth', {navigator: 'signOutRedirect'}]
export const queryMutationSignOutRedirect = async () => {
  try {
    await mgr.signoutRedirect()
  } catch (error) {
    console.error('signoutRedirect error', error)
  }
}

export function useSignOutRedirect() {
  return useMutation({
    mutationKey: queryKeySignOutRedirect,
    mutationFn: queryMutationSignOutRedirect,
  })
}

export interface AuthState {

  user?: User | null

  isAuthenticated: boolean

  activeNavigator?:
    | 'signinRedirect'
    | 'signinResourceOwnerCredentials'
    | 'signinPopup'
    | 'signinSilent'
    | 'signoutRedirect'
    | 'signoutPopup'
    | 'signoutSilent'


  error?: Error
}

export const queryKeyAuthState = ['auth']
export const queryFnAuthState = async (): Promise<AuthState> => {
  const user = await mgr.getUser()

  return {
    user,
    isAuthenticated: !!user || false,
  }
}

export function useAuthState() {
  return useQuery({
    queryKey: queryKeyAuthState,
    queryFn: queryFnAuthState,
  })
}
