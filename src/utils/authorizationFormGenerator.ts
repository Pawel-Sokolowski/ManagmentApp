import jsPDF from 'jspdf';
import { Client, User } from '../types/client';
import { UPL1PdfFiller } from './upl1PdfFiller';
import { TaxFormService } from './taxFormService';

// Form type definitions with complexity levels
export type FormType = 
  // Authorization forms (existing)
  | 'UPL-1' | 'PEL'
  // Simple forms - basic client + employee info
  | 'ZAW-FA'
  // Tax forms - comprehensive client data
  | 'PIT-36' | 'PIT-37' | 'PIT-4R' | 'PIT-11'
  // VAT forms
  | 'VAT-7' | 'VAT-7K' | 'VAT-R' | 'VAT-UE'
  // CIT forms
  | 'CIT-8'
  // ZUS forms
  | 'ZUS-DRA' | 'ZUS-RCA' | 'ZUS-ZWUA' | 'ZUS-RMUA'
  // JPK files
  | 'JPK_VAT' | 'JPK_FA' | 'JPK_KR';

export type FormComplexity = 'simple' | 'medium' | 'complex';

export type FormCategory = 
  | 'pelnomocnictwa'
  | 'pit'
  | 'vat'
  | 'cit'
  | 'zus'
  | 'jpk'
  | 'inne';

export interface FormMetadata {
  type: FormType;
  name: string;
  description: string;
  complexity: FormComplexity;
  category: FormCategory;
  requiredFields: string[];
  optionalFields: string[];
}

interface AuthorizationFormData {
  client: Client;
  employee: User;
  formType: FormType;
  additionalData?: {
    period?: string; // e.g., "01/2024"
    year?: string;
    taxOffice?: string;
    accountNumber?: string;
    [key: string]: any;
  };
}


// Form metadata registry
export const FORM_METADATA: Record<FormType, FormMetadata> = {
  // Authorization forms
  'UPL-1': {
    type: 'UPL-1',
    name: 'UPL-1',
    description: 'Pełnomocnictwo do Urzędu Skarbowego',
    complexity: 'simple',
    category: 'pelnomocnictwa',
    requiredFields: ['firstName', 'lastName', 'nip'],
    optionalFields: ['companyName', 'regon', 'address']
  },
  'PEL': {
    type: 'PEL',
    name: 'PEL',
    description: 'Pełnomocnictwo do ZUS',
    complexity: 'simple',
    category: 'pelnomocnictwa',
    requiredFields: ['firstName', 'lastName', 'nip'],
    optionalFields: ['companyName', 'regon', 'address']
  },
  
  // Simple forms
  'ZAW-FA': {
    type: 'ZAW-FA',
    name: 'ZAW-FA',
    description: 'Zawiadomienie o wyborze formy opodatkowania',
    complexity: 'simple',
    category: 'inne',
    requiredFields: ['firstName', 'lastName', 'nip'],
    optionalFields: ['companyName', 'address']
  },
  
  // PIT forms - complex
  'PIT-36': {
    type: 'PIT-36',
    name: 'PIT-36',
    description: 'Zeznanie roczne od przychodów z działalności gospodarczej',
    complexity: 'complex',
    category: 'pit',
    requiredFields: ['firstName', 'lastName', 'nip', 'pesel', 'address', 'taxOffice'],
    optionalFields: ['regon', 'companyName', 'bankAccount', 'phone', 'email']
  },
  'PIT-37': {
    type: 'PIT-37',
    name: 'PIT-37',
    description: 'Zeznanie roczne o wysokości osiągniętego dochodu',
    complexity: 'complex',
    category: 'pit',
    requiredFields: ['firstName', 'lastName', 'nip', 'pesel', 'address', 'taxOffice'],
    optionalFields: ['spouse', 'children', 'bankAccount']
  },
  'PIT-4R': {
    type: 'PIT-4R',
    name: 'PIT-4R',
    description: 'Zeznanie roczne o zryczałtowanym podatku dochodowym',
    complexity: 'medium',
    category: 'pit',
    requiredFields: ['firstName', 'lastName', 'nip', 'address'],
    optionalFields: ['regon', 'companyName', 'pkd']
  },
  'PIT-11': {
    type: 'PIT-11',
    name: 'PIT-11',
    description: 'Informacja o dochodach wypłaconych osobom fizycznym',
    complexity: 'medium',
    category: 'pit',
    requiredFields: ['companyName', 'nip', 'address'],
    optionalFields: ['regon', 'email']
  },
  
  // VAT forms
  'VAT-7': {
    type: 'VAT-7',
    name: 'VAT-7',
    description: 'Deklaracja VAT miesięczna',
    complexity: 'medium',
    category: 'vat',
    requiredFields: ['firstName', 'lastName', 'nip', 'address'],
    optionalFields: ['companyName', 'regon', 'email']
  },
  'VAT-7K': {
    type: 'VAT-7K',
    name: 'VAT-7K',
    description: 'Deklaracja VAT kwartalna',
    complexity: 'medium',
    category: 'vat',
    requiredFields: ['firstName', 'lastName', 'nip', 'address'],
    optionalFields: ['companyName', 'regon', 'email']
  },
  'VAT-R': {
    type: 'VAT-R',
    name: 'VAT-R',
    description: 'Rejestracja jako podatnik VAT',
    complexity: 'simple',
    category: 'vat',
    requiredFields: ['firstName', 'lastName', 'nip', 'address', 'businessStartDate'],
    optionalFields: ['companyName', 'regon', 'pkd']
  },
  'VAT-UE': {
    type: 'VAT-UE',
    name: 'VAT-UE',
    description: 'Informacja podsumowująca o transakcjach wewnątrzunijnych',
    complexity: 'medium',
    category: 'vat',
    requiredFields: ['firstName', 'lastName', 'nip', 'nipUE'],
    optionalFields: ['companyName', 'regon']
  },
  
  // CIT forms
  'CIT-8': {
    type: 'CIT-8',
    name: 'CIT-8',
    description: 'Zeznanie roczne o wysokości dochodu',
    complexity: 'complex',
    category: 'cit',
    requiredFields: ['companyName', 'nip', 'regon', 'krs', 'address'],
    optionalFields: ['taxOffice', 'bankAccount', 'email']
  },
  
  // ZUS forms
  'ZUS-DRA': {
    type: 'ZUS-DRA',
    name: 'ZUS-DRA',
    description: 'Raport miesięczny rozliczeniowy',
    complexity: 'medium',
    category: 'zus',
    requiredFields: ['firstName', 'lastName', 'nip'],
    optionalFields: ['companyName', 'regon', 'zusCode']
  },
  'ZUS-RCA': {
    type: 'ZUS-RCA',
    name: 'ZUS-RCA',
    description: 'Imienne raporty miesięczne rozliczeniowe',
    complexity: 'medium',
    category: 'zus',
    requiredFields: ['firstName', 'lastName', 'nip', 'pesel'],
    optionalFields: ['companyName', 'zusCode']
  },
  'ZUS-ZWUA': {
    type: 'ZUS-ZWUA',
    name: 'ZUS-ZWUA',
    description: 'Zgłoszenie do ubezpieczeń',
    complexity: 'simple',
    category: 'zus',
    requiredFields: ['firstName', 'lastName', 'pesel', 'nip'],
    optionalFields: ['companyName', 'address']
  },
  'ZUS-RMUA': {
    type: 'ZUS-RMUA',
    name: 'ZUS-RMUA',
    description: 'Zgłoszenie zmiany danych',
    complexity: 'simple',
    category: 'zus',
    requiredFields: ['firstName', 'lastName', 'pesel', 'nip'],
    optionalFields: ['companyName', 'newAddress']
  },
  
  // JPK files
  'JPK_VAT': {
    type: 'JPK_VAT',
    name: 'JPK_VAT',
    description: 'Jednolity Plik Kontrolny VAT',
    complexity: 'complex',
    category: 'jpk',
    requiredFields: ['companyName', 'nip', 'regon'],
    optionalFields: ['email', 'period']
  },
  'JPK_FA': {
    type: 'JPK_FA',
    name: 'JPK_FA',
    description: 'Jednolity Plik Kontrolny Faktura',
    complexity: 'complex',
    category: 'jpk',
    requiredFields: ['companyName', 'nip'],
    optionalFields: ['regon', 'period']
  },
  'JPK_KR': {
    type: 'JPK_KR',
    name: 'JPK_KR',
    description: 'Jednolity Plik Kontrolny Księgi Rachunkowe',
    complexity: 'complex',
    category: 'jpk',
    requiredFields: ['companyName', 'nip', 'krs'],
    optionalFields: ['regon', 'period']
  }
};

export function getFormsByCategory(category: FormCategory): FormMetadata[] {
  return Object.values(FORM_METADATA).filter(form => form.category === category);
}

export function getFormsByComplexity(complexity: FormComplexity): FormMetadata[] {
  return Object.values(FORM_METADATA).filter(form => form.complexity === complexity);
}

export class AuthorizationFormGenerator {
  private pdf: jsPDF;

  constructor() {
    this.pdf = new jsPDF();
  }

  async generateForm(data: AuthorizationFormData): Promise<Blob> {
    // Special handling for UPL-1 - use official PDF template with pdf-lib
    if (data.formType === 'UPL-1') {
      return await this.generateUPL1FormFromTemplate(data);
    }

    // Try template-based filling for forms that have templates
    const templateForms = [
      'PIT-37', 'PIT-R', 'PEL', 'ZAW-FA',
      'PIT-2', 'PIT-OP', 'IFT-1', 'UPL-1P',
      'OPD-1', 'OPL-1', 'OPO-1', 'OPS-1',
      'PPD-1', 'PPO-1', 'PPS-1'
    ];
    if (templateForms.includes(data.formType)) {
      try {
        return await this.generateFormFromTemplate(data);
      } catch (error) {
        console.log(`${data.formType} template not available, falling back to jsPDF generation`);
        // Fall through to jsPDF generation if template not available
      }
    }

    // For all other forms, use jsPDF
    this.pdf = new jsPDF();

    // Route to appropriate form generator based on type
    switch(data.formType) {
      case 'PEL':
        this.generatePELForm(data);
        break;
      case 'ZAW-FA':
        this.generateZAWFAForm(data);
        break;
      case 'PIT-36':
        this.generatePIT36Form(data);
        break;
      case 'PIT-37':
        this.generatePIT37Form(data);
        break;
      case 'PIT-4R':
        this.generatePIT4RForm(data);
        break;
      case 'PIT-11':
        this.generatePIT11Form(data);
        break;
      case 'VAT-7':
        this.generateVAT7Form(data);
        break;
      case 'VAT-7K':
        this.generateVAT7KForm(data);
        break;
      case 'VAT-R':
        this.generateVATRForm(data);
        break;
      case 'VAT-UE':
        this.generateVATUEForm(data);
        break;
      case 'CIT-8':
        this.generateCIT8Form(data);
        break;
      case 'ZUS-DRA':
        this.generateZUSDRAForm(data);
        break;
      case 'ZUS-RCA':
        this.generateZUSRCAForm(data);
        break;
      case 'ZUS-ZWUA':
        this.generateZUSZWUAForm(data);
        break;
      case 'ZUS-RMUA':
        this.generateZUSRMUAForm(data);
        break;
      case 'JPK_VAT':
        this.generateJPKVATForm(data);
        break;
      case 'JPK_FA':
        this.generateJPKFAForm(data);
        break;
      case 'JPK_KR':
        this.generateJPKKRForm(data);
        break;
      default:
        throw new Error(`Unsupported form type: ${data.formType}`);
    }

    return this.pdf.output('blob');
  }

  async downloadForm(data: AuthorizationFormData): Promise<void> {
    const blob = await this.generateForm(data);
    const fileName = `${data.formType}_${data.client.lastName}_${data.client.firstName}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Generate UPL-1 form using official PDF template and pdf-lib
   */
  private async generateUPL1FormFromTemplate(data: AuthorizationFormData): Promise<Blob> {
    const filler = new UPL1PdfFiller('/upl-1_06-08-2.pdf');
    return await filler.fillFormAsBlob({
      client: data.client,
      employee: data.employee,
      startDate: data.additionalData?.startDate,
      endDate: data.additionalData?.endDate,
      scope: data.additionalData?.scope,
      taxOffice: data.additionalData?.taxOffice,
    });
  }

  /**
   * Generate form using official PDF template and TaxFormService
   * Supports: PIT-37, PIT-R, PEL, ZAW-FA, PIT-2, PIT-OP, IFT-1, UPL-1P, and declaration forms
   */
  private async generateFormFromTemplate(data: AuthorizationFormData): Promise<Blob> {
    const { client, employee, additionalData, formType } = data;
    const year = additionalData?.year || new Date().getFullYear().toString();
    
    let formData: any = {};

    // Prepare form data based on form type
    switch(formType) {
      case 'PIT-37':
        formData = {
          taxpayerName: `${client.firstName} ${client.lastName}`,
          taxpayerId: client.pesel || '',
          taxpayerNIP: client.nip || '',
          taxpayerAddress: client.address || '',
          taxpayerCity: client.city || '',
          taxpayerPostalCode: client.postalCode || '',
          taxOffice: additionalData?.taxOffice || '',
          employmentIncome: additionalData?.employmentIncome || 0,
          civilContractIncome: additionalData?.civilContractIncome || 0,
          numberOfChildren: additionalData?.numberOfChildren || 0,
          childDeduction: additionalData?.childDeduction || 1112.04,
          taxPaid: additionalData?.taxPaid || 0,
        };
        break;

      case 'PIT-R':
        formData = {
          taxpayerName: `${client.firstName} ${client.lastName}`,
          taxpayerId: client.pesel || '',
          taxpayerNIP: client.nip || '',
          taxpayerAddress: client.address || '',
          taxpayerCity: client.city || '',
          taxOffice: additionalData?.taxOffice || '',
          businessIncome: additionalData?.businessIncome || 0,
          businessCosts: additionalData?.businessCosts || 0,
          taxPaid: additionalData?.taxPaid || 0,
        };
        break;

      case 'PIT-2':
        formData = {
          taxpayerName: `${client.firstName} ${client.lastName}`,
          taxpayerId: client.pesel || '',
          taxpayerNIP: client.nip || '',
          taxOffice: additionalData?.taxOffice || '',
          taxYear: additionalData?.taxYear || year,
          totalIncome: additionalData?.totalIncome || 0,
          taxAmount: additionalData?.taxAmount || 0,
        };
        break;

      case 'PIT-OP':
        formData = {
          taxpayerName: `${client.firstName} ${client.lastName}`,
          taxpayerId: client.pesel || '',
          taxpayerAddress: client.address || '',
          taxOffice: additionalData?.taxOffice || '',
          advancePayment: additionalData?.advancePayment || 0,
          paymentMonth: additionalData?.paymentMonth || new Date().getMonth() + 1,
        };
        break;

      case 'IFT-1':
        formData = {
          taxpayerName: `${client.firstName} ${client.lastName}`,
          taxpayerId: client.pesel || '',
          taxpayerNIP: client.nip || '',
          taxpayerAddress: client.address || '',
          taxOffice: additionalData?.taxOffice || '',
          incomeSource: additionalData?.incomeSource || '',
          incomeAmount: additionalData?.incomeAmount || 0,
          taxAmount: additionalData?.taxAmount || 0,
        };
        break;

      case 'UPL-1P':
        formData = {
          principalName: client.companyName || `${client.firstName} ${client.lastName}`,
          principalNIP: client.nip || '',
          attorneyName: employee ? `${employee.firstName} ${employee.lastName}` : '',
          attorneyPESEL: employee?.pesel || '',
          scope: additionalData?.scope || 'Reprezentacja podatkowa',
          issueDate: new Date().toLocaleDateString('pl-PL'),
        };
        break;

      case 'PEL':
        formData = {
          principalName: client.companyName || `${client.firstName} ${client.lastName}`,
          principalNIP: client.nip || '',
          principalREGON: client.regon || '',
          principalAddress: client.address || '',
          attorneyName: employee ? `${employee.firstName} ${employee.lastName}` : '',
          attorneyPESEL: employee?.pesel || '',
          scope: additionalData?.scope || 'Reprezentacja w ZUS',
          issueDate: new Date().toLocaleDateString('pl-PL'),
        };
        break;

      case 'ZAW-FA':
        formData = {
          employeeName: `${client.firstName} ${client.lastName}`,
          employeePESEL: client.pesel || '',
          employeeAddress: client.address || '',
          employerName: additionalData?.employerName || '',
          employerNIP: additionalData?.employerNIP || '',
          employmentDate: additionalData?.employmentDate || new Date().toLocaleDateString('pl-PL'),
          taxDeduction: additionalData?.taxDeduction || 'TAK',
        };
        break;

      case 'OPD-1':
      case 'OPL-1':
      case 'OPO-1':
      case 'OPS-1':
      case 'PPD-1':
      case 'PPO-1':
      case 'PPS-1':
        // Declaration forms - generic structure
        formData = {
          payerName: client.companyName || `${client.firstName} ${client.lastName}`,
          payerNIP: client.nip || '',
          declarationDate: new Date().toLocaleDateString('pl-PL'),
          amount: additionalData?.amount || 0,
        };
        break;

      default:
        throw new Error(`Form type ${formType} not supported in template generation`);
    }

    const taxFormService = new TaxFormService();
    return await taxFormService.fillFormAsBlob(formType, year, formData);
  }

  /**
   * @deprecated Use generateFormFromTemplate instead
   * Generate PIT-37 form using official PDF template and TaxFormService
   */
  private async generatePIT37FromTemplate(data: AuthorizationFormData): Promise<Blob> {
    return await this.generateFormFromTemplate(data);
  }

  private generateUPL1Form(data: AuthorizationFormData): void {
    const { client, employee } = data;
    
    // Title
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('PEŁNOMOCNICTWO UPL-1', 105, 20, { align: 'center' });
    this.pdf.text('do Urzędu Skarbowego', 105, 30, { align: 'center' });

    // Reset font
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');

    let yPos = 50;

    // Principal (Mocodawca) section
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('MOCODAWCA:', 20, yPos);
    yPos += 10;
    
    this.pdf.setFont('helvetica', 'normal');
    const clientName = `${client.firstName || ''} ${client.lastName || ''}`.trim();
    if (clientName) {
      this.pdf.text(`Imię i nazwisko/Nazwa: ${clientName}`, 20, yPos);
      yPos += 7;
    }

    if (client.companyName) {
      this.pdf.text(`Firma: ${client.companyName}`, 20, yPos);
      yPos += 7;
    }

    if (client.nip) {
      this.pdf.text(`NIP: ${client.nip}`, 20, yPos);
      yPos += 7;
    }

    if (client.regon) {
      this.pdf.text(`REGON: ${client.regon}`, 20, yPos);
      yPos += 7;
    }

    if (client.address) {
      const address = `${client.address.street || ''}, ${client.address.zipCode || ''} ${client.address.city || ''}`.trim();
      if (address !== ', ') {
        this.pdf.text(`Adres: ${address}`, 20, yPos);
        yPos += 7;
      }
    }

    yPos += 5;

    // Attorney (Pełnomocnik) section
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('PEŁNOMOCNIK:', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    const employeeName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
    if (employeeName) {
      this.pdf.text(`Imię i nazwisko: ${employeeName}`, 20, yPos);
      yPos += 7;
    }

    if (employee.position) {
      this.pdf.text(`Stanowisko: ${employee.position}`, 20, yPos);
      yPos += 7;
    }

    yPos += 10;

    // Scope of authorization
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('ZAKRES PEŁNOMOCNICTWA:', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    const scopeText = [
      'Upoważniam do:',
      '1. Reprezentowania mocodawcy przed organami skarbowymi',
      '2. Składania deklaracji podatkowych i innych dokumentów',
      '3. Odbierania korespondencji związanej ze sprawami podatkowymi',
      '4. Dostępu do informacji podatkowych mocodawcy',
      '5. Podpisywania dokumentów w imieniu mocodawcy',
      '6. Składania wniosków i odwołań w sprawach podatkowych'
    ];

    scopeText.forEach(line => {
      this.pdf.text(line, 20, yPos);
      yPos += 7;
    });

    yPos += 10;

    // Date and signatures
    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data wystawienia: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    this.pdf.text('_______________________________', 120, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis mocodawcy)', 20, yPos);
    this.pdf.text('(Podpis pełnomocnika)', 120, yPos);

    yPos += 15;
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.text('Uwaga: Pełnomocnictwo wymaga podpisu z potwierdzeniem własnoręczności podpisu', 20, yPos);
    this.pdf.text('lub kwalifikowanego podpisu elektronicznego.', 20, yPos + 7);
  }

  private generatePELForm(data: AuthorizationFormData): void {
    const { client, employee } = data;

    // Title
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('PEŁNOMOCNICTWO PEL', 105, 20, { align: 'center' });
    this.pdf.text('do Zakładu Ubezpieczeń Społecznych', 105, 30, { align: 'center' });

    // Reset font
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');

    let yPos = 50;

    // Principal (Płatnik) section
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('PŁATNIK SKŁADEK:', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    const clientName = `${client.firstName || ''} ${client.lastName || ''}`.trim();
    if (clientName) {
      this.pdf.text(`Imię i nazwisko/Nazwa: ${clientName}`, 20, yPos);
      yPos += 7;
    }

    if (client.companyName) {
      this.pdf.text(`Firma: ${client.companyName}`, 20, yPos);
      yPos += 7;
    }

    if (client.nip) {
      this.pdf.text(`NIP: ${client.nip}`, 20, yPos);
      yPos += 7;
    }

    if (client.regon) {
      this.pdf.text(`REGON: ${client.regon}`, 20, yPos);
      yPos += 7;
    }

    if (client.address) {
      const address = `${client.address.street || ''}, ${client.address.zipCode || ''} ${client.address.city || ''}`.trim();
      if (address !== ', ') {
        this.pdf.text(`Adres: ${address}`, 20, yPos);
        yPos += 7;
      }
    }

    yPos += 5;

    // Attorney (Pełnomocnik) section
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('PEŁNOMOCNIK:', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    const employeeName = `${employee.firstName || ''} ${employee.lastName || ''}`.trim();
    if (employeeName) {
      this.pdf.text(`Imię i nazwisko: ${employeeName}`, 20, yPos);
      yPos += 7;
    }

    if (employee.position) {
      this.pdf.text(`Stanowisko: ${employee.position}`, 20, yPos);
      yPos += 7;
    }

    yPos += 10;

    // Scope of authorization
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('ZAKRES PEŁNOMOCNICTWA:', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    const scopeText = [
      'Upoważniam do:',
      '1. Reprezentowania płatnika składek przed ZUS',
      '2. Składania dokumentów rozliczeniowych i deklaracji ZUS',
      '3. Odbierania korespondencji od ZUS',
      '4. Dostępu do danych zgromadzonych w ZUS dotyczących płatnika',
      '5. Składania wniosków i odwołań w sprawach ubezpieczeniowych',
      '6. Dokonywania wszelkich czynności związanych z ubezpieczeniami społecznymi',
      '7. Zgłaszania i wyrejestrowywania ubezpieczonych'
    ];

    scopeText.forEach(line => {
      this.pdf.text(line, 20, yPos);
      yPos += 7;
    });

    yPos += 10;

    // Date and signatures
    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data wystawienia: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    this.pdf.text('_______________________________', 120, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis płatnika składek)', 20, yPos);
    this.pdf.text('(Podpis pełnomocnika)', 120, yPos);

    yPos += 15;
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.text('Uwaga: Pełnomocnictwo wymaga potwierdzenia przez notariusza, orgán sądowy,', 20, yPos);
    this.pdf.text('organ administracji rządowej lub samorządowej lub kwalifikowanego podpisu elektronicznego.', 20, yPos + 7);
  }

  // ========================================================================================
  // HELPER METHODS - Smart pre-filling based on form complexity
  // ========================================================================================

  private fillBasicClientInfo(client: Client, yPos: number): number {
    // For simple forms - only basic info
    this.pdf.setFont('helvetica', 'normal');
    
    const clientName = `${client.firstName || ''} ${client.lastName || ''}`.trim();
    if (clientName) {
      this.pdf.text(`Imię i nazwisko: ${clientName}`, 20, yPos);
      yPos += 7;
    }

    if (client.companyName) {
      this.pdf.text(`Nazwa firmy: ${client.companyName}`, 20, yPos);
      yPos += 7;
    }

    if (client.nip) {
      this.pdf.text(`NIP: ${client.nip}`, 20, yPos);
      yPos += 7;
    }

    return yPos;
  }

  private fillComprehensiveClientInfo(client: Client, yPos: number): number {
    // For complex forms - comprehensive data
    this.pdf.setFont('helvetica', 'normal');
    
    const clientName = `${client.firstName || ''} ${client.lastName || ''}`.trim();
    if (clientName) {
      this.pdf.text(`Imię i nazwisko: ${clientName}`, 20, yPos);
      yPos += 7;
    }

    if (client.companyName) {
      this.pdf.text(`Nazwa firmy: ${client.companyName}`, 20, yPos);
      yPos += 7;
    }

    if (client.nip) {
      this.pdf.text(`NIP: ${client.nip}`, 20, yPos);
      yPos += 7;
    }

    if (client.regon) {
      this.pdf.text(`REGON: ${client.regon}`, 20, yPos);
      yPos += 7;
    }

    if (client.krs) {
      this.pdf.text(`KRS: ${client.krs}`, 20, yPos);
      yPos += 7;
    }

    if (client.address) {
      const address = `${client.address.street || ''}, ${client.address.zipCode || ''} ${client.address.city || ''}`.trim();
      if (address !== ', ') {
        this.pdf.text(`Adres: ${address}`, 20, yPos);
        yPos += 7;
      }
    }

    if (client.phone) {
      this.pdf.text(`Telefon: ${client.phone}`, 20, yPos);
      yPos += 7;
    }

    if (client.emails && client.emails.length > 0 && client.emails[0]) {
      this.pdf.text(`Email: ${client.emails[0]}`, 20, yPos);
      yPos += 7;
    }

    return yPos;
  }

  // ========================================================================================
  // SIMPLE FORMS - Basic client + employee info only
  // ========================================================================================

  private generateZAWFAForm(data: AuthorizationFormData): void {
    const { client } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('ZAWIADOMIENIE ZAW-FA', 105, 20, { align: 'center' });
    this.pdf.text('o wyborze formy opodatkowania', 105, 30, { align: 'center' });

    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');

    let yPos = 50;

    // Section header
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE PODATNIKA:', 20, yPos);
    yPos += 10;

    // Basic info only for simple form
    yPos = this.fillBasicClientInfo(client, yPos);

    yPos += 10;

    // Form content
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Zawiadamiam, że wybieram formę opodatkowania:', 20, yPos);
    yPos += 10;

    this.pdf.text('☐ Zasady ogólne (skala podatkowa 17% i 32%)', 30, yPos);
    yPos += 7;
    this.pdf.text('☐ Podatek liniowy (19%)', 30, yPos);
    yPos += 7;
    this.pdf.text('☐ Ryczałt od przychodów ewidencjonowanych', 30, yPos);
    yPos += 7;
    this.pdf.text('☐ Karta podatkowa', 30, yPos);
    yPos += 15;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis podatnika)', 20, yPos);
  }

  // ========================================================================================
  // PIT FORMS - Comprehensive client data
  // ========================================================================================

  private generatePIT36Form(data: AuthorizationFormData): void {
    const { client, additionalData } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('PIT-36', 105, 20, { align: 'center' });
    this.pdf.text('Zeznanie roczne o wysokości osiągniętego dochodu', 105, 30, { align: 'center' });
    this.pdf.text('z pozarolniczej działalności gospodarczej', 105, 38, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 55;

    // Section A - Podatnik data
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('A. DANE PODATNIKA', 20, yPos);
    yPos += 10;

    // Comprehensive info for complex form
    yPos = this.fillComprehensiveClientInfo(client, yPos);

    if (additionalData?.taxOffice) {
      this.pdf.text(`Urząd Skarbowy: ${additionalData.taxOffice}`, 20, yPos);
      yPos += 7;
    }

    yPos += 10;

    // Section B - Income
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('B. PRZYCHODY I KOSZTY', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Przychody z działalności gospodarczej: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Koszty uzyskania przychodów: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Dochód (Przychód - Koszty): _________________', 20, yPos);
    yPos += 15;

    // Section C - Calculations
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('C. OBLICZENIE PODATKU', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Podstawa obliczenia podatku: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Podatek należny: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Kwota podatku do zapłaty / zwrotu: _________________', 20, yPos);
    yPos += 20;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data wypełnienia: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis podatnika)', 20, yPos);
  }

  private generatePIT37Form(data: AuthorizationFormData): void {
    const { client, additionalData } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('PIT-37', 105, 20, { align: 'center' });
    this.pdf.text('Zeznanie roczne o wysokości osiągniętego dochodu', 105, 30, { align: 'center' });
    this.pdf.text('(lub poniesionej straty)', 105, 38, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 55;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE PODATNIKA', 20, yPos);
    yPos += 10;

    yPos = this.fillComprehensiveClientInfo(client, yPos);

    if (additionalData?.taxOffice) {
      this.pdf.text(`Urząd Skarbowy: ${additionalData.taxOffice}`, 20, yPos);
      yPos += 7;
    }

    yPos += 10;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('PRZYCHODY I DOCHODY', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Przychody ze stosunku pracy: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Przychody z umów cywilnoprawnych: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Suma dochodów: _________________', 20, yPos);
    yPos += 15;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('OBLICZENIE PODATKU', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Podstawa obliczenia podatku: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Podatek według skali: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Kwota podatku do zapłaty: _________________', 20, yPos);
    yPos += 20;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis podatnika)', 20, yPos);
  }

  private generatePIT4RForm(data: AuthorizationFormData): void {
    const { client } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('PIT-4R', 105, 20, { align: 'center' });
    this.pdf.text('Zeznanie roczne o zryczałtowanym podatku dochodowym', 105, 30, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 50;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE PODATNIKA', 20, yPos);
    yPos += 10;

    yPos = this.fillComprehensiveClientInfo(client, yPos);

    yPos += 10;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('PRZYCHODY I RYCZAŁT', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Suma przychodów: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Ryczałt należny: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Ryczałt zapłacony: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Ryczałt do zapłaty / zwrotu: _________________', 20, yPos);
    yPos += 20;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis podatnika)', 20, yPos);
  }

  private generatePIT11Form(data: AuthorizationFormData): void {
    const { client } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('PIT-11', 105, 20, { align: 'center' });
    this.pdf.text('Informacja o dochodach wypłaconych osobom fizycznym', 105, 30, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 50;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE PŁATNIKA', 20, yPos);
    yPos += 10;

    yPos = this.fillComprehensiveClientInfo(client, yPos);

    yPos += 10;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('INFORMACJA O WYPŁACONYCH DOCHODACH', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Dane osoby, której wypłacono dochód: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Przychód wypłacony: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Koszty uzyskania: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Zaliczka na podatek: _________________', 20, yPos);
    yPos += 20;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis płatnika)', 20, yPos);
  }

  // ========================================================================================
  // VAT FORMS
  // ========================================================================================

  private generateVAT7Form(data: AuthorizationFormData): void {
    const { client, additionalData } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('VAT-7', 105, 20, { align: 'center' });
    this.pdf.text('Deklaracja dla podatku od towarów i usług', 105, 30, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 50;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE IDENTYFIKACYJNE PODATNIKA', 20, yPos);
    yPos += 10;

    yPos = this.fillComprehensiveClientInfo(client, yPos);

    if (additionalData?.period) {
      this.pdf.text(`Okres rozliczeniowy: ${additionalData.period}`, 20, yPos);
      yPos += 7;
    }

    yPos += 10;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('OBLICZENIE PODATKU', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('VAT należny: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('VAT naliczony: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('VAT do zapłaty / zwrotu: _________________', 20, yPos);
    yPos += 20;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis podatnika)', 20, yPos);
  }

  private generateVAT7KForm(data: AuthorizationFormData): void {
    const { client, additionalData } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('VAT-7K', 105, 20, { align: 'center' });
    this.pdf.text('Deklaracja kwartalna dla podatku VAT', 105, 30, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 50;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE IDENTYFIKACYJNE PODATNIKA', 20, yPos);
    yPos += 10;

    yPos = this.fillComprehensiveClientInfo(client, yPos);

    if (additionalData?.period) {
      this.pdf.text(`Kwartał: ${additionalData.period}`, 20, yPos);
      yPos += 7;
    }

    yPos += 10;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('OBLICZENIE PODATKU', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('VAT należny: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('VAT naliczony: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('VAT do zapłaty / zwrotu: _________________', 20, yPos);
    yPos += 20;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis podatnika)', 20, yPos);
  }

  private generateVATRForm(data: AuthorizationFormData): void {
    const { client, additionalData } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('VAT-R', 105, 20, { align: 'center' });
    this.pdf.text('Zgłoszenie rejestracyjne w zakresie podatku VAT', 105, 30, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 50;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE PODATNIKA', 20, yPos);
    yPos += 10;

    yPos = this.fillBasicClientInfo(client, yPos);

    if (client.address) {
      const address = `${client.address.street || ''}, ${client.address.zipCode || ''} ${client.address.city || ''}`.trim();
      if (address !== ', ') {
        this.pdf.text(`Adres: ${address}`, 20, yPos);
        yPos += 7;
      }
    }

    if (additionalData?.businessStartDate) {
      this.pdf.text(`Data rozpoczęcia działalności: ${additionalData.businessStartDate}`, 20, yPos);
      yPos += 7;
    }

    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Deklaruję rozpoczęcie opodatkowania podatkiem VAT', 20, yPos);
    yPos += 20;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis podatnika)', 20, yPos);
  }

  private generateVATUEForm(data: AuthorizationFormData): void {
    const { client, additionalData } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('VAT-UE', 105, 20, { align: 'center' });
    this.pdf.text('Informacja podsumowująca o transakcjach wewnątrzunijnych', 105, 30, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 50;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE PODATNIKA', 20, yPos);
    yPos += 10;

    yPos = this.fillComprehensiveClientInfo(client, yPos);

    if (additionalData?.period) {
      this.pdf.text(`Okres: ${additionalData.period}`, 20, yPos);
      yPos += 7;
    }

    yPos += 10;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('TRANSAKCJE WEWNĄTRZUNIJNE', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Dostawa towarów: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Świadczenie usług: _________________', 20, yPos);
    yPos += 20;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis podatnika)', 20, yPos);
  }

  // ========================================================================================
  // CIT FORMS
  // ========================================================================================

  private generateCIT8Form(data: AuthorizationFormData): void {
    const { client, additionalData } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('CIT-8', 105, 20, { align: 'center' });
    this.pdf.text('Zeznanie roczne o wysokości dochodu (straty)', 105, 30, { align: 'center' });
    this.pdf.text('osiągniętego przez podatników CIT', 105, 38, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 55;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE PODATNIKA', 20, yPos);
    yPos += 10;

    yPos = this.fillComprehensiveClientInfo(client, yPos);

    if (additionalData?.year) {
      this.pdf.text(`Rok podatkowy: ${additionalData.year}`, 20, yPos);
      yPos += 7;
    }

    yPos += 10;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('PRZYCHODY I KOSZTY', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Przychody ze sprzedaży: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Koszty uzyskania przychodów: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Dochód / Strata: _________________', 20, yPos);
    yPos += 15;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('OBLICZENIE PODATKU', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Podstawa opodatkowania: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Podatek należny (19%): _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Podatek do zapłaty: _________________', 20, yPos);
    yPos += 20;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis osoby uprawnionej)', 20, yPos);
  }

  // ========================================================================================
  // ZUS FORMS
  // ========================================================================================

  private generateZUSDRAForm(data: AuthorizationFormData): void {
    const { client, additionalData } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('ZUS-DRA', 105, 20, { align: 'center' });
    this.pdf.text('Raport miesięczny rozliczeniowy', 105, 30, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 50;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE PŁATNIKA SKŁADEK', 20, yPos);
    yPos += 10;

    yPos = this.fillComprehensiveClientInfo(client, yPos);

    if (additionalData?.period) {
      this.pdf.text(`Okres rozliczeniowy: ${additionalData.period}`, 20, yPos);
      yPos += 7;
    }

    yPos += 10;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('SKŁADKI DO ZAPŁATY', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Składki na ubezpieczenie społeczne: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Składki na ubezpieczenie zdrowotne: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Składki na Fundusz Pracy i FGŚP: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Razem do zapłaty: _________________', 20, yPos);
    yPos += 20;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis płatnika)', 20, yPos);
  }

  private generateZUSRCAForm(data: AuthorizationFormData): void {
    const { client, additionalData } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('ZUS-RCA', 105, 20, { align: 'center' });
    this.pdf.text('Imienne raporty miesięczne rozliczeniowe', 105, 30, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 50;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE PŁATNIKA', 20, yPos);
    yPos += 10;

    yPos = this.fillComprehensiveClientInfo(client, yPos);

    if (additionalData?.period) {
      this.pdf.text(`Miesiąc: ${additionalData.period}`, 20, yPos);
      yPos += 7;
    }

    yPos += 10;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE UBEZPIECZONEGO', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Imię i nazwisko: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('PESEL: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Podstawa wymiaru składek: _________________', 20, yPos);
    yPos += 20;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis płatnika)', 20, yPos);
  }

  private generateZUSZWUAForm(data: AuthorizationFormData): void {
    const { client } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('ZUS-ZWUA', 105, 20, { align: 'center' });
    this.pdf.text('Zgłoszenie do ubezpieczeń', 105, 30, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 50;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE ZGŁASZANEGO', 20, yPos);
    yPos += 10;

    yPos = this.fillBasicClientInfo(client, yPos);

    if (client.address) {
      const address = `${client.address.street || ''}, ${client.address.zipCode || ''} ${client.address.city || ''}`.trim();
      if (address !== ', ') {
        this.pdf.text(`Adres: ${address}`, 20, yPos);
        yPos += 7;
      }
    }

    yPos += 10;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('RODZAJ UBEZPIECZENIA', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('☐ Ubezpieczenie społeczne', 20, yPos);
    yPos += 7;
    this.pdf.text('☐ Ubezpieczenie zdrowotne', 20, yPos);
    yPos += 20;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis)', 20, yPos);
  }

  private generateZUSRMUAForm(data: AuthorizationFormData): void {
    const { client } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('ZUS-RMUA', 105, 20, { align: 'center' });
    this.pdf.text('Zgłoszenie zmiany danych', 105, 30, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 50;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE OSOBY', 20, yPos);
    yPos += 10;

    yPos = this.fillBasicClientInfo(client, yPos);

    yPos += 10;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('ZMIANY', 20, yPos);
    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Opis zmian: _________________', 20, yPos);
    yPos += 7;
    this.pdf.text('Nowe dane: _________________', 20, yPos);
    yPos += 20;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.text(`Data: ${currentDate}`, 20, yPos);
    yPos += 20;

    this.pdf.text('_______________________________', 20, yPos);
    yPos += 7;
    this.pdf.setFontSize(9);
    this.pdf.text('(Podpis)', 20, yPos);
  }

  // ========================================================================================
  // JPK FORMS
  // ========================================================================================

  private generateJPKVATForm(data: AuthorizationFormData): void {
    const { client, additionalData } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('JPK_VAT', 105, 20, { align: 'center' });
    this.pdf.text('Jednolity Plik Kontrolny - VAT', 105, 30, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 50;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE PODATNIKA', 20, yPos);
    yPos += 10;

    yPos = this.fillComprehensiveClientInfo(client, yPos);

    if (additionalData?.period) {
      this.pdf.text(`Okres: ${additionalData.period}`, 20, yPos);
      yPos += 7;
    }

    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Plik JPK_VAT zawiera:', 20, yPos);
    yPos += 10;
    this.pdf.text('- Ewidencję sprzedaży VAT', 30, yPos);
    yPos += 7;
    this.pdf.text('- Ewidencję zakupów VAT', 30, yPos);
    yPos += 7;
    this.pdf.text('- Deklarację VAT-7', 30, yPos);
    yPos += 15;

    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.text('Uwaga: Faktyczny plik JPK_VAT jest generowany w formacie XML.', 20, yPos);
    yPos += 5;
    this.pdf.text('Ten dokument PDF stanowi tylko potwierdzenie wysłania.', 20, yPos);
    yPos += 15;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`Data wygenerowania: ${currentDate}`, 20, yPos);
  }

  private generateJPKFAForm(data: AuthorizationFormData): void {
    const { client, additionalData } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('JPK_FA', 105, 20, { align: 'center' });
    this.pdf.text('Jednolity Plik Kontrolny - Faktura', 105, 30, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 50;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE PODATNIKA', 20, yPos);
    yPos += 10;

    yPos = this.fillComprehensiveClientInfo(client, yPos);

    if (additionalData?.period) {
      this.pdf.text(`Okres: ${additionalData.period}`, 20, yPos);
      yPos += 7;
    }

    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Plik JPK_FA zawiera:', 20, yPos);
    yPos += 10;
    this.pdf.text('- Faktury sprzedaży', 30, yPos);
    yPos += 7;
    this.pdf.text('- Faktury zakupu', 30, yPos);
    yPos += 15;

    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.text('Uwaga: Faktyczny plik JPK_FA jest generowany w formacie XML.', 20, yPos);
    yPos += 5;
    this.pdf.text('Ten dokument PDF stanowi tylko potwierdzenie wysłania.', 20, yPos);
    yPos += 15;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`Data wygenerowania: ${currentDate}`, 20, yPos);
  }

  private generateJPKKRForm(data: AuthorizationFormData): void {
    const { client, additionalData } = data;

    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('JPK_KR', 105, 20, { align: 'center' });
    this.pdf.text('Jednolity Plik Kontrolny - Księgi Rachunkowe', 105, 30, { align: 'center' });

    this.pdf.setFontSize(11);
    let yPos = 50;

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DANE PODATNIKA', 20, yPos);
    yPos += 10;

    yPos = this.fillComprehensiveClientInfo(client, yPos);

    if (additionalData?.period) {
      this.pdf.text(`Okres: ${additionalData.period}`, 20, yPos);
      yPos += 7;
    }

    yPos += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Plik JPK_KR zawiera:', 20, yPos);
    yPos += 10;
    this.pdf.text('- Dziennik', 30, yPos);
    yPos += 7;
    this.pdf.text('- Księgę główną', 30, yPos);
    yPos += 7;
    this.pdf.text('- Obroty i salda', 30, yPos);
    yPos += 15;

    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.text('Uwaga: Faktyczny plik JPK_KR jest generowany w formacie XML.', 20, yPos);
    yPos += 5;
    this.pdf.text('Ten dokument PDF stanowi tylko potwierdzenie wysłania.', 20, yPos);
    yPos += 15;

    const currentDate = new Date().toLocaleDateString('pl-PL');
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`Data wygenerowania: ${currentDate}`, 20, yPos);
  }
}

