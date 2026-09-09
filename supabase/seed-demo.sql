-- ============================================================
-- Demo-Einträge zum Testen von Galerie & Fotobuch (Abschiedsbuch
-- für Herrn Norbert Krug, Fraunhofer ITEM)
-- Im Supabase SQL-Editor ausführen. Fotos sind Platzhalter
-- (picsum.photos) – für den finalen Look durch echte Bilder
-- ersetzen (photo_url in der Tabelle updaten).
-- approved = true, damit die Einträge sofort in der öffentlichen
-- Galerie erscheinen (RLS erlaubt sonst nur freigegebene Einträge).
--
-- Löschen der Demo-Daten:
-- delete from public.entries where name in (
--   'Dr. Julia Reimann','Thomas Berger','Sabine Krämer',
--   'Michael Vogt','Anke Wolters','Dr. Stefan Lindner',
--   'Petra Sommer','Frank Ostermann','Christine Baumann',
--   'Jürgen Halle','Nicole Frantz','Dr. Andreas Kühn',
--   'Martina Schröder','Ralf Peters','Katja Winter'
-- );
-- ============================================================

insert into public.entries (name, message, category, photo_url, approved) values

-- Dankbarkeit
('Dr. Julia Reimann', 'Lieber Herr Krug, vielen Dank für Ihr stets offenes Ohr und Ihr Vertrauen in unser Team – auch in schwierigen Projektphasen haben Sie uns immer den Rücken gestärkt.', 'dankbarkeit', 'https://picsum.photos/seed/dankbarkeit1/800/800', true),
('Thomas Berger', 'Danke, dass Sie uns über all die Jahre gefördert und gefordert haben. Ohne Ihre Unterstützung wäre mancher Meilenstein nicht möglich gewesen.', 'dankbarkeit', null, true),
('Sabine Krämer', 'Ich danke Ihnen für die vielen Chancen, die Sie mir gegeben haben, mich fachlich und persönlich weiterzuentwickeln.', 'dankbarkeit', 'https://picsum.photos/seed/dankbarkeit3/800/800', true),

-- Erinnerungen
('Michael Vogt', 'Unvergessen bleibt die Institutsklausur 2019, als wir bis spät in die Nacht über die neue Forschungsstrategie diskutiert haben – und Sie am nächsten Morgen als Erster im Büro waren.', 'erinnerungen', 'https://picsum.photos/seed/erinnerung1/800/800', true),
('Anke Wolters', 'Ich erinnere mich gern an unseren gemeinsamen Messeauftritt in Hannover, bei dem Sie mit so viel Begeisterung von unseren Projekten erzählt haben, dass wir am Ende drei neue Kooperationen an Land gezogen haben.', 'erinnerungen', 'https://picsum.photos/seed/erinnerung2/800/800', true),
('Dr. Stefan Lindner', 'Die Weihnachtsfeiern mit Ihrer legendären Rede gehören für mich zu den schönsten Erinnerungen am Institut.', 'erinnerungen', null, true),

-- Wünsche für die Zukunft
('Petra Sommer', 'Ich wünsche Ihnen für die Zeit nach dem Institut vor allem eins: Zeit. Zeit für die Dinge, die im Arbeitsalltag oft zu kurz kamen.', 'wuensche', null, true),
('Frank Ostermann', 'Möge der Ruhestand Ihnen die Ruhe bringen, die Sie sich nach so vielen intensiven Jahren redlich verdient haben.', 'wuensche', 'https://picsum.photos/seed/wunsch2/800/800', true),
('Christine Baumann', 'Ich wünsche Ihnen Gesundheit, Reisen an die Orte, von denen Sie immer gesprochen haben, und viele entspannte Stunden im Garten.', 'wuensche', null, true),

-- Humor & Leichtigkeit
('Jürgen Halle', 'Weiß noch jemand, wie Herr Krug bei der Betriebsfeier versucht hat, den Grill anzuzünden – und wir am Ende Pizza bestellt haben? Die Feuerwehr-Geschichte wird noch lange erzählt!', 'humor', 'https://picsum.photos/seed/humor1/800/800', true),
('Nicole Frantz', 'Sein Kaffee war legendär stark – wer davon getrunken hat, brauchte den Rest des Tages kein Koffein mehr.', 'humor', null, true),
('Dr. Andreas Kühn', 'Ich werde nie vergessen, wie er in einem Meeting versehentlich seinen Bildschirm mit dem Katzenfilter geteilt hat – zehn Minuten lang hat niemand etwas gesagt, bis er es selbst bemerkt hat.', 'humor', 'https://picsum.photos/seed/humor3/800/800', true),

-- Vermächtnis
('Martina Schröder', 'Von Herrn Krug habe ich gelernt, dass man auch unter Druck ruhig bleiben kann – sein Satz „Erstmal eine Nacht drüber schlafen" begleitet mich bis heute.', 'vermaechtnis', null, true),
('Ralf Peters', 'Fragen kostet nichts, nicht fragen kann teuer werden – diesen Satz habe ich von ihm übernommen und gebe ihn selbst an neue Kollegen weiter.', 'vermaechtnis', 'https://picsum.photos/seed/vermaechtnis2/800/800', true),
('Katja Winter', 'Er hat mir gezeigt, dass gute Führung bedeutet, Menschen zuzuhören, bevor man Entscheidungen trifft.', 'vermaechtnis', null, true);
