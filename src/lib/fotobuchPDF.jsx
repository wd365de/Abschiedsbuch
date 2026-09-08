import {
  Document, Page, View, Text, Image,
  StyleSheet, Font,
} from '@react-pdf/renderer'
import { NAME, INSTITUTE, ROLE } from '../config'

// Farben
const C = {
  cream:    '#FAF7F2',
  creamDark:'#F0EBE1',
  gold:     '#009775',
  goldLight:'#3DBA9C',
  blush:    '#B87068',
  ink:      '#2C2418',
  inkMuted: '#8B7D6E',
  inkLight: '#B5A898',
}

const CATEGORIES = [
  { id: 'dankbarkeit',   label: 'Dankbarkeit',   color: C.gold },
  { id: 'erinnerungen',  label: 'Erinnerungen',  color: C.gold },
  { id: 'wuensche',      label: 'Wünsche',       color: C.gold },
  { id: 'humor',         label: 'Humor',         color: C.gold },
  { id: 'vermaechtnis',  label: 'Vermächtnis',   color: C.gold },
]

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

// Gemeinsame Styles
function makeStyles(isA4) {
  const W = isA4 ? 595.28 : 419.53 // pt: A4 oder quadratisch 148mm
  const H = isA4 ? 841.89 : 419.53
  const PAD = isA4 ? 40 : 28

  return { W, H, PAD, S: StyleSheet.create({
    page: {
      width: W, height: H,
      backgroundColor: C.cream,
      padding: PAD,
      fontFamily: 'Helvetica',
    },
    frame: {
      position: 'absolute',
      top: 14, left: 14, right: 14, bottom: 14,
      borderWidth: 0.75, borderColor: C.gold,
    },
    frameInner: {
      position: 'absolute',
      top: 19, left: 19, right: 19, bottom: 19,
      borderWidth: 0.3, borderColor: C.goldLight,
    },
    center: { alignItems: 'center', justifyContent: 'center' },
    rule: {
      flexDirection: 'row', alignItems: 'center',
      marginVertical: 10,
    },
    ruleLine: { flex: 1, height: 0.5, backgroundColor: C.gold },
    ruleStar: { marginHorizontal: 6, color: C.gold, fontSize: 8 },
  })}
}

// Deckblatt
function Cover({ S }) {
  return (
    <View style={[{ flex: 1 }, S.center]}>
      <View style={S.frame} /><View style={S.frameInner} />
      <Text style={{ fontSize: 8, letterSpacing: 5, color: C.gold, marginBottom: 20 }}>
        ABSCHIEDSBUCH
      </Text>
      <View style={S.rule}>
        <View style={S.ruleLine} />
        <Text style={S.ruleStar}>✦</Text>
        <View style={S.ruleLine} />
      </View>
      <Text style={{ fontSize: 40, color: C.ink, fontFamily: 'Helvetica-Oblique', marginTop: 12, textAlign: 'center' }}>
        {NAME}
      </Text>
      <Text style={{ fontSize: 14, color: C.gold, fontFamily: 'Helvetica-Oblique', marginVertical: 12, textAlign: 'center' }}>
        {ROLE} · {INSTITUTE}
      </Text>
      <View style={S.rule}>
        <View style={S.ruleLine} />
        <Text style={S.ruleStar}>✦</Text>
        <View style={S.ruleLine} />
      </View>
      <Text style={{ fontSize: 11, color: C.inkLight, fontFamily: 'Helvetica-Oblique', textAlign: 'center', maxWidth: 280, lineHeight: 1.8, marginTop: 40 }}>
        "Der Ruhestand ist nicht das Ende, sondern der Anfang eines neuen Kapitels voller Möglichkeiten."
      </Text>
    </View>
  )
}

// Kategorie-Trennseite
function CategoryDivider({ cat, S }) {
  return (
    <View style={[{ flex: 1 }, S.center]}>
      <View style={S.frame} />
      <Text style={{ fontSize: 36, color: C.ink, fontFamily: 'Helvetica-Oblique', marginBottom: 12 }}>
        {cat.label}
      </Text>
      <View style={S.rule}>
        <View style={[S.ruleLine, { backgroundColor: cat.color }]} />
        <Text style={[S.ruleStar, { color: cat.color }]}>✦</Text>
        <View style={[S.ruleLine, { backgroundColor: cat.color }]} />
      </View>
    </View>
  )
}

// Eintrag mit Foto
function EntryWithPhoto({ entry, cat, S, isLast }) {
  return (
    <View style={{ marginBottom: isLast ? 0 : 20 }}>
      <Image
        src={entry.photo_url}
        style={{ width: '100%', height: 160, objectFit: 'contain', backgroundColor: C.creamDark, borderRadius: 3 }}
      />
      <View style={{ marginTop: 8 }}>
        <Text style={{ fontSize: 7, letterSpacing: 2, color: cat.color, marginBottom: 4 }}>
          {cat.label.toUpperCase()}
        </Text>
        <Text style={{ fontSize: 11, color: C.ink, fontFamily: 'Helvetica-Oblique', lineHeight: 1.7, marginBottom: 8 }}>
          "{entry.message}"
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: cat.color + '44', paddingTop: 5 }}>
          <Text style={{ fontSize: 12, color: C.ink, fontFamily: 'Helvetica-Oblique' }}>{entry.name}</Text>
          <Text style={{ fontSize: 8, color: C.inkMuted, alignSelf: 'center' }}>{formatDate(entry.created_at)}</Text>
        </View>
      </View>
    </View>
  )
}

// Eintrag ohne Foto
function EntryText({ entry, cat, S, isLast }) {
  return (
    <View style={{
      marginBottom: isLast ? 0 : 16,
      paddingBottom: isLast ? 0 : 16,
      borderBottomWidth: isLast ? 0 : 0.5,
      borderBottomColor: cat.color + '33',
      alignItems: 'center',
    }}>
      <Text style={{ fontSize: 7, letterSpacing: 2, color: cat.color, marginBottom: 8 }}>
        {cat.label.toUpperCase()}
      </Text>
      <Text style={{ fontSize: 13, color: C.ink, fontFamily: 'Helvetica-Oblique', lineHeight: 1.8, marginBottom: 10, textAlign: 'center', maxWidth: 380 }}>
        "{entry.message}"
      </Text>
      <Text style={{ fontSize: 13, color: C.ink, fontFamily: 'Helvetica-Oblique', marginBottom: 3 }}>{entry.name}</Text>
      <Text style={{ fontSize: 8, color: C.inkMuted }}>{formatDate(entry.created_at)}</Text>
    </View>
  )
}

// Footer
function Footer({ S }) {
  return (
    <Text style={{
      position: 'absolute', bottom: 18, left: 0, right: 0,
      textAlign: 'center', fontSize: 7, color: C.gold, letterSpacing: 2,
    }}>
      ✦  {NAME.toUpperCase()} · {INSTITUTE.toUpperCase()}  ✦
    </Text>
  )
}

// Einträge gruppieren
function groupIntoPages(entries) {
  const pages = []
  let i = 0
  while (i < entries.length) {
    const hasPhoto = entries[i].photo_url || (entries[i + 1]?.photo_url)
    const size = hasPhoto ? 2 : 3
    pages.push(entries.slice(i, i + size))
    i += size
  }
  return pages
}

// Haupt-Dokument
export function FotobuchDocument({ entries, format }) {
  const isA4  = format === 'a4'
  const { W, H, PAD, S } = makeStyles(isA4)

  const pageSize = isA4
    ? { width: W, height: H }
    : { width: W, height: H }

  return (
    <Document title={`Abschiedsbuch – ${NAME}`}>
      {/* Deckblatt */}
      <Page size={pageSize} style={S.page}>
        <Cover S={S} />
      </Page>

      {/* Kategorien */}
      {CATEGORIES.map(cat => {
        const catEntries = entries.filter(e => e.category === cat.id)
        if (catEntries.length === 0) return null

        const pages = groupIntoPages(catEntries)

        return [
          // Trennseite
          <Page key={`cat-${cat.id}`} size={pageSize} style={S.page}>
            <CategoryDivider cat={cat} S={S} />
          </Page>,
          // Eintragsseiten
          ...pages.map((pageEntries, idx) => (
            <Page key={`${cat.id}-${idx}`} size={pageSize} style={S.page}>
              <View style={S.frame} />
              <Text style={{ fontSize: 7, letterSpacing: 3, color: cat.color, textAlign: 'center', marginBottom: 16 }}>
                {cat.label.toUpperCase()}
              </Text>
              {pageEntries.map((entry, i) =>
                entry.photo_url
                  ? <EntryWithPhoto key={entry.id} entry={entry} cat={cat} S={S} isLast={i === pageEntries.length - 1} />
                  : <EntryText      key={entry.id} entry={entry} cat={cat} S={S} isLast={i === pageEntries.length - 1} />
              )}
              <Footer S={S} />
            </Page>
          )),
        ]
      })}
    </Document>
  )
}
