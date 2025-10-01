import jsPDF from 'jspdf';
import { Client, User } from '../types/client';

interface AuthorizationFormData {
  client: Client;
  employee: User;
  formType: 'UPL-1' | 'PEL';
}

export class AuthorizationFormGenerator {
  private pdf: jsPDF;

  constructor() {
    this.pdf = new jsPDF();
  }

  generateForm(data: AuthorizationFormData): Blob {
    this.pdf = new jsPDF();

    if (data.formType === 'UPL-1') {
      this.generateUPL1Form(data);
    } else if (data.formType === 'PEL') {
      this.generatePELForm(data);
    }

    return this.pdf.output('blob');
  }

  downloadForm(data: AuthorizationFormData): void {
    const blob = this.generateForm(data);
    const fileName = `${data.formType}_${data.client.lastName}_${data.client.firstName}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
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
}
