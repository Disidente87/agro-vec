import { getSupabaseClient } from '@/lib/supabase'
import { User, RegisterData } from '@/types/auth'

// SHA-256 hash function compatible with browser and Node
async function shortHash(input: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    // Browser: use SubtleCrypto
    // This is async, but we need sync for this use case
    // For now, fallback to sync hash
  }
  // Node.js or fallback: use crypto-browserify (should be installed)
  // If not available, fallback to a simple hash (not cryptographically secure)
  try {
    const crypto = await import('crypto')
    return crypto.createHash('sha256').update(input).digest('hex').slice(0, 32)
  } catch {
    // Fallback: simple hash (not secure, but avoids crash)
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      hash = ((hash << 5) - hash) + input.charCodeAt(i)
      hash |= 0
    }
    return Math.abs(hash).toString(16).padStart(16, '0').slice(0, 16)
  }
}

// Verify Ethereum signature using viem
async function verifySignature(address: string, signature: string, message: string): Promise<boolean> {
  try {
    // Import viem for signature verification
    const { recoverMessageAddress } = await import('viem')
    
    // Ensure signature has 0x prefix
    const signatureWithPrefix = signature.startsWith('0x') ? signature : `0x${signature}`
    
    // Recover the address from the signature
    const recoveredAddress = await recoverMessageAddress({
      message,
      signature: signatureWithPrefix as `0x${string}`
    })
    
    // Check if the recovered address matches the claimed address
    return recoveredAddress.toLowerCase() === address.toLowerCase()
  } catch (error) {
    console.error('Error verifying signature:', error)
    return false
  }
}

// Local storage keys
const STORAGE_KEYS = {
  USER_SESSION: 'agro_bootcamp_user_session',
  WALLET_ADDRESS: 'agro_bootcamp_wallet_address'
}

// Session interface
interface UserSession {
  user: User
  signature: string
  message: string
  timestamp: number
}

export class AuthService {
  // Sign in with wallet (no Supabase Auth, just profile lookup)
  static async signInWithWallet(address: string, signature: string, message: string) {
    try {
      // Verify the signature first
      const isValidSignature = await verifySignature(address, signature, message)
      if (!isValidSignature) {
        throw new Error('Invalid signature')
      }

      const supabase = getSupabaseClient()
      
      // Look for existing profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('address', address.toLowerCase())
        .single()

      if (error) {
        // Profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          return this.createUserWithWallet(address, signature, message)
        }
        throw error
      }

      // Profile exists, create user object
      const user: User = {
        id: profile.id,
        address: profile.address,
        role: profile.role,
        name: profile.name || undefined,
        email: profile.email || undefined,
        organization: profile.organization || undefined,
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at),
        isActive: true,
      }

      // Store session in localStorage
      const session: UserSession = {
        user,
        signature,
        message,
        timestamp: Date.now()
      }
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session))
      localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address.toLowerCase())

      return { user, error: null }
    } catch (error) {
      console.error('Error signing in with wallet:', error)
      return { user: null, error }
    }
  }

  // Create new user with wallet (insert into profiles table)
  static async createUserWithWallet(address: string, signature: string, message: string) {
    try {
      const supabase = getSupabaseClient()
      
      // Create new profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .insert({
          address: address.toLowerCase(),
          role: 'consumer', // Default role
          name: 'Usuario',
        })
        .select()
        .single()

      if (error) throw error

      // Create user object
      const user: User = {
        id: profile.id,
        address: profile.address,
        role: profile.role,
        name: profile.name || undefined,
        email: profile.email || undefined,
        organization: profile.organization || undefined,
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at),
        isActive: true,
      }

      // Store session in localStorage
      const session: UserSession = {
        user,
        signature,
        message,
        timestamp: Date.now()
      }
      localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session))
      localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address.toLowerCase())

      return { user, error: null }
    } catch (error) {
      console.error('Error creating user with wallet:', error)
      return { user: null, error }
    }
  }

  // Register user with role and additional data
  static async registerUser(data: RegisterData) {
    try {
      const message = data.message || 'Agro-bootcamp Authentication'
      
      // Verify the signature first
      const isValidSignature = await verifySignature(data.address, data.signature, message)
      
      if (!isValidSignature) {
        throw new Error('Invalid signature')
      }

      const supabase = getSupabaseClient()
      
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('address', data.address.toLowerCase())
        .single()

      if (existingProfile) {
        // Update existing profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .update({
            role: data.role,
            name: data.name,
            email: data.email,
            organization: data.organization,
          })
          .eq('address', data.address.toLowerCase())
          .select()
          .single()

        if (error) throw error

        const user: User = {
          id: profile.id,
          address: profile.address,
          role: profile.role,
          name: profile.name || undefined,
          email: profile.email || undefined,
          organization: profile.organization || undefined,
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at),
          isActive: true,
        }

        // Store session in localStorage
        const session: UserSession = {
          user,
          signature: data.signature,
          message: data.message || 'Agro-bootcamp Authentication',
          timestamp: Date.now()
        }
        localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session))
        localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, data.address.toLowerCase())

        return { user, error: null }
      } else {
        // Create new profile
        const { data: profile, error } = await supabase
          .from('profiles')
          .insert({
            address: data.address.toLowerCase(),
            role: data.role,
            name: data.name,
            email: data.email,
            organization: data.organization,
          })
          .select()
          .single()

        if (error) throw error

        const user: User = {
          id: profile.id,
          address: profile.address,
          role: profile.role,
          name: profile.name || undefined,
          email: profile.email || undefined,
          organization: profile.organization || undefined,
          createdAt: new Date(profile.created_at),
          updatedAt: new Date(profile.updated_at),
          isActive: true,
        }

        // Store session in localStorage
        const session: UserSession = {
          user,
          signature: data.signature,
          message: data.message || 'Agro-bootcamp Authentication',
          timestamp: Date.now()
        }
        localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session))
        localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, data.address.toLowerCase())

        return { user, error: null }
      }
    } catch (error) {
      console.error('Error registering user:', error)
      return { user: null, error }
    }
  }

  // Get current user from localStorage
  static async getCurrentUser(): Promise<User | null> {
    try {
      const sessionStr = localStorage.getItem(STORAGE_KEYS.USER_SESSION)
      if (!sessionStr) return null

      const session: UserSession = JSON.parse(sessionStr)
      
      // Check if session is still valid (24 hours)
      const now = Date.now()
      const sessionAge = now - session.timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours

      if (sessionAge > maxAge) {
        // Session expired, clear it
        this.signOut()
        return null
      }

      // Verify signature is still valid (optional security check)
      const isValidSignature = await verifySignature(session.user.address, session.signature, session.message)
      if (!isValidSignature) {
        this.signOut()
        return null
      }

      return session.user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  // Sign out (clear localStorage)
  static async signOut() {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_SESSION)
      localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS)
      return { error: null }
    } catch (error) {
      console.error('Error signing out:', error)
      return { error }
    }
  }

  // Update user profile
  static async updateProfile(updates: Partial<User>) {
    try {
      const currentUser = await this.getCurrentUser()
      if (!currentUser) throw new Error('No authenticated user')

      const supabase = getSupabaseClient()
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          email: updates.email,
          organization: updates.organization,
          role: updates.role,
        })
        .eq('id', currentUser.id)
        .select()
        .single()

      if (error) throw error

      // Update localStorage session
      const sessionStr = localStorage.getItem(STORAGE_KEYS.USER_SESSION)
      if (sessionStr) {
        const session: UserSession = JSON.parse(sessionStr)
        session.user = {
          ...session.user,
          ...updates,
          updatedAt: new Date()
        }
        localStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session))
      }

      return { data: profile, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }
  }

  // Listen to auth state changes (simulated with localStorage events)
  static onAuthStateChange(callback: (user: User | null) => void) {
    // Check initial state
    this.getCurrentUser().then(callback)

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.USER_SESSION) {
        if (e.newValue) {
          try {
            const session: UserSession = JSON.parse(e.newValue)
            callback(session.user)
          } catch {
            callback(null)
          }
        } else {
          callback(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Return subscription object (for compatibility)
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            window.removeEventListener('storage', handleStorageChange)
          }
        }
      }
    }
  }
} 