"use client"

import { useState } from "react"
import { useAccount, useConnect, useDisconnect } from "wagmi"
import { useAuth } from "@/contexts/auth-context"
import { UserRole, ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/types/auth"
import { XMarkIcon, WalletIcon, UserIcon } from "@heroicons/react/24/outline"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>('consumer')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
  })
  const [emailError, setEmailError] = useState('')

  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { login, register, signMessage, isLoading, error } = useAuth()

  const handleLogin = async () => {
    if (!address) return

    const signature = await signMessage()
    if (signature) {
      await login({
        address,
        signature,
        message: 'Agro-bootcamp Authentication'
      })
      onClose()
    }
  }

  const handleRegister = async () => {
    if (!address || !formData.name) return

    // Validate email if provided
    if (formData.email && !isValidEmail(formData.email)) {
      setEmailError('Por favor ingresa un email válido')
      return
    }

    const signature = await signMessage()
    if (signature) {
      await register({
        address,
        role: selectedRole,
        name: formData.name,
        email: formData.email || undefined,
        organization: formData.organization || undefined,
        signature,
        message: 'Agro-bootcamp Registration'
      })
      onClose()
    }
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear email error when user starts typing
    if (field === 'email') {
      setEmailError('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-green-800">
            {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Wallet Connection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <WalletIcon className="w-5 h-5 mr-2" />
              Conectar Wallet
            </h3>
            
            {!isConnected ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Conecta tu wallet de Base para continuar
                </p>
                <div className="space-y-2">
                  {connectors.map((connector) => (
                    <button
                      key={connector.uid}
                      onClick={() => connect({ connector })}
                      className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                    >
                      Conectar {connector.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Wallet conectada:</strong>
                  </p>
                  <p className="text-xs text-green-700 font-mono break-all">
                    {address}
                  </p>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="w-full px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                >
                  Desconectar
                </button>
              </div>
            )}
          </div>

          {/* Registration Form */}
          {isConnected && isRegistering && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <UserIcon className="w-5 h-5 mr-2" />
                Información del Usuario
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Tu nombre completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${
                      emailError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="tu@email.com"
                  />
                  {emailError && (
                    <p className="text-sm text-red-600 mt-1">{emailError}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Organización
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => handleFormChange('organization', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                    placeholder="Nombre de tu organización"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Selecciona tu rol *
                </label>
                <div className="space-y-2">
                  {(['producer', 'technician', 'distributor', 'consumer'] as UserRole[]).map((role) => (
                    <label key={role} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={selectedRole === role}
                        onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                        className="mt-1 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {ROLE_LABELS[role]}
                        </p>
                        <p className="text-xs text-gray-600">
                          {ROLE_DESCRIPTIONS[role]}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          {isConnected && (
            <div className="space-y-3">
              {isRegistering ? (
                <button
                  onClick={handleRegister}
                  disabled={isLoading || !formData.name || Boolean(emailError)}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {isLoading ? 'Registrando...' : 'Registrarse'}
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              )}

              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="w-full px-4 py-2 text-sm text-green-600 border border-green-300 rounded-lg hover:bg-green-50"
              >
                {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿Nuevo usuario? Regístrate'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 