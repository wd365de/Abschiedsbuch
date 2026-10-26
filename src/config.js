// Zentrale Eckdaten für das Abschiedsbuch
// NAME_FULL: nur auf der Startseite (formelle Vorstellung) und im PDF-Cover
// NAME: auf allen weiteren Seiten und in Formulartexten (kurz & persönlich)
export const NAME_FULL = 'Prof. Dr. Norbert Krug'
export const NAME = 'Herr Krug'
export const TAGLINE = 'Pioneer for Sustainable Health'
export const INSTITUTE = 'Fraunhofer ITEM'
export const ROLE = 'Institutsleiter'

// Kategorien – gelten für Formular, Galerie, Admin und Fotobuch
export const CATEGORIES = [
  {
    id:          'privat',
    label:       'Persönliche Wünsche & Erinnerungen',
    description: '',
  },
  {
    id:          'team',
    label:       'Grüße & Wünsche aus den Teams',
    description: '',
  },
  {
    id:          'sonstige',
    label:       'Abschiedsveranstaltung',
    description: 'Wird erst nach dem 30. November befüllt',
  },
]

export const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]))

// Eigener Zugang für Herrn Krug (Galerie)
export const KRUG_PATH = '/fuer-herrn-krug'
