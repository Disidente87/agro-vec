export type UserRole = 
  | 'producer'      // Productores
  | 'technician'    // Técnicos/auditores
  | 'distributor'   // Distribuidores/Comerciantes
  | 'consumer'      // Consumidores (modo consulta)

export interface User {
  id: string
  address: string
  role: UserRole
  name?: string
  email?: string
  organization?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface LoginCredentials {
  address: string
  signature?: string
  message?: string
}

export interface RegisterData {
  address: string
  role: UserRole
  name: string
  email?: string
  organization?: string
  signature: string
  message: string
}

export interface WalletAuthData {
  address: string
  chainId: number
  isConnected: boolean
}

export interface RolePermissions {
  canCreateParcels: boolean
  canEditParcels: boolean
  canDeleteParcels: boolean
  canCreateEvents: boolean
  canEditEvents: boolean
  canDeleteEvents: boolean
  canCreateBatches: boolean
  canEditBatches: boolean
  canDeleteBatches: boolean
  canViewAllData: boolean
  canAudit: boolean
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  producer: {
    canCreateParcels: true,
    canEditParcels: true,
    canDeleteParcels: false,
    canCreateEvents: true,
    canEditEvents: true,
    canDeleteEvents: false,
    canCreateBatches: true,
    canEditBatches: true,
    canDeleteBatches: false,
    canViewAllData: false,
    canAudit: false,
  },
  technician: {
    canCreateParcels: false,
    canEditParcels: true,
    canDeleteParcels: false,
    canCreateEvents: true,
    canEditEvents: true,
    canDeleteEvents: false,
    canCreateBatches: false,
    canEditBatches: true,
    canDeleteBatches: false,
    canViewAllData: true,
    canAudit: true,
  },
  distributor: {
    canCreateParcels: false,
    canEditParcels: false,
    canDeleteParcels: false,
    canCreateEvents: false,
    canEditEvents: false,
    canDeleteEvents: false,
    canCreateBatches: true,
    canEditBatches: true,
    canDeleteBatches: false,
    canViewAllData: true,
    canAudit: false,
  },
  consumer: {
    canCreateParcels: false,
    canEditParcels: false,
    canDeleteParcels: false,
    canCreateEvents: false,
    canEditEvents: false,
    canDeleteEvents: false,
    canCreateBatches: false,
    canEditBatches: false,
    canDeleteBatches: false,
    canViewAllData: true,
    canAudit: false,
  },
}

export const ROLE_LABELS: Record<UserRole, string> = {
  producer: 'Productor',
  technician: 'Técnico/Auditor',
  distributor: 'Distribuidor/Comerciante',
  consumer: 'Consumidor',
}

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  producer: 'Puede crear y gestionar parcelas, eventos y lotes de sus productos',
  technician: 'Puede auditar y verificar toda la información del sistema',
  distributor: 'Puede gestionar lotes y ver información de trazabilidad',
  consumer: 'Puede consultar información de trazabilidad de productos',
} 