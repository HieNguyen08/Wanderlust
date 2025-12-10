import { useOutletContext } from "react-router-dom";
import { PageType } from "../MainApp";
import { FrontendRole } from "../utils/roleMapper";

/**
 * Context type for all pages
 */
export interface PageContext {
  onNavigate: (page: PageType, data?: any) => void;
  userRole: FrontendRole | null;
  onLogin: (role: FrontendRole) => void;
  onLogout: () => void;
}

/**
 * Hook to access the page context
 */
export function usePageContext() {
  return useOutletContext<PageContext>();
}
