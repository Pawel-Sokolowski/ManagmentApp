import { useState } from "react";
import { Email } from "../types/client";
import { initialEmails } from "../data/mockEmails";

export function useEmailManagement() {
  const [emails, setEmails] = useState<Email[]>(initialEmails);

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

  return {
    emails,
    addEmail,
    updateEmail,
    deleteEmail
  };
}