import React from "react";
import { usePageContext } from "./usePageContext";
import { useAppNavigate } from "./useAppNavigate";

/**
 * Higher Order Component to wrap pages and inject navigation props
 * This maintains backward compatibility with the old onNavigate pattern
 */
export function withPageProps<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WrappedComponent(props: Omit<P, 'onNavigate' | 'userRole' | 'onLogin' | 'onLogout'>) {
    const context = usePageContext();
    
    // Merge context with props
    const fullProps = {
      ...props,
      ...context,
    } as P;

    return <Component {...fullProps} />;
  };
}

/**
 * Hook-based alternative for functional components
 * Use this in the component itself instead of receiving props
 */
export function useNavigationProps() {
  const context = usePageContext();
  const { navigateTo, getPageData } = useAppNavigate();
  
  return {
    onNavigate: navigateTo,
    pageData: getPageData(),
    userRole: context.userRole,
    onLogin: context.onLogin,
    onLogout: context.onLogout,
  };
}
