import { useState } from "react";
import { Client } from "../types/client";
import { mockClients } from "../data/mockClients";
import { toast } from "sonner@2.0.3";

export function useClientManagement() {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

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
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
  };

  const handleAddClient = () => {
    setSelectedClient(null);
  };

  return {
    clients,
    selectedClient,
    handleSaveClient,
    handleDeleteClient,
    handleViewClient,
    handleEditClient,
    handleAddClient,
    setSelectedClient
  };
}