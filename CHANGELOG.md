# Changelog

## 1.0.0 - 2026-10-07

### Hinzugefügt

- Erste öffentliche Version der System Monitor Card für Home Assistant, vorkonfiguriert für einen Raspberry Pi 5 mit der Integration „System Monitor“.
- Kompakte Darstellung im Stil der NAS Card: Kopfzeile, drei Kacheln (CPU, Temperatur, Netzteil), zwei Balkenzeilen (Arbeitsspeicher, Speicher) und „Letzter Start“.
- Netzteil-/Spannungsstatus über `binary_sensor.rpi_power_status` (Raspberry Pi Power Supply Checker): „OK“ oder rot „Warnung / Spannung“.
- Warnfarben nach Schwellwerten: CPU ab 60/85 %, Temperatur ab 60/75 °C, RAM ab 70/90 %, Speicher ab 75/90 %.
- Farben ausschließlich aus dem aktiven Home-Assistant-Theme.
- Platinen-Illustration des Raspberry Pi 5 oben rechts im Kopfbereich, direkt in `system-monitor.js` eingebettet (eigene Zeichnung ohne Logo); mit Deckkraft 65 %, mit `show_image` ausblendbar, mit `image_url` ersetzbar. Bei sehr schmaler Karte liegt das Bild abgedunkelt hinter dem Titel.
- Nativer visueller Editor mit Entity-Pickern und Textfeldern (`getConfigForm`), Symbol per Icon-Picker wählbar.
- Breite im Sections-Dashboard von 3 bis 12 Spalten einstellbar; Höhe ergibt sich automatisch.
- Tippen auf Kacheln, Balken sowie „Belegt“ und „Frei“ öffnet die Detailansicht der jeweiligen Entität.
- HACS-Unterstützung als Dashboard-Plugin (`hacs.json`) mit Validierungs-Workflow.
