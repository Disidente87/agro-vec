"use client"

import { useAuth } from "@/contexts/auth-context"
import { ROLE_PERMISSIONS, ROLE_LABELS } from "@/types/auth"

export function PermissionDebug() {
  const { user, isAuthenticated, hasPermission } = useAuth()

  if (!isAuthenticated || !user) {
    return null
  }

  const userPermissions = ROLE_PERMISSIONS[user.role]

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <h3 className="font-bold mb-2">Debug: {ROLE_LABELS[user.role]}</h3>
      <div className="space-y-1">
        <div>canCreateParcels: {hasPermission('canCreateParcels') ? '✅' : '❌'}</div>
        <div>canEditParcels: {hasPermission('canEditParcels') ? '✅' : '❌'}</div>
        <div>canCreateEvents: {hasPermission('canCreateEvents') ? '✅' : '❌'}</div>
        <div>canEditEvents: {hasPermission('canEditEvents') ? '✅' : '❌'}</div>
        <div>canCreateBatches: {hasPermission('canCreateBatches') ? '✅' : '❌'}</div>
        <div>canEditBatches: {hasPermission('canEditBatches') ? '✅' : '❌'}</div>
        <div>canViewAllData: {hasPermission('canViewAllData') ? '✅' : '❌'}</div>
      </div>
    </div>
  )
} 