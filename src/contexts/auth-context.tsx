"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react"
import { useAccount, useSignMessage } from "wagmi"
import { AuthState, User, LoginCredentials, RegisterData, ROLE_PERMISSIONS } from "@/types/auth"
import { AuthService } from "@/services/auth-service"

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  signMessage: () => Promise<string | null>
  hasPermission: (permission: keyof typeof ROLE_PERMISSIONS.producer) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' }

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true, 
        error: null,
        isLoading: false 
      }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        error: null,
        isLoading: false 
      }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      try {
        const user = await AuthService.getCurrentUser()
        if (user) {
          dispatch({ type: 'SET_USER', payload: user })
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkSession()

    // Listen to auth state changes
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      if (user) {
        dispatch({ type: 'SET_USER', payload: user })
      } else {
        dispatch({ type: 'LOGOUT' })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signMessage = async (): Promise<string | null> => {
    if (!address) {
      return null
    }

    try {
      const message = 'Agro-bootcamp Authentication'
      
      const signature = await signMessageAsync({ message })
      
      return signature
    } catch (error) {
      console.error('Error signing message:', error)
      return null
    }
  }

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const signature = await signMessage()
      if (!signature) {
        throw new Error('Failed to sign message')
      }

      const { user, error } = await AuthService.signInWithWallet(
        credentials.address,
        signature,
        credentials.message || 'Agro-bootcamp Authentication'
      )

      if (error) {
        throw error
      }

      if (user) {
        const userProfile = await AuthService.getCurrentUser()
        if (userProfile) {
          dispatch({ type: 'SET_USER', payload: userProfile })
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
    }
  }

  const register = async (data: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const signature = await signMessage()
      
      if (!signature) {
        throw new Error('Failed to sign message')
      }

      const { user, error } = await AuthService.registerUser({
        ...data,
        signature,
        message: data.message || 'Agro-bootcamp Authentication'
      })

      if (error) {
        throw error
      }

      if (user) {
        const userProfile = await AuthService.getCurrentUser()
        if (userProfile) {
          dispatch({ type: 'SET_USER', payload: userProfile })
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al registrarse'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
    }
  }

  const logout = async () => {
    try {
      await AuthService.signOut()
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const hasPermission = (permission: keyof typeof ROLE_PERMISSIONS.producer): boolean => {
    if (!state.user) return false
    return ROLE_PERMISSIONS[state.user.role][permission]
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    signMessage,
    hasPermission,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 