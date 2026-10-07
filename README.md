# System Monitor Card

Kompakte Custom-Card zur Überwachung des Hosts, auf dem Home Assistant läuft – vorkonfiguriert für einen **Raspberry Pi 5** mit der Integration **System Monitor**.

**Version 1.0.0**

## Funktionen

- Theme-sensitive Darstellung: alle Farben kommen aus dem aktiven Home-Assistant-Theme (Light Mode, Dark Mode und benutzerdefinierte Themes)
- Editierbarer Titel und Untertitel sowie frei wählbares Symbol, Standard `mdi:raspberry-pi`
- Drei Kacheln: CPU-Auslastung, CPU-Temperatur und Netzteil-/Spannungsstatus
- Arbeitsspeicher und Speicher als Fortschrittsbalken mit Prozentwert sowie Belegt und Frei
- Warnfarben nach Schwellwerten: grün, orange und rot
- „Letzter Start“ mit dem Zeit-/Datumsformat von Home Assistant
- Tippen auf Kacheln, Balken sowie Belegt und Frei öffnet die Detailansicht der jeweiligen Entität
- Alle Entitäten über native Home-Assistant-Entity-Picker auswählbar
- Breite im Sections-Dashboard frei von 3 bis 12 Spalten einstellbar
- Höhe wird automatisch durch die Card bestimmt und ist nicht manuell skalierbar

## Warnfarben

| Wert | Orange ab | Rot ab |
| --- | --- | --- |
| CPU-Auslastung | 60 % | 85 % |
| CPU-Temperatur | 60 °C | 75 °C |
| Arbeitsspeicher | 70 % | 90 % |
| Speicher | 75 % | 90 % |
| Netzteil | – | Unterspannung erkannt |

Die Netzteil-Kachel zeigt „OK“ oder bei erkannter Unterspannung rot „Warnung / Spannung“.

## Voraussetzungen

- Integration **System Monitor** (Einstellungen → Geräte & Dienste), sie liefert Prozessor, Speicher, Festplatte und letzten Start.
- Optional: Integration **Raspberry Pi Power Supply Checker** für den Netzteil-Status (`binary_sensor.rpi_power_status`).

## Standard-Entitäten

Die Card ist für folgende Entitäten vorkonfiguriert:

```
sensor.system_monitor_processor_use
sensor.system_monitor_processor_temperature
binary_sensor.rpi_power_status
sensor.system_monitor_memory_use_percent
sensor.system_monitor_memory_use
sensor.system_monitor_memory_free
sensor.system_monitor_disk_use_percent
sensor.system_monitor_disk_use
sensor.system_monitor_disk_free
sensor.system_monitor_last_boot
```

Die Entity-IDs können je nach Home-Assistant-Version und Systemname abweichen. Alle Entitäten lassen sich im grafischen Karteneditor ändern.

## Installation über HACS

### Automatisch

[![Open your Home Assistant instance and open this repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=BeGiBue&repository=System-Monitor&category=plugin)

### Manuell

1. In HACS **Benutzerdefinierte Repositories** öffnen.
2. `https://github.com/BeGiBue/System-Monitor` hinzufügen.
3. Als Typ **Dashboard** auswählen.
4. **System Monitor Card** installieren.
5. Home Assistant bzw. den Browser vollständig neu laden.

### Ohne HACS

1. `system-monitor.js` nach `/config/www/` kopieren.
2. Unter Einstellungen → Dashboards → Ressourcen eine Ressource hinzufügen: URL `/local/system-monitor.js`, Typ **JavaScript-Modul**.
3. Browser vollständig neu laden.

## Card hinzufügen

Minimal:

```yaml
type: custom:system-monitor
```

Mit eigenen Bezeichnungen:

```yaml
type: custom:system-monitor
title: System Monitor
subtitle: Raspberry Pi 5
icon: mdi:raspberry-pi
```

Vollständiges Beispiel mit den Standard-Entitäten:

```yaml
type: custom:system-monitor
title: System Monitor
subtitle: Raspberry Pi 5
icon: mdi:raspberry-pi
cpu_entity: sensor.system_monitor_processor_use
temperature_entity: sensor.system_monitor_processor_temperature
power_entity: binary_sensor.rpi_power_status
memory_title: Arbeitsspeicher
memory_percent_entity: sensor.system_monitor_memory_use_percent
memory_used_entity: sensor.system_monitor_memory_use
memory_free_entity: sensor.system_monitor_memory_free
disk_title: Speicher
disk_percent_entity: sensor.system_monitor_disk_use_percent
disk_used_entity: sensor.system_monitor_disk_use
disk_free_entity: sensor.system_monitor_disk_free
last_start_entity: sensor.system_monitor_last_boot
```

## Grafischer Editor

Die Card verwendet den eingebauten Formular-Editor von Home Assistant (`getConfigForm()`). Titel und Untertitel sind native Textfelder, das Symbol ein Icon-Picker und alle Entitäten native Entity-Picker.

Die Gruppen **Allgemein**, **System**, **Arbeitsspeicher**, **Speicher** und **Start** können im Editor aufgeklappt werden.

## Layout / Größe

Im Home-Assistant-Sections-Dashboard ist die Breite frei einstellbar (3 bis 12 Spalten). Die Höhe wird bewusst nicht als Grid-Größe vorgegeben; die Card bestimmt sie selbst. In Masonry-Dashboards meldet die Card über `getCardSize()` eine passende Höhe.

## Hinweise zu Marken

Dieses Projekt ist ein unabhängiges Community-Projekt und steht in keiner Verbindung zu Raspberry Pi Ltd oder Home Assistant. Es wird weder von Raspberry Pi Ltd noch von Home Assistant unterstützt oder herausgegeben.

**Raspberry Pi** ist eine Marke der Raspberry Pi Ltd.

## Lizenz

GNU Affero General Public License v3.0 only (**AGPL-3.0-only**).

Nutzung, Änderungen und Weitergabe sind unter den Bedingungen der AGPL erlaubt; abgeleitete Werke müssen unter derselben Lizenz stehen. Bei modifizierten Versionen, die über ein Netzwerk genutzt werden, muss der entsprechende Quellcode den Nutzern zugänglich gemacht werden.

Details stehen in [`LICENSE`](LICENSE).
