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
    label:       'Privat',
    description: 'Persönliche Wünsche & Erinnerungen',
  },
  {
    id:          'team',
    label:       'Team',
    description: 'Grüße & Wünsche aus den Teams',
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
