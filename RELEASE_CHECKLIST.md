# Release Checklist — v1.0.1

## Repository vorbereitet

- [x] `VERSION` steht auf `1.0.1`.
- [x] Öffentliche Versionskennung in `system-monitor.js` steht auf `1.0.1`.
- [x] `CHANGELOG.md` für `1.0.1` angelegt.
- [x] `RELEASE_NOTES_1.0.1.md` vorbereitet.
- [x] `hacs.json` verweist auf `system-monitor.js`.
- [x] HACS-Validierung ist für `main`, Pull Requests und manuelle Ausführung vorbereitet.
- [x] README beschreibt Installation, Konfiguration und Layout.
- [x] `.github/CODEOWNERS` enthält `@BeGiBue`.
- [x] Lizenz AGPL-3.0-only (`LICENSE`).
- [x] Syntaxprüfung von `system-monitor.js` und Testdarstellung mit simulierten Home-Assistant-Daten (Hell, Dunkel, Warnzustand, fremdes Theme).

## Vor Veröffentlichung prüfen

- [ ] Finalen HACS-Validate-Lauf auf dem endgültigen `main`-Commit erfolgreich abschließen.
- [ ] Card in Home Assistant mit Light Mode prüfen.
- [ ] Card in Home Assistant mit Dark Mode prüfen.
- [ ] Visuellen Editor prüfen: Titel, Untertitel, Symbol und alle Entity-Picker.
- [ ] Standard-Entity-IDs gegen die echte Installation prüfen (`sensor.system_monitor_*`, `binary_sensor.rpi_power_status`).
- [ ] Netzteil-Kachel prüfen (OK und, falls möglich, Unterspannung).
- [ ] Bild oben rechts prüfen: Standard-Illustration, `show_image: false` und eigene `image_url`.
- [ ] Breitenänderung im Sections-Dashboard prüfen; Höhe darf nicht manuell skalierbar sein.
- [ ] Mobile Ansicht prüfen.
- [ ] „Letzter Start“ mit Home-Assistant-Zeitformat prüfen.
- [ ] Screenshot aus Home Assistant als `images/Screenshot.png` hinzufügen und im README einbinden.

## Veröffentlichung

- [ ] Nach dem erfolgreichen finalen HACS-Lauf Tag `v1.0.1` auf dem finalen `main`-Commit erstellen.
- [ ] Danach GitHub Release `v1.0.1` mit dem Inhalt aus `RELEASE_NOTES_1.0.1.md` veröffentlichen.
- [ ] Erst danach ggf. den PR für `hacs/default` erstellen.
