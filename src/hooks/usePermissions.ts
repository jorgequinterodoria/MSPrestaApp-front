import { useAuthStore } from '../store/authStore';
import { PERMISSIONS } from '../types';

export function usePermissions() {
  const user = useAuthStore((state) => state.user);

  const can = (action: string, resource: string): boolean => {
    if (!user) return false;
    
    const userPermissions = PERMISSIONS[user.role] || [];
    return userPermissions.some(
      (permission) =>
        permission.action === action &&
        permission.resource === resource &&
        permission.allowed
    );
  };

  return { can };
}