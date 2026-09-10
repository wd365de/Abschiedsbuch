import { renameSync, existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'

// Vercel serviert vorhandene Dateien im dist/-Output ueber eine interne
// Filesystem-Route, bevor eigene rewrites in vercel.json greifen - ein
// vorhandenes dist/index.html wird also immer ungeschuetzt direkt
// ausgeliefert. Deshalb wird die HTML-Huelle hier aus dem oeffentlichen
// Static-Output heraus verschoben; api/gate.js liest sie von dort und
// liefert sie erst nach IP-Pruefung aus.
const src = path.join('dist', 'index.html')
const destDir = 'server'
const dest = path.join(destDir, 'index-shell.html')

if (!existsSync(destDir)) mkdirSync(destDir)
renameSync(src, dest)
console.log(`Verschoben: ${src} -> ${dest}`)
