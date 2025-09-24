import { Email } from "../types/client";

export const initialEmails: Email[] = [
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