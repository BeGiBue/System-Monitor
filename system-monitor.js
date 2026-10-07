/*
 * System Monitor Card — kompakte Home Assistant Custom Card zur Überwachung
 * eines Hosts (vorkonfiguriert für Raspberry Pi 5 mit der Integration "System Monitor").
 * Version 1.0.0 — AGPL-3.0-only — BeGiBue
 * https://github.com/BeGiBue/System-Monitor
 *
 * Installation: siehe README.md (HACS) oder manuell:
 *   1. Datei nach /config/www/system-monitor.js kopieren
 *   2. Einstellungen > Dashboards > Ressourcen > "+":
 *        URL: /local/system-monitor.js      Typ: JavaScript-Modul
 *   3. Karte hinzufügen:  type: custom:system-monitor
 */

const SYSTEM_MONITOR_CARD_VERSION = "1.0.0";

const DEF = {
  title: "System Monitor",
  subtitle: "Raspberry Pi 5",
  icon: "mdi:raspberry-pi",

  cpu_entity: "sensor.system_monitor_processor_use",
  temperature_entity: "sensor.system_monitor_processor_temperature",
  power_entity: "binary_sensor.rpi_power_status",

  memory_title: "Arbeitsspeicher",
  memory_percent_entity: "sensor.system_monitor_memory_use_percent",
  memory_used_entity: "sensor.system_monitor_memory_use",
  memory_free_entity: "sensor.system_monitor_memory_free",

  disk_title: "Speicher",
  disk_percent_entity: "sensor.system_monitor_disk_use_percent",
  disk_used_entity: "sensor.system_monitor_disk_use",
  disk_free_entity: "sensor.system_monitor_disk_free",

  last_start_entity: "sensor.system_monitor_last_boot",
};

class SystemMonitorCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = { ...DEF };
  }

  static getStubConfig() {
    return { ...DEF };
  }

  static getConfigForm() {
    const e = (n) => ({ name: n, selector: { entity: {} } });
    const t = (n) => ({ name: n, selector: { text: {} } });
    const x = (name, title, schema) => ({ type: "expandable", name, title, flatten: true, schema });
    const L = {
      title: "Titel", subtitle: "Untertitel", icon: "Symbol",
      cpu_entity: "CPU-Auslastung", temperature_entity: "CPU-Temperatur", power_entity: "Netzteil / Unterspannung",
      memory_title: "Titel", memory_percent_entity: "RAM belegt (%)",
      memory_used_entity: "RAM belegt", memory_free_entity: "RAM frei",
      disk_title: "Titel", disk_percent_entity: "Speicher belegt (%)",
      disk_used_entity: "Speicher belegt", disk_free_entity: "Speicher frei",
      last_start_entity: "Letzter Start",
    };
    return {
      schema: [
        x("general", "Allgemein", [t("title"), t("subtitle"), { name: "icon", selector: { icon: {} } }]),
        x("system", "System", [e("cpu_entity"), e("temperature_entity"), e("power_entity")]),
        x("memory", "Arbeitsspeicher", [t("memory_title"), e("memory_percent_entity"), e("memory_used_entity"), e("memory_free_entity")]),
        x("disk", "Speicher", [t("disk_title"), e("disk_percent_entity"), e("disk_used_entity"), e("disk_free_entity")]),
        x("boot", "Start", [e("last_start_entity")]),
      ],
      computeLabel: (s) => L[s.name],
    };
  }

  setConfig(c) {
    this._config = { ...DEF, ...c };
    this.render();
  }

  set hass(h) {
    this._hass = h;
    this.render();
  }
  get hass() {
    return this._hass;
  }

  // Sections-Dashboard: Breite per Größen-Griff (3–12 Spalten), Höhe ergibt sich automatisch
  getGridOptions() {
    return { columns: 12, min_columns: 3 };
  }

  // Masonry-Dashboard: ungefähre Höhe in Zeilen (je ca. 50 px)
  getCardSize() {
    return 4;
  }

  // ---------- Helfer ----------
  _s(id) { return id && this._hass?.states?.[id]; }

  _f(id) {
    const s = this._s(id);
    if (!s) return "—";
    try {
      if (this._hass?.formatEntityState) return this._hass.formatEntityState(s);
    } catch (_) { /* Fallback unten */ }
    const u = s.attributes?.unit_of_measurement;
    return `${s.state}${u ? ` ${u}` : ""}`;
  }

  _n(id) {
    const s = this._s(id);
    const n = Number(String(s?.state ?? "").replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }

  _e(v) {
    return String(v ?? "")
      .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }

  // Farbe nach Schwellwerten (warn/err): höher = schlechter
  _level(id, warn, err) {
    const n = this._n(id);
    if (!Number.isFinite(n)) return "neutral";
    if (n >= err) return "error";
    if (n >= warn) return "warning";
    return "success";
  }

  _more(id) {
    if (id) this.dispatchEvent(new CustomEvent("hass-more-info", { bubbles: true, composed: true, detail: { entityId: id } }));
  }

  // ---------- Bausteine ----------
  _metric(icon, id, label, tone = "neutral") {
    return `<button class="metric tone-${tone}" data-more="${this._e(id)}">
      <ha-icon icon="${icon}"></ha-icon>
      <span><b>${this._e(this._f(id))}</b><small>${label}</small></span>
    </button>`;
  }

  // Netzteil (binary_sensor.rpi_power_status): on = Unterspannung erkannt
  _power(id) {
    const s = this._s(id);
    const low = s?.state === "on";
    const na = !s || ["unavailable", "unknown"].includes(s.state);
    const text = na ? "—" : low ? "Warnung" : "OK";
    const label = low ? "Spannung" : "Netzteil";
    const tone = na ? "neutral" : low ? "error" : "success";
    const icon = low ? "mdi:flash-alert" : "mdi:power-plug-battery-outline";
    return `<button class="metric tone-${tone}" data-more="${this._e(id)}">
      <ha-icon icon="${icon}"></ha-icon>
      <span><b>${text}</b><small>${label}</small></span>
    </button>`;
  }

  // Zeile mit Fortschrittsbalken: Prozent + Belegt/Frei
  _bar(icon, title, percentId, usedId, freeId, warn, err) {
    const p = Math.max(0, Math.min(100, this._n(percentId) || 0));
    const tone = this._level(percentId, warn, err);
    return `<button class="row tone-${tone}" data-more="${this._e(percentId)}">
      <ha-icon icon="${icon}"></ha-icon>
      <div class="rbody">
        <div class="rtop"><b>${this._e(title)}</b><span>${this._e(this._f(percentId))}</span></div>
        <div class="bar"><i style="width:${p}%"></i></div>
        <small>
          <span class="lnk" data-more="${this._e(usedId)}">Belegt ${this._e(this._f(usedId))}</span>
          <span class="lnk" data-more="${this._e(freeId)}">Frei ${this._e(this._f(freeId))}</span>
        </small>
      </div>
    </button>`;
  }

  render() {
    if (!this.shadowRoot) return;
    const c = this._config;

    this.shadowRoot.innerHTML = `<style>${SystemMonitorCard.css}</style>
<ha-card><main>

  <div class="head">
    <span class="ticon"><ha-icon icon="${this._e(c.icon || "mdi:raspberry-pi")}"></ha-icon></span>
    <div><h1>${this._e(c.title)}</h1><p>${this._e(c.subtitle)}</p></div>
  </div>

  <div class="metrics">
    ${this._metric("mdi:chip", c.cpu_entity, "CPU", this._level(c.cpu_entity, 60, 85))}
    ${this._metric("mdi:thermometer", c.temperature_entity, "Temperatur", this._level(c.temperature_entity, 60, 75))}
    ${this._power(c.power_entity)}
  </div>

  ${this._bar("mdi:memory", c.memory_title, c.memory_percent_entity, c.memory_used_entity, c.memory_free_entity, 70, 90)}
  ${this._bar("mdi:harddisk", c.disk_title, c.disk_percent_entity, c.disk_used_entity, c.disk_free_entity, 75, 90)}

  <button class="boot" data-more="${this._e(c.last_start_entity)}">
    <ha-icon icon="mdi:restart"></ha-icon>
    <span>Letzter Start</span><b>${this._e(this._f(c.last_start_entity))}</b>
  </button>

</main></ha-card>`;

    this.shadowRoot.querySelectorAll("[data-more]").forEach((x) => {
      x.onclick = (ev) => { ev.stopPropagation(); this._more(x.dataset.more); };
    });
  }

  static get css() {
    return `
:host{display:block;width:100%;
  --bg:var(--ha-card-background,var(--card-background-color,#fff));
  --txt:var(--primary-text-color,#111);
  --mut:var(--secondary-text-color,#777);
  --pri:var(--primary-color,#03a9f4);
  --ok:var(--success-color,#4caf50);
  --warn:var(--warning-color,#ff9800);
  --err:var(--error-color,#f44336);
  --bord:color-mix(in srgb,var(--divider-color,#888) 65%,transparent);
  --pan:color-mix(in srgb,var(--bg) 92%,var(--pri) 8%)}
*{box-sizing:border-box}
button{font:inherit;color:inherit;cursor:pointer;text-align:left}
ha-card{overflow:hidden;color:var(--txt);
  background:radial-gradient(circle at 90% 0,color-mix(in srgb,var(--pri) 14%,transparent),transparent 34%),var(--bg);
  border:1px solid var(--bord);border-radius:var(--ha-card-border-radius,18px)}
main{padding:10px;display:grid;gap:7px}
.tone-success{color:var(--ok)}.tone-warning{color:var(--warn)}.tone-error{color:var(--err)}.tone-neutral{color:var(--pri)}

.head{display:flex;align-items:center;gap:10px;padding:2px 2px 0}
.ticon{display:grid;place-items:center;width:38px;height:38px;border-radius:11px;background:color-mix(in srgb,var(--pri) 16%,transparent);color:var(--pri)}
.ticon ha-icon{--mdc-icon-size:22px}
h1{margin:0;font-size:18px;line-height:1.1}
.head p{margin:3px 0 0;color:var(--mut);font-size:12px}

.metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.metric{border:1px solid var(--bord);border-radius:11px;background:color-mix(in srgb,var(--bg) 78%,transparent);padding:7px 9px;display:flex;align-items:center;gap:7px;min-width:0}
.metric>ha-icon{--mdc-icon-size:21px;flex:none}
.metric span{display:flex;flex-direction:column;gap:1px;min-width:0}
.metric b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--txt);font-size:14px}
.metric small{color:var(--mut);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

.row{width:100%;border:1px solid var(--bord);border-radius:13px;padding:8px 11px;display:flex;align-items:center;gap:10px;
  background:linear-gradient(135deg,color-mix(in srgb,var(--pan) 88%,var(--pri) 12%),var(--pan))}
.row>ha-icon{--mdc-icon-size:24px;flex:none}
.rbody{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px}
.rtop{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.rtop b{color:var(--txt);font-size:14px}
.rtop span{color:var(--txt);font-weight:600;font-size:14px}
.bar{height:6px;border-radius:999px;background:color-mix(in srgb,var(--mut) 28%,transparent);overflow:hidden}
.bar i{display:block;height:100%;border-radius:inherit;background:currentColor;transition:width .4s}
.rbody small{display:flex;justify-content:space-between;gap:8px;color:var(--mut);font-size:11px}
.lnk:hover{text-decoration:underline}

.boot{border:0;background:transparent;color:var(--mut);font-size:12px;display:flex;align-items:center;gap:6px;padding:0 4px}
.boot ha-icon{--mdc-icon-size:16px}
.boot b{color:var(--txt);font-weight:600;margin-left:auto}

@media(max-width:380px){
  .metric{padding:6px 7px;gap:5px}
  .metric>ha-icon{--mdc-icon-size:18px}
  .metric b{font-size:13px}
}`;
  }
}

if (!customElements.get("system-monitor")) customElements.define("system-monitor", SystemMonitorCard);

window.customCards = window.customCards || [];
if (!window.customCards.some((c) => c.type === "system-monitor")) {
  window.customCards.push({
    type: "system-monitor",
    name: "System Monitor",
    description: "Kompakte Monitoring-Karte für einen Host, z. B. Raspberry Pi 5 (Integration System Monitor).",
    preview: true,
  });
}
console.info(`System Monitor Card v${SYSTEM_MONITOR_CARD_VERSION}`);
