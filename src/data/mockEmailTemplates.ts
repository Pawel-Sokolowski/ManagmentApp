import { EmailTemplate } from "../types/client";

export const mockEmailTemplates: EmailTemplate[] = [
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