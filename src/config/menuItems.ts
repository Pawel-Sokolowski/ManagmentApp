import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  MessageSquare, 
  Mail, 
  FileText, 
  Settings, 
  CalendarDays, 
  UserCog, 
  MailOpen, 
  FolderOpen, 
  BarChart3, 
  CreditCard, 
  ScrollText, 
  Building2, 
  Timer,
  Zap
} from "lucide-react";
import { View } from "../hooks/useNavigation";

export interface MenuItem {
  title: string;
  icon: any;
  onClick: () => void;
  active: boolean;
}

export function getMenuItems(currentView: View, setCurrentView: (view: View) => void, handleAddClient: () => void) {
  const menuItems: MenuItem[] = [
    {
      title: "Panel Główny",
      icon: LayoutDashboard,
      onClick: () => setCurrentView('dashboard'),
      active: currentView === 'dashboard'
    },
    {
      title: "Wszyscy Klienci",
      icon: Users,
      onClick: () => setCurrentView('clients'),
      active: currentView === 'clients'
    },
    {
      title: "Dodaj Klienta",
      icon: UserPlus,
      onClick: () => handleAddClient(),
      active: currentView === 'add-client'
    },
    {
      title: "Dokumenty",
      icon: FolderOpen,
      onClick: () => setCurrentView('documents'),
      active: currentView === 'documents'
    },
    {
      title: "Dane Miesięczne",
      icon: BarChart3,
      onClick: () => setCurrentView('monthly-data'),
      active: currentView === 'monthly-data'
    }
  ];

  const communicationItems: MenuItem[] = [
    {
      title: "Chat Zespołowy",
      icon: MessageSquare,
      onClick: () => setCurrentView('chat'),
      active: currentView === 'chat'
    },
    {
      title: "Centrum Email",
      icon: Mail,
      onClick: () => setCurrentView('email'),
      active: currentView === 'email'
    },
    {
      title: "Kalendarz",
      icon: CalendarDays,
      onClick: () => setCurrentView('calendar'),
      active: currentView === 'calendar'
    }
  ];

  const businessItems: MenuItem[] = [
    {
      title: "Faktury",
      icon: FileText,
      onClick: () => setCurrentView('invoices'),
      active: currentView === 'invoices'
    },
    {
      title: "Automatyczne Faktury",
      icon: Zap,
      onClick: () => setCurrentView('auto-invoicing'),
      active: currentView === 'auto-invoicing'
    },
    {
      title: "Szablony Faktur",
      icon: ScrollText,
      onClick: () => setCurrentView('invoice-templates'),
      active: currentView === 'invoice-templates'
    },
    {
      title: "Integracja Bankowa",
      icon: CreditCard,
      onClick: () => setCurrentView('bank-integration'),
      active: currentView === 'bank-integration'
    },
    {
      title: "Zarządzanie Kontraktami",
      icon: Building2,
      onClick: () => setCurrentView('contracts'),
      active: currentView === 'contracts'
    }
  ];

  const organizationItems: MenuItem[] = [
    {
      title: "Raport Czasu Pracy",
      icon: Timer,
      onClick: () => setCurrentView('time-tracker'),
      active: currentView === 'time-tracker'
    },
    {
      title: "Zarządzanie Personelem",
      icon: UserCog,
      onClick: () => setCurrentView('users'),
      active: currentView === 'users'
    },
    {
      title: "Szablony Email",
      icon: MailOpen,
      onClick: () => setCurrentView('email-templates'),
      active: currentView === 'email-templates'
    }
  ];

  const settingsItems: MenuItem[] = [
    {
      title: "Mój Profil",
      icon: UserCog,
      onClick: () => setCurrentView('profile'),
      active: currentView === 'profile'
    },
    {
      title: "Preferencje",
      icon: Settings,
      onClick: () => setCurrentView('settings'),
      active: currentView === 'settings'
    }
  ];

  return {
    menuItems,
    communicationItems,
    businessItems,
    organizationItems,
    settingsItems
  };
}