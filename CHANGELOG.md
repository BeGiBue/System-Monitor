# Changelog

## 1.0.2 - 2026-10-08

### Geändert

- Feste Höhe im Sections-Dashboard: 5 Zeilen (312 px), im Layout-Editor nicht änderbar. Die Card füllt diese Höhe und verteilt den Inhalt gleichmäßig; der Inhalt passt bei Kartenbreiten ab 240 px ohne Überlauf hinein.
- Masonry-Dashboards: `getCardSize()` meldet 6 statt 4.

## 1.0.1 - 2026-10-08

### Hinzugefügt

- Platinen-Illustration des Raspberry Pi 5 oben rechts im Kopfbereich, direkt in `system-monitor.js` eingebettet (eigene Zeichnung ohne Logo), mit Deckkraft 65 %.
- Neue Optionen `show_image` (Bild ausblenden) und `image_url` (eigenes Bild); beide im visuellen Editor einstellbar.
- Link zum Hinzufügen des Repositories in HACS im README und in den Release Notes.

### Geändert

- Schmale Layouts richten sich über Container-Abfragen nach der Kartenbreite statt nach dem Browserfenster: unter 380 px werden die Kacheln enger, unter 320 px liegt das Bild abgedunkelt hinter dem Titel.

## 1.0.0 - 2026-10-07

### Hinzugefügt

- Erste öffentliche Version der System Monitor Card für Home Assistant, vorkonfiguriert für einen Raspberry Pi 5 mit der Integration „System Monitor“.
- Kompakte Darstellung im Stil der NAS Card: Kopfzeile, drei Kacheln (CPU, Temperatur, Netzteil), zwei Balkenzeilen (Arbeitsspeicher, Speicher) und „Letzter Start“.
- Netzteil-/Spannungsstatus über `binary_sensor.rpi_power_status` (Raspberry Pi Power Supply Checker): „OK“ oder rot „Warnung / Spannung“.
- Warnfarben nach Schwellwerten: CPU ab 60/85 %, Temperatur ab 60/75 °C, RAM ab 70/90 %, Speicher ab 75/90 %.
- Farben ausschließlich aus dem aktiven Home-Assistant-Theme.
- Nativer visueller Editor mit Entity-Pickern und Textfeldern (`getConfigForm`), Symbol per Icon-Picker wählbar.
- Breite im Sections-Dashboard von 3 bis 12 Spalten einstellbar; Höhe ergibt sich automatisch.
- Tippen auf Kacheln, Balken sowie „Belegt“ und „Frei“ öffnet die Detailansicht der jeweiligen Entität.
- HACS-Unterstützung als Dashboard-Plugin (`hacs.json`) mit Validierungs-Workflow.
