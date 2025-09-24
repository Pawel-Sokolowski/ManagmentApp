import { useState } from "react";

export type View = 'dashboard' | 'clients' | 'add-client' | 'edit-client' | 'view-client' | 'chat' | 'email' | 'invoices' | 'calendar' | 'users' | 'email-templates' | 'invoice-templates' | 'profile' | 'documents' | 'monthly-data' | 'settings' | 'bank-integration' | 'contracts' | 'time-tracker' | 'auto-invoicing';

export function useNavigation() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  return {
    currentView,
    setCurrentView
  };
}