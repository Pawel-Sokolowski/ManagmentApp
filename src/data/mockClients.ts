import { Client } from '../types/client';

// Funkcja pomocnicza do generowania ukrytych tagów
function generateHiddenTags(businessType: string, taxType: string, accountingType: string, zusType: string): string[] {
  return [
    `business_${businessType}`,
    `tax_${taxType}`,
    `accounting_${accountingType}`,
    `zus_${zusType}`
  ];
}

// Funkcja pomocnicza do generowania folderów mailowych
function generateEmailFolders(companyName: string, businessType: string): string[] {
  const cleanCompanyName = companyName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
  
  if (businessType === 'dzialalnoscGospodarcza') {
    return [cleanCompanyName];
  } else {
    const suffix = businessType === 'spZoo' ? '_sp_z_o_o' : 
                  businessType === 'komandytowa' ? '_sp_k' :
                  businessType === 'akcyjna' ? '_sa' :
                  businessType === 'fundacja' ? '_fundacja' :
                  businessType === 'stowarzyszenie' ? '_stowarzyszenie' : '';
    return [cleanCompanyName + suffix];
  }
}

export const mockClients: Client[] = [
  {
    id: '1',
    firstName: 'Jan',
    lastName: 'Kowalski',
    emails: ['jan.kowalski@firma.pl', 'jkowalski@gmail.com'],
    phone: '+48 123 456 789',
    companyName: 'Tech Solutions Sp. z o.o.',
    position: 'Prezes Zarządu',
    nip: '1234567890',
    regon: '123456789',
    krs: '0000123456',
    address: {
      street: 'ul. Biznesowa 123',
      city: 'Warszawa',
      state: 'mazowieckie',
      zipCode: '00-001',
      country: 'Polska'
    },
    status: 'aktualny',
    dateAdded: '2024-01-15',
    lastContact: '2024-12-01',
    notes: 'Zainteresowany pakietem premium. Wymaga kontynuacji.',
    additionalInfo: 'Klient premium, duża firma technologiczna z międzynarodowymi kontraktami',
    businessType: 'spZoo',
    taxType: 'cit',
    accountingType: 'pelneKsiegi',
    zusType: 'pelnyZus',
    zusInfo: {
      startDate: '2024-01-01',
      calculatedEndDate: '2025-01-01',
      healthInsurance: true,
      zusCode: '521',
      reminderDate: '2024-12-20',
      nextPaymentDate: '2025-01-15'
    },
    owners: [
      {
        id: '1',
        firstName: 'Jan',
        lastName: 'Kowalski',
        pesel: '80010112345',
        share: 60,
        role: 'prezes',
        email: 'jan.kowalski@firma.pl',
        phone: '+48 123 456 789'
      },
      {
        id: '2',
        firstName: 'Anna',
        lastName: 'Kowalska',
        share: 40,
        role: 'wspolnik',
        email: 'anna.kowalska@firma.pl'
      }
    ],
    ksefEnabled: true,
    ksefToken: 'ksef_token_123',
    emailTemplates: [],
    employeeCount: 25,
    emailFolders: generateEmailFolders('Tech Solutions', 'spZoo'),
    communicationEmails: [
      {
        id: '1',
        email: 'jan.kowalski@firma.pl',
        contactPerson: { firstName: 'Jan', lastName: 'Kowalski' },
        isPrimary: true,
        sendTaxNotifications: true,
        purpose: 'general'
      }
    ],
    invoiceEmail: 'faktura@firma.pl',
    taxNotificationEmails: ['podatki@firma.pl'],
    hiddenTags: generateHiddenTags('spZoo', 'cit', 'pelneKsiegi', 'pelnyZus')
  },
  {
    id: '2',
    firstName: 'Anna',
    lastName: 'Nowak',
    emails: ['anna.nowak@creative.pl'],
    phone: '+48 987 654 321',
    companyName: 'Creative Designs Sp. z o.o.',
    position: 'Dyrektor Artystyczny',
    nip: '9876543210',
    address: {
      street: 'ul. Designerska 456',
      city: 'Kraków',
      state: 'małopolskie',
      zipCode: '30-001',
      country: 'Polska'
    },
    status: 'potencjalny',
    dateAdded: '2024-11-20',
    notes: 'Potencjalna współpraca przy projektach kreatywnych.',
    additionalInfo: 'Specjalizuje się w projektowaniu graficznym i brandingu',
    businessType: 'spZoo',
    taxType: 'liniowy',
    accountingType: 'kpir',
    zusType: 'malyZus',
    zusInfo: {
      startDate: '2024-11-01',
      calculatedEndDate: '2025-05-01',
      healthInsurance: true,
      zusCode: '510',
      reminderDate: '2025-04-20',
      nextPaymentDate: '2025-01-15'
    },
    owners: [
      {
        id: '3',
        firstName: 'Anna',
        lastName: 'Nowak',
        share: 100,
        role: 'wlasciciel',
        email: 'anna.nowak@creative.pl',
        phone: '+48 987 654 321'
      }
    ],
    ksefEnabled: false,
    emailTemplates: [],
    employeeCount: 8,
    emailFolders: generateEmailFolders('Creative Designs', 'spZoo'),
    communicationEmails: [
      {
        id: '2',
        email: 'anna.nowak@creative.pl',
        contactPerson: { firstName: 'Anna', lastName: 'Nowak' },
        isPrimary: true,
        sendTaxNotifications: true,
        purpose: 'general'
      }
    ],
    invoiceEmail: 'anna.nowak@creative.pl',
    taxNotificationEmails: ['anna.nowak@creative.pl'],
    hiddenTags: generateHiddenTags('spZoo', 'liniowy', 'kpir', 'malyZus')
  },
  {
    id: '3',
    firstName: 'Piotr',
    lastName: 'Wiśniewski',
    emails: ['piotr.wisniewski@startup.pl', 'kontakt@startup.pl', 'p.wisniewski@gmail.com'],
    phone: '+48 456 789 012',
    companyName: 'Startup Innovations',
    position: 'Założyciel',
    nip: '4567890123',
    regon: '456789012',
    address: {
      street: 'ul. Innowacyjna 789',
      city: 'Gdańsk',
      state: 'pomorskie',
      zipCode: '80-001',
      country: 'Polska'
    },
    status: 'aktualny',
    dateAdded: '2024-02-28',
    lastContact: '2024-11-28',
    notes: 'Stały klient, comiesięczne spotkania konsultacyjne.',
    additionalInfo: 'Działalność gospodarcza, startup technologiczny, branża IT',
    businessType: 'dzialalnoscGospodarcza',
    taxType: 'ryczalt',
    accountingType: 'ryczaltEwidencyjny',
    zusType: 'malyZus',
    zusInfo: {
      startDate: '2024-02-01',
      calculatedEndDate: '2024-08-01',
      healthInsurance: true,
      zusCode: '510',
      reminderDate: '2024-07-20',
      nextPaymentDate: '2025-01-15'
    },
    owners: [
      {
        id: '4',
        firstName: 'Piotr',
        lastName: 'Wiśniewski',
        share: 100,
        role: 'wlasciciel',
        email: 'piotr.wisniewski@startup.pl',
        phone: '+48 456 789 012'
      }
    ],
    ksefEnabled: true,
    emailTemplates: [],
    employeeCount: 1,
    emailFolders: generateEmailFolders('Startup Innovations', 'dzialalnoscGospodarcza'),
    communicationEmails: [
      {
        id: '3',
        email: 'piotr.wisniewski@startup.pl',
        contactPerson: { firstName: 'Piotr', lastName: 'Wiśniewski' },
        isPrimary: true,
        sendTaxNotifications: true,
        purpose: 'general'
      }
    ],
    invoiceEmail: 'piotr.wisniewski@startup.pl',
    taxNotificationEmails: ['piotr.wisniewski@startup.pl'],
    hiddenTags: generateHiddenTags('dzialalnoscGospodarcza', 'ryczalt', 'ryczaltEwidencyjny', 'malyZus')
  },
  {
    id: '4',
    firstName: 'Magdalena',
    lastName: 'Kowalczyk',
    emails: ['m.kowalczyk@oldcompany.pl'],
    phone: '+48 321 654 987',
    companyName: 'Old Company Sp. z o.o.',
    position: 'Była Prezes',
    nip: '3216549870',
    address: {
      street: 'ul. Zamknięta 15',
      city: 'Łódź',
      state: 'łódzkie',
      zipCode: '90-001',
      country: 'Polska'
    },
    status: 'archiwalny',
    dateAdded: '2022-05-10',
    lastContact: '2023-12-01',
    notes: 'Firma została zlikwidowana. Kontakt utrzymywany dla celów archiwalnych.',
    additionalInfo: 'Firma zlikwidowana, archiwalna dokumentacja',
    businessType: 'spZoo',
    taxType: 'cit',
    accountingType: 'pelneKsiegi',
    zusType: 'other',
    zusTypeOther: 'Firma zlikwidowana',
    zusInfo: {
      startDate: '2022-05-01',
      calculatedEndDate: '2023-05-01',
      healthInsurance: false
    },
    owners: [
      {
        id: '5',
        firstName: 'Magdalena',
        lastName: 'Kowalczyk',
        share: 100,
        role: 'wlasciciel',
        email: 'm.kowalczyk@oldcompany.pl',
        phone: '+48 321 654 987'
      }
    ],
    ksefEnabled: false,
    emailTemplates: [],
    employeeCount: 0,
    emailFolders: generateEmailFolders('Old Company', 'spZoo'),
    communicationEmails: [
      {
        id: '4',
        email: 'm.kowalczyk@oldcompany.pl',
        contactPerson: { firstName: 'Magdalena', lastName: 'Kowalczyk' },
        isPrimary: true,
        sendTaxNotifications: false,
        purpose: 'general'
      }
    ],
    invoiceEmail: 'm.kowalczyk@oldcompany.pl',
    taxNotificationEmails: [],
    hiddenTags: generateHiddenTags('spZoo', 'cit', 'pelneKsiegi', 'other')
  }
];