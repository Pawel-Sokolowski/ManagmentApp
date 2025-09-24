import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { ThemeToggle } from "./components/ThemeToggle";
import { ActiveTimerDisplay } from "./components/ActiveTimerDisplay";
import { Login } from "./components/Login";
import { Toaster } from "./components/ui/sonner";
import { AppSidebar } from "./components/AppSidebar";
import { ContentRouter } from "./components/ContentRouter";

// Hooks
import { useNavigation } from "./hooks/useNavigation";
import { useClientManagement } from "./hooks/useClientManagement";
import { useEmailManagement } from "./hooks/useEmailManagement";

// Data
import { mockUsers } from "./data/mockUsers";
import { mockEmailTemplates } from "./data/mockEmailTemplates";

// Types
import { User, EmailTemplate, Client } from "./types/client";

export default function App() {
  const { currentView, setCurrentView } = useNavigation();
  const { 
    clients, 
    selectedClient, 
    handleSaveClient, 
    handleDeleteClient, 
    handleViewClient, 
    handleEditClient, 
    handleAddClient, 
    setSelectedClient 
  } = useClientManagement();
  const { emails, addEmail, updateEmail, deleteEmail } = useEmailManagement();
  
  const [users] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [emailTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);

  // If not logged in, show login screen
  if (!currentUser) {
    return (
      <>
        <Login onLogin={setCurrentUser} />
        <Toaster />
      </>
    );
  }

  // Handle navigation events
  const handleNavigationSaveClient = (clientData: Partial<Client>) => {
    handleSaveClient(clientData);
    setCurrentView('clients');
  };

  const handleNavigationViewClient = (client: Client) => {
    handleViewClient(client);
    setCurrentView('view-client');
  };

  const handleNavigationEditClient = (client: Client) => {
    handleEditClient(client);
    setCurrentView('edit-client');
  };

  const handleNavigationAddClient = () => {
    handleAddClient();
    setCurrentView('add-client');
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar 
          currentView={currentView}
          setCurrentView={setCurrentView}
          handleAddClient={handleNavigationAddClient}
        />
        
        <main className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between p-4 border-b bg-background">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <ActiveTimerDisplay />
              <ThemeToggle />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-6">
            <ContentRouter
              currentView={currentView}
              currentUser={currentUser}
              clients={clients}
              selectedClient={selectedClient}
              emails={emails}
              emailTemplates={emailTemplates}
              onNavigate={setCurrentView}
              onSaveClient={handleNavigationSaveClient}
              onDeleteClient={handleDeleteClient}
              onViewClient={handleNavigationViewClient}
              onEditClient={handleNavigationEditClient}
              addEmail={addEmail}
              updateEmail={updateEmail}
              deleteEmail={deleteEmail}
            />
          </div>
        </main>
      </div>
      
      <Toaster />
    </SidebarProvider>
  );
}