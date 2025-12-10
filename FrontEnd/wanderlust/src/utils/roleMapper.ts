/**
 * Role Mapping Utilities
 * 
 * Backend uses: USER, VENDOR, ADMIN
 * Frontend uses: user, admin, vendor
 * 
 * This file provides consistent role mapping between backend and frontend.
 */

export type FrontendRole = "user" | "admin" | "vendor";
export type BackendRole = "USER" | "VENDOR" | "ADMIN";

/**
 * Maps backend role to frontend role
 * Backend VENDOR → Frontend vendor
 * Backend ADMIN → Frontend admin
 * Backend USER → Frontend user
 */
export function mapBackendRoleToFrontend(backendRole: string | undefined | null): FrontendRole {
  if (!backendRole) return 'user';
  
  const roleUpper = backendRole.toUpperCase();
  switch (roleUpper) {
    case 'ADMIN':
      return 'admin';
    case 'VENDOR':
      return 'vendor'; // Backend VENDOR = Frontend vendor
    case 'USER':
    default:
      return 'user';
  }
}

/**
 * Maps frontend role to backend role
 * Frontend vendor → Backend VENDOR
 * Frontend admin → Backend ADMIN
 * Frontend user → Backend USER
 */
export function mapFrontendRoleToBackend(frontendRole: FrontendRole): BackendRole {
  switch (frontendRole) {
    case 'admin':
      return 'ADMIN';
    case 'vendor':
      return 'VENDOR'; // Frontend vendor = Backend VENDOR
    case 'user':
    default:
      return 'USER';
  }
}

/**
 * Checks if user has admin privileges
 */
export function isAdmin(role: FrontendRole | null | undefined): boolean {
  return role === 'admin';
}

/**
 * Checks if user has vendor/partner privileges
 */
export function isVendor(role: FrontendRole | null | undefined): boolean {
  return role === 'vendor';
}

/**
 * Checks if user is regular user
 */
export function isUser(role: FrontendRole | null | undefined): boolean {
  return role === 'user';
}

/**
 * Get display name for role
 */
export function getRoleDisplayName(role: FrontendRole): string {
  switch (role) {
    case 'admin':
      return 'Administrator';
    case 'vendor':
      return 'Vendor/Partner';
    case 'user':
    default:
      return 'User';
  }
}
