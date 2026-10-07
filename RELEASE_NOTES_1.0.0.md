# System Monitor Card 1.0.0

Erste öffentliche Version der kompakten System Monitor Card für Home Assistant – vorkonfiguriert für den Raspberry Pi, auf dem Home Assistant läuft.

## Highlights

- Kompakte, theme-sensitive Oberfläche im Stil der NAS Card
- CPU-Auslastung, CPU-Temperatur und Netzteil-/Spannungsstatus als Kacheln
- Arbeitsspeicher und Speicher als Balken mit Prozentwert sowie Belegt/Frei
- „Letzter Start“ im Home-Assistant-Zeit-/Datumsformat
- Warnfarben (grün/orange/rot) nach Schwellwerten, Farben komplett aus dem aktiven Theme
- Native Entity-Picker, Textfelder und Icon-Picker im visuellen Editor
- Breite im Sections-Dashboard frei einstellbar (3–12 Spalten); Höhe automatisch
- Tippen auf einen Wert öffnet die Detailansicht der Entität

## Voraussetzungen

- Integration **System Monitor** (liefert Prozessor, Speicher, Festplatte, letzter Start)
- Optional: Integration **Raspberry Pi Power Supply Checker** für den Netzteil-Status (`binary_sensor.rpi_power_status`)

## Installation

Das Repository ist für die Installation als HACS-Dashboard-Plugin vorbereitet. `hacs.json` verweist auf `system-monitor.js`.

Mit einem Klick in HACS hinzufügen: <https://my.home-assistant.io/redirect/hacs_repository/?owner=BeGiBue&repository=System-Monitor&category=plugin>

## Lizenz

GNU Affero General Public License v3.0 only (AGPL-3.0-only)
