import fs from 'fs';
import path from 'path';

export interface GrotaUrsuluiSettings {
  status: string;
  isOpen: boolean;
  schedule: string;
  days: string;
  hours: string;
  adultPrice: number;
  childPrice: number;
  currency: string;
  specialNote: string;
  phoneContact: string;
  location: string;
  routeLength: string;
  temperature: string;
  lastUpdated: string;
}

export interface ViaFerrataSettings {
  status: string;
  schedule: string;
  priceNote: string;
  equipmentRentalPrice: string;
  length: string;
  grade: string;
  location: string;
  lastUpdated: string;
}

export interface AttractionSettings {
  status: string;
  schedule: string;
  priceNote: string;
  location: string;
  lastUpdated: string;
}

export interface DynamicSiteSettings {
  grotaUrsului: GrotaUrsuluiSettings;
  viaFerrata: ViaFerrataSettings;
  pesteraLiliecilor: AttractionSettings;
  belvedere: AttractionSettings;
}

const SETTINGS_PATH = path.join(process.cwd(), 'src/content/dynamic-settings.json');

const DEFAULT_SETTINGS: DynamicSiteSettings = {
  "grotaUrsului": {
    "status": "Deschis în weekend",
    "isOpen": true,
    "schedule": "Sâmbătă și duminică: 11:00 – 16:00",
    "days": "Sâmbătă și duminică",
    "hours": "11:00 – 16:00",
    "adultPrice": 20,
    "childPrice": 10,
    "currency": "lei",
    "specialNote": "Adulți și copii peste 14 ani: 20 lei. Copii până la 14 ani: 10 lei. Gratuit: sub 5 ani, speologi, salvamontiști și salvaspeo legitimați. În afara programului, grupurile organizate pot vizita pe bază de programare.",
    "phoneContact": "+40 770 846 001",
    "location": "Moneasa, Munții Codru-Moma, Județul Arad",
    "routeLength": "cca. 200 m",
    "temperature": "10 – 12 °C",
    "lastUpdated": "2026-11-01"
  },
  "viaFerrata": {
    "status": "Accesibil cu echipament omologat",
    "schedule": "Tot timpul anului, exclusiv în condiții meteo favorabile",
    "priceNote": "Acces gratuit cu echipament propriu omologat",
    "equipmentRentalPrice": "Echipament complet și ghidaj autorizat la cerere",
    "length": "600 m (150 m echipați cu cablu și trepte)",
    "grade": "B (Ușor / Mediu)",
    "location": "Dealul Osoiu, Dezna",
    "lastUpdated": "2026-11-01"
  },
  "pesteraLiliecilor": {
    "status": "Acces pe traseu marcat",
    "schedule": "Marcaj bandă albastră, 1,3 km (~1 oră)",
    "priceNote": "Vizitarea integrală necesită cunoștințe de speologie și echipament adecvat",
    "location": "Moneasa, Hoanca Coului",
    "lastUpdated": "2026-11-01"
  },
  "belvedere": {
    "status": "Traseu turistic marcat",
    "schedule": "Marcaj punct roșu, 2,7 km (~1,5 ore)",
    "priceNote": "Nerecomandat iarna sau pe vreme nefavorabilă",
    "location": "Moneasa, Cariera de Marmură",
    "lastUpdated": "2026-11-01"
  }
};

export function getDynamicSettings(): DynamicSiteSettings {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading dynamic-settings.json, using defaults:', err);
  }
  return DEFAULT_SETTINGS;
}

export function updateDynamicSettings(newSettings: Partial<DynamicSiteSettings>): DynamicSiteSettings {
  const current = getDynamicSettings();
  const merged: DynamicSiteSettings = {
    ...current,
    ...newSettings,
    grotaUrsului: {
      ...current.grotaUrsului,
      ...(newSettings.grotaUrsului || {}),
      lastUpdated: new Date().toISOString().split('T')[0],
    },
    viaFerrata: {
      ...current.viaFerrata,
      ...(newSettings.viaFerrata || {}),
      lastUpdated: new Date().toISOString().split('T')[0],
    },
    pesteraLiliecilor: {
      ...current.pesteraLiliecilor,
      ...(newSettings.pesteraLiliecilor || {}),
      lastUpdated: new Date().toISOString().split('T')[0],
    },
    belvedere: {
      ...current.belvedere,
      ...(newSettings.belvedere || {}),
      lastUpdated: new Date().toISOString().split('T')[0],
    },
  };

  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(merged, null, 2), 'utf-8');

  // Also sync to site-database.json so static snapshots and full database stay in sync
  try {
    const dbPath = path.join(process.cwd(), 'src/content/site-database.json');
    if (fs.existsSync(dbPath)) {
      const rawDb = fs.readFileSync(dbPath, 'utf-8');
      const db = JSON.parse(rawDb);
      const grotaPage = db.pages?.find((p: any) => p.path === '/grota-ursului');
      if (grotaPage) {
        grotaPage.scheduleSummary = `${merged.grotaUrsului.days}: ${merged.grotaUrsului.hours} (sau în afara programului pentru grupuri organizate, pe bază de programare)`;
        grotaPage.pricingSummary = `Adulți și copii peste 14 ani: ${merged.grotaUrsului.adultPrice} lei | Copii până la 14 ani: ${merged.grotaUrsului.childPrice} lei | Sub 5 ani, speologi, salvamontiști și salvaspeo legitimați: Gratuit (valabil în programul de vizitare; necesită confirmare curentă)`;
      }
      const vfPage = db.pages?.find((p: any) => p.path === '/via-ferrata-cetate-dezna');
      if (vfPage) {
        vfPage.scheduleSummary = merged.viaFerrata.schedule;
        vfPage.pricingSummary = `${merged.viaFerrata.priceNote}. ${merged.viaFerrata.equipmentRentalPrice}.`;
      }
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error syncing dynamic settings to site-database.json:', err);
  }

  return merged;
}

