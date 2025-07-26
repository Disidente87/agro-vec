"use client"

import { useAuth } from "@/contexts/auth-context"
import { ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_PERMISSIONS } from "@/types/auth"
import { ProtectedRoute } from "@/components/protected-route"
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return (
      <ProtectedRoute>
        <div>Loading...</div>
      </ProtectedRoute>
    )
  }

  const userPermissions = ROLE_PERMISSIONS[user.role]

  const permissionItems = [
    { key: 'canCreateParcels', label: 'Crear Parcelas', description: 'Puede crear nuevas parcelas agrícolas' },
    { key: 'canEditParcels', label: 'Editar Parcelas', description: 'Puede modificar información de parcelas' },
    { key: 'canDeleteParcels', label: 'Eliminar Parcelas', description: 'Puede eliminar parcelas del sistema' },
    { key: 'canCreateEvents', label: 'Crear Eventos', description: 'Puede registrar eventos en la bitácora' },
    { key: 'canEditEvents', label: 'Editar Eventos', description: 'Puede modificar eventos existentes' },
    { key: 'canDeleteEvents', label: 'Eliminar Eventos', description: 'Puede eliminar eventos del sistema' },
    { key: 'canCreateBatches', label: 'Crear Lotes', description: 'Puede generar nuevos lotes trazables' },
    { key: 'canEditBatches', label: 'Editar Lotes', description: 'Puede modificar información de lotes' },
    { key: 'canDeleteBatches', label: 'Eliminar Lotes', description: 'Puede eliminar lotes del sistema' },
    { key: 'canViewAllData', label: 'Ver Todos los Datos', description: 'Puede acceder a toda la información del sistema' },
    { key: 'canAudit', label: 'Auditar', description: 'Puede realizar auditorías y verificaciones' },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-green-50 p-4 pt-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8 text-white">
              <h1 className="text-3xl font-bold mb-2">👤 Perfil de Usuario</h1>
              <p className="text-green-100">Información de tu cuenta y permisos</p>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Personal</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nombre</label>
                      <p className="text-gray-900">{user.name}</p>
                    </div>
                    {user.email && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                    )}
                    {user.organization && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Organización</label>
                        <p className="text-gray-900">{user.organization}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de Wallet</h2>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Dirección de Wallet</label>
                      <p className="text-sm font-mono text-gray-900 break-all">{user.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Rol</label>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          {ROLE_LABELS[user.role]}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Descripción del Rol</label>
                      <p className="text-sm text-gray-700">{ROLE_DESCRIPTIONS[user.role]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Permisos y Accesos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {permissionItems.map((item) => {
                  const hasPermission = userPermissions[item.key as keyof typeof userPermissions]
                  return (
                    <div
                      key={item.key}
                      className={`p-4 rounded-lg border ${
                        hasPermission 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                          hasPermission ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {hasPermission ? (
                            <CheckIcon className="w-4 h-4 text-green-600" />
                          ) : (
                            <XMarkIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-sm font-medium ${
                            hasPermission ? 'text-green-900' : 'text-gray-500'
                          }`}>
                            {item.label}
                          </h3>
                          <p className={`text-xs mt-1 ${
                            hasPermission ? 'text-green-700' : 'text-gray-400'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Información</h3>
                <p className="text-sm text-blue-700">
                  Los permisos están determinados por tu rol en el sistema. Si necesitas accesos adicionales, 
                  contacta al administrador del sistema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 