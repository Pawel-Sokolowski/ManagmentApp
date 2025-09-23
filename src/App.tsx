import { Clock, Zap } from "lucide-react";
import { AutomaticInvoicing } from "./components/AutomaticInvoicing";
import { useState } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { BankIntegration } from "./components/BankIntegration";
import { ContractManagement } from "./components/ContractManagement";
import { ThemeToggle } from "./components/ThemeToggle";
import { ActiveTimerDisplay } from "./components/ActiveTimerDisplay";
import { Dashboard } from "./components/Dashboard";
import { NewClientForm } from "./components/NewClientForm";
import { ClientList } from "./components/ClientList";
import { ClientDetails } from "./components/ClientDetails";
import { TeamChat } from "./components/TeamChat";
import { EnhancedEmailCenter } from "./components/EnhancedEmailCenter";
import { EnhancedInvoiceManager } from "./components/EnhancedInvoiceManager";
import { AdvancedCalendar } from "./components/AdvancedCalendar";
import { UserManagement } from "./components/UserManagement";
import { InvoiceTemplates } from "./components/InvoiceTemplates";
import { EmailTemplates } from "./components/EmailTemplates";
import { UserProfileManagement } from "./components/UserProfileManagement";
import { DocumentManager } from "./components/DocumentManager";
import { MonthlyDataPanel } from "./components/MonthlyDataPanel";
import { SystemSettings } from "./components/SystemSettings";
import { TimeTracker } from "./components/TimeTracker";
import { Toaster } from "./components/ui/sonner";
import { LayoutDashboard, Users, UserPlus, MessageSquare, Mail, FileText, Settings, CalendarDays, UserCog, MailOpen, FolderOpen, BarChart3, CreditCard, ScrollText, Building2, Timer } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Client, User, EmailTemplate, Email } from "./types/client";

type View = 'dashboard' | 'clients' | 'add-client' | 'edit-client' | 'view-client' | 'chat' | 'email' | 'invoices' | 'calendar' | 'users' | 'email-templates' | 'invoice-templates' | 'profile' | 'documents' | 'monthly-data' | 'settings' | 'bank-integration' | 'contracts' | 'time-tracker' | 'auto-invoicing';

// Mock data - should be moved to separate file
import { mockClients } from "./data/mockClients";

const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Jan',
    lastName: 'Kowalski',
    email: 'jan.kowalski@firma.pl',
    role: 'administrator',
    isActive: true,
    permissions: []
  }
];

const initialEmails: Email[] = [
  {
    id: '1',
    from: 'jan.kowalski@abc.pl',
    to: ['biuro@firma.pl'],
    subject: 'Zapytanie o usługi księgowe',
    content: 'Dzień dobry,\n\nChciałbym zapytać o cennik usług księgowych dla mojej firmy. Czy moglibyście przesłać mi szczegółową ofertę?\n\nPozdrawiam,\nJan Kowalski\nABC Sp. z o.o.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    clientId: '1',
    folder: 'inbox',
    isStarred: false,
    isArchived: false,
    isDeleted: false
  },
  {
    id: '2',
    from: 'anna.nowak@xyz.pl',
    to: ['biuro@firma.pl'],
    subject: 'Miesięczne dokumenty księgowe',
    content: 'Witam,\n\nPrzesyłam dokumenty za listopad 2024. Wszystkie faktury i rachunki są w załączeniu.\n\nW razie pytań proszę o kontakt.\n\nPozdrawiam,\nAnna Nowak',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    attachments: [
      {
        id: '1',
        name: 'faktury_listopad_2024.pdf',
        size: 2048000,
        type: 'application/pdf',
        url: '#'
      }
    ],
    clientId: '2',
    folder: 'inbox',
    isStarred: true,
    isArchived: false,
    isDeleted: false
  },
  {
    id: '3',
    from: 'biuro@firma.pl',
    to: ['jan.kowalski@abc.pl'],
    subject: 'Re: Zapytanie o usługi księgowe',
    content: 'Dzień dobry,\n\nDziękuję za zapytanie. W załączeniu przesyłam szczegółową ofertę na usługi księgowe.\n\nOferta obejmuje:\n- Pełną obsługę księgową\n- Rozliczenia VAT\n- Sporządzanie deklaracji\n- Konsultacje podatkowe\n\nCena: 800 PLN miesięcznie\n\nPozdrawiam,\nTeam Firma',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    clientId: '1',
    folder: 'sent',
    isStarred: false,
    isArchived: false,
    isDeleted: false
  }
];

const mockEmailTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Oferta księgowa',
    subject: 'Oferta na usługi księgowe',
    content: 'Szanowni Państwo,\n\nW odpowiedzi na Państwa zapytanie, przesyłamy ofertę na kompleksową obsługę księgową.\n\nNasza oferta obejmuje:\n- Pełną obsługę księgową\n- Rozliczenia VAT\n- Sporządzanie deklaracji\n- Konsultacje podatkowe\n\nPozdrawiam,\n[Imię Nazwisko]'
  },
  {
    id: '2',
    name: 'Przypomnienie o płatności',
    subject: 'Przypomnienie o płatności faktury',
    content: 'Szanowni Państwo,\n\nUprzejmie przypominamy o płatności faktury nr [NUMER] z dnia [DATA].\n\nTermin płatności upłynął [LICZBA DNI] dni temu.\n\nProsimy o pilną regulację należności.\n\nPozdrawiam,\n[Imię Nazwisko]'
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser] = useState<User>(mockUsers[0]);
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);

  // Email management functions
  const addEmail = (email: Omit<Email, 'id'>) => {
    const newEmail: Email = {
      id: Date.now().toString(),
      ...email
    };
    setEmails(prev => [...prev, newEmail]);
    return newEmail;
  };

  const updateEmail = (emailId: string, updates: Partial<Email>) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, ...updates } : email
    ));
  };

  const deleteEmail = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, isDeleted: true, folder: 'trash' } : email
    ));
  };

  const handleSaveClient = (clientData: Partial<Client>) => {
    if (selectedClient) {
      // Update existing client
      setClients(prev => 
        prev.map(client => 
          client.id === selectedClient.id 
            ? { ...client, ...clientData }
            : client
        )
      );
      toast.success("Klient został zaktualizowany");
    } else {
      // Add new client
      const newClient: Client = {
        id: Date.now().toString(),
        ...clientData as Omit<Client, 'id'>
      };
      setClients(prev => [...prev, newClient]);
      toast.success("Nowy klient został dodany");
    }
    setCurrentView('clients');
    setSelectedClient(null);
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Czy na pewno chcesz usunąć tego klienta?')) {
      setClients(prev => prev.filter(client => client.id !== clientId));
      toast.success("Klient został usunięty pomyślnie");
    }
  };

  const handleViewClient = (client: Client) => {
    setSelectedClient(client);
    setCurrentView('view-client');
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setCurrentView('edit-client');
  };

  const handleAddClient = () => {
    setSelectedClient(null);
    setCurrentView('add-client');
  };

  const handleCancelForm = () => {
    setSelectedClient(null);
    setCurrentView('clients');
  };

  const handleBackToClients = () => {
    setSelectedClient(null);
    setCurrentView('clients');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard currentUser={currentUser} onNavigate={setCurrentView} />;
      case 'clients':
        return (
          <ClientList
            clients={clients}
            onViewClient={handleViewClient}
            onEditClient={handleEditClient}
            onDeleteClient={handleDeleteClient}
            onAddClient={handleAddClient}
          />
        );
      case 'add-client':
        return (
          <NewClientForm
            onSave={handleSaveClient}
            onCancel={handleCancelForm}
          />
        );
      case 'edit-client':
        return selectedClient ? (
          <NewClientForm
            client={selectedClient}
            onSave={handleSaveClient}
            onCancel={handleCancelForm}
          />
        ) : null;
      case 'view-client':
        return selectedClient ? (
          <ClientDetails
            client={selectedClient}
            onBack={handleBackToClients}
            onEdit={handleEditClient}
          />
        ) : null;
      case 'chat':
        return <TeamChat currentUser={currentUser} allUsers={users} />;
      case 'email':
        return (
          <EnhancedEmailCenter 
            clients={clients} 
            templates={emailTemplates}
            emails={emails}
            onSendEmail={addEmail}
            onUpdateEmail={updateEmail}
            onDeleteEmail={deleteEmail}
          />
        );
      case 'invoices':
        return <EnhancedInvoiceManager clients={clients} />;
      case 'calendar':
        return <AdvancedCalendar currentUser={currentUser} allUsers={users} />;
      case 'users':
        return <UserManagement />;
      case 'email-templates':
        return (
          <EmailTemplates 
            templates={emailTemplates}
            onSaveTemplate={(template) => {
              if (template.id) {
                setEmailTemplates(prev => prev.map(t => t.id === template.id ? template : t));
                toast.success("Szablon został zaktualizowany");
              } else {
                const newTemplate = { ...template, id: Date.now().toString() };
                setEmailTemplates(prev => [...prev, newTemplate]);
                toast.success("Nowy szablon został utworzony");
              }
            }}
            onDeleteTemplate={(templateId) => {
              setEmailTemplates(prev => prev.filter(t => t.id !== templateId));
              toast.success("Szablon został usunięty");
            }}
          />
        );
      case 'invoice-templates':
        return <InvoiceTemplates />;
      case 'profile':
        return (
          <UserProfileManagement 
            user={currentUser as any} 
            onSave={(updatedUser) => {
              setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...updatedUser } : u));
              toast.success("Profil został zaktualizowany");
            }}
            isAdmin={currentUser.role === 'administrator'}
          />
        );
      case 'documents':
        return <DocumentManager clients={clients} />;
      case 'monthly-data':
        return <MonthlyDataPanel clients={clients} />;
      case 'settings':
        return <SystemSettings />;
      case 'bank-integration':
        return <BankIntegration />;
      case 'contracts':
        return <ContractManagement />;
      case 'time-tracker':
        return <TimeTracker currentUser={currentUser} />;
      case 'auto-invoicing':
        return <AutomaticInvoicing clients={clients} />;
      default:
        return <Dashboard currentUser={currentUser} onNavigate={setCurrentView} />;
    }
  };

  const menuItems = [
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

  const communicationItems = [
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

  const businessItems = [
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

  const organizationItems = [
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

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Zarządzanie Klientami</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        onClick={item.onClick}
                        isActive={item.active}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Komunikacja</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {communicationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        onClick={item.onClick}
                        isActive={item.active}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Biznes</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {businessItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        onClick={item.onClick}
                        isActive={item.active}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Organizacja</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {organizationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        onClick={item.onClick}
                        isActive={item.active}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Ustawienia</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setCurrentView('profile')}
                      isActive={currentView === 'profile'}
                    >
                      <UserCog className="h-4 w-4" />
                      <span>Mój Profil</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => setCurrentView('settings')}
                      isActive={currentView === 'settings'}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Preferencje</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="border-b px-6 py-4 flex items-center justify-between">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <ActiveTimerDisplay onStartTimer={() => setCurrentView('time-tracker')} />
              <ThemeToggle />
            </div>
          </header>
          
          <div className="flex-1 overflow-auto p-6">
            {renderContent()}
          </div>
        </main>
      </div>
      
      <Toaster />
    </SidebarProvider>
  );
}