import { Dashboard } from "../components/Dashboard";
import { ClientList } from "../components/ClientList";
import { NewClientForm } from "../components/NewClientForm";
import { ClientDetails } from "../components/ClientDetails";
import { TeamChat } from "../components/TeamChat";
import { EnhancedEmailCenter } from "../components/EnhancedEmailCenter";
import { EnhancedInvoiceManager } from "../components/EnhancedInvoiceManager";
import { AdvancedCalendar } from "../components/AdvancedCalendar";
import { UserManagement } from "../components/UserManagement";
import { InvoiceTemplates } from "../components/InvoiceTemplates";
import { EmailTemplates } from "../components/EmailTemplates";
import { UserProfileManagement } from "../components/UserProfileManagement";
import { DocumentManager } from "../components/DocumentManager";
import { MonthlyDataPanel } from "../components/MonthlyDataPanel";
import { SystemSettings } from "../components/SystemSettings";
import { TimeTracker } from "../components/TimeTracker";
import { AutomaticInvoicing } from "../components/AutomaticInvoicing";
import { BankIntegration } from "../components/BankIntegration";
import { ContractManagement } from "../components/ContractManagement";

import { View } from "../hooks/useNavigation";
import { Client, User, EmailTemplate, Email } from "../types/client";

interface ContentRouterProps {
  currentView: View;
  currentUser: User;
  clients: Client[];
  selectedClient: Client | null;
  emails: Email[];
  emailTemplates: EmailTemplate[];
  onNavigate: (view: View) => void;
  onSaveClient: (clientData: Partial<Client>) => void;
  onDeleteClient: (clientId: string) => void;
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  addEmail: (email: Omit<Email, 'id'>) => Email;
  updateEmail: (emailId: string, updates: Partial<Email>) => void;
  deleteEmail: (emailId: string) => void;
}

export function ContentRouter({
  currentView,
  currentUser,
  clients,
  selectedClient,
  emails,
  emailTemplates,
  onNavigate,
  onSaveClient,
  onDeleteClient,
  onViewClient,
  onEditClient,
  addEmail,
  updateEmail,
  deleteEmail
}: ContentRouterProps) {
  switch (currentView) {
    case 'clients':
      return (
        <ClientList 
          clients={clients}
          onViewClient={onViewClient}
          onEditClient={onEditClient}
          onDeleteClient={onDeleteClient}
        />
      );
    case 'add-client':
    case 'edit-client':
      return (
        <NewClientForm 
          onSave={onSaveClient}
          onCancel={() => onNavigate('clients')}
          client={selectedClient}
        />
      );
    case 'view-client':
      return selectedClient ? (
        <ClientDetails 
          client={selectedClient}
          onEdit={() => onEditClient(selectedClient)}
          onBack={() => onNavigate('clients')}
        />
      ) : null;
    case 'chat':
      return <TeamChat />;
    case 'email':
      return (
        <EnhancedEmailCenter 
          emails={emails}
          clients={clients}
          templates={emailTemplates}
          onSendEmail={addEmail}
          onUpdateEmail={updateEmail}
          onDeleteEmail={deleteEmail}
        />
      );
    case 'invoices':
      return <EnhancedInvoiceManager clients={clients} />;
    case 'calendar':
      return <AdvancedCalendar clients={clients} />;
    case 'users':
      return <UserManagement />;
    case 'email-templates':
      return <EmailTemplates />;
    case 'invoice-templates':
      return <InvoiceTemplates />;
    case 'profile':
      return <UserProfileManagement currentUser={currentUser} />;
    case 'documents':
      return <DocumentManager />;
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
      return <Dashboard currentUser={currentUser} onNavigate={onNavigate} />;
  }
}