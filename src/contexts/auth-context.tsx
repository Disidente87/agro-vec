"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react"
import { useAccount, useSignMessage } from "wagmi"
import { AuthState, User, UserRole, LoginCredentials, RegisterData, ROLE_PERMISSIONS } from "@/types/auth"

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
  const { address, isConnected } = useAccount()
  const { signMessageAsync } = useSignMessage()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const session = localStorage.getItem('agro-session')
      if (session && address) {
        try {
          const userData = JSON.parse(session)
          if (userData.address === address) {
            dispatch({ type: 'SET_USER', payload: userData })
          } else {
            localStorage.removeItem('agro-session')
          }
        } catch (error) {
          localStorage.removeItem('agro-session')
        }
      }
    }

    checkSession()
  }, [address])

  const signMessage = async (): Promise<string | null> => {
    if (!address) return null

    try {
      const message = `Agro-bootcamp Authentication\n\nAddress: ${address}\nTimestamp: ${Date.now()}\n\nPlease sign this message to authenticate with Agro-bootcamp.`
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
      // In a real app, you would verify the signature on the server
      // For now, we'll simulate authentication
      const mockUser: User = {
        id: credentials.address,
        address: credentials.address,
        role: 'consumer', // Default role, would be fetched from server
        name: 'Usuario',
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }

      // Store session
      localStorage.setItem('agro-session', JSON.stringify(mockUser))
      
      dispatch({ type: 'SET_USER', payload: mockUser })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al iniciar sesión' })
    }
  }

  const register = async (data: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // In a real app, you would send this to your server
      // For now, we'll simulate registration
      const newUser: User = {
        id: data.address,
        address: data.address,
        role: data.role,
        name: data.name,
        email: data.email,
        organization: data.organization,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      }

      // Store session
      localStorage.setItem('agro-session', JSON.stringify(newUser))
      
      dispatch({ type: 'SET_USER', payload: newUser })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al registrarse' })
    }
  }

  const logout = () => {
    localStorage.removeItem('agro-session')
    dispatch({ type: 'LOGOUT' })
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