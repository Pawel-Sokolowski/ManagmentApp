import { User } from "../types/client";

export const mockUsers: User[] = [
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