'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  FileText,
  Filter,
} from 'lucide-react';
import { TiledMosaicGallery, type MosaicImageItem } from '@/components/TiledMosaicGallery';

export interface EquipmentModelSpec {
  model: string;
  badge: string;
  specs: string;
  articlePath?: string;
}

export interface EquipmentBrandCatalog {
  slug: string;
  name: string;
  tagline: string;
  categoryGroup: 'lighting' | 'diving' | 'thermal' | 'computers';
  categoryLabel: string;
  logo: string;
  officialWebsite: string;
  summary: string;
  productLines: string[];
  featuredModels: EquipmentModelSpec[];
  gallery: MosaicImageItem[];
}

export const EQUIPMENT_CATALOG: EquipmentBrandCatalog[] = [
  {
    slug: 'fenix',
    name: 'Fenix Lighting',
    tagline: 'Lanterne frontale profesionale pentru speologie, lanterne subacvatice și acumulatori Li-Ion',
    categoryGroup: 'lighting',
    categoryLabel: 'Iluminat Speo & Subacvatic',
    logo: '/media/logos/fenix_logo-e.jpg',
    officialWebsite: 'https://www.fenixlight.com',
    summary:
      'Referința în iluminatul subteran pentru speologi, salvatori montani și exploratori. Construcție din aliaj de aluminiu aviatic și magneziu, etanșeitate IP68 (submersibile la 2 m), rezistență la impact și autonomie extinsă pentru ture lungi în cavernă.',
    productLines: [
      'Lanterne frontale speologie (Seria HM & HP)',
      'Lanterne de mână tactice și industriale',
      'Lanterne subacvatice (Seria SD)',
      'Lanterne pentru bicicletă și camping',
      'Acumulatori Li-Ion 18650 / 21700 și încărcătoare inteligente ARE',
    ],
    featuredModels: [
      {
        model: 'Fenix HM75R',
        badge: '1600 Lumeni · Power Bank',
        specs: 'Corp din aliaj de magneziu · Spot + Flood + Lumină Roșie · Power Bank extern inclus · IP68',
        articlePath: '/2025/01/26/fenix-hm75r-lanterna-frontala-1600-lumeni-223-metri',
      },
      {
        model: 'Fenix HP30R V2.0',
        badge: '3000 Lumeni · Expediție',
        specs: '2× acumulatori 21700 (5000 mAh) în carcasă pe curea/cască · Autonomie până la 120 ore',
        articlePath: '/2023/05/09/fenix-hp30r-v2-0-lanterna-frontala-3000-lumeni-270-metri',
      },
      {
        model: 'Fenix HM70R',
        badge: '1600 Lumeni · 21700',
        specs: 'Acumulator 21700 de mare capacitate · Port USB Type-C ascuns și impermeabil · 100 ore autonomie',
        articlePath: '/2021/12/14/nou-lanterna-frontala-fenix-hm70r-1600-lumeni',
      },
      {
        model: 'Fenix HP16R',
        badge: '1700 Lumeni · Dual Beam',
        specs: 'Reflector dublu (distanță 260 m + difuz de apropiere) · Acumulator Li-Polymer 3000 mAh + compatibil 4×AA',
        articlePath: '/2021/04/03/fenix-hp16r-1700-lumens-high-performance-rechargeable-outdoor-headlamp',
      },
      {
        model: 'Fenix HM65R',
        badge: '1400 Lumeni · Magneziu',
        specs: 'Greutate redusă cu 30% datorită carcasei din magneziu · Spotlight + Floodlight · IP68 submersibilă 2 m',
        articlePath: '/2023/10/21/fenix-hm65r-lanterna-frontala-1400-lumeni-163-metri',
      },
      {
        model: 'Fenix HM65R-T & HM65R-DT',
        badge: '1500 Lumeni · Sistem BOA',
        specs: 'Sistem rapid de ajustare pe cască cu o singură mână · Dublu fascicul alb rece + cald pentru ceață/umiditate',
        articlePath: '/2023/10/21/fenix-hm65r-dt-lanterna-frontala-1500-lumeni-170-metri-dark-purple',
      },
      {
        model: 'Fenix HM61R & HM60R',
        badge: '1200 Lumeni · Multifuncțională',
        specs: 'Detecție a frecvenței pașilor (HM60R) sau corp detașabil în unghi drept cu bază magnetică (HM61R)',
        articlePath: '/2021/04/29/lanterna-frontala-fenix-hm61r-1200-lumeni',
      },
      {
        model: 'Fenix HL32R',
        badge: '600 Lumeni · Ultraușoară',
        specs: 'Lanternă frontală compactă cu acumulator Li-Polymer 2000 mAh integrat · Lumină albă + roșie · IP66',
        articlePath: '/2021/03/31/lanterna-frontala-reincarcabila-fenix-hl32r-600-lumeni',
      },
    ],
    gallery: [
      {
        src: '/media/shop/hp16r-headlamp_web-2400x1800-1.jpg',
        alt: 'Lanternă frontală Fenix HP16R 1700 lumeni',
        caption: 'Fenix HP16R — Sistem cu carcasă de baterii posterioară și fascicul dublu Spot + Flood',
      },
      {
        src: '/media/shop/01.black-2400x1800-1.jpg',
        alt: 'Lanternă frontală Fenix din aliaj de magneziu',
        caption: 'Seria Fenix HM65R / HM70R — Corp metalic etanș IP68 rezistent la șocuri în peșteri',
      },
      {
        src: '/media/shop/01.1-2400x1800-2.jpg',
        alt: 'Lanternă frontală Fenix cu reflector dublu',
        caption: 'Optică dublă pentru iluminare de mare distanță în săli carstice și lumină caldă de apropiere',
      },
      {
        src: '/media/shop/01.1-2400x1800-1.jpg',
        alt: 'Lanternă frontală Fenix HM61R cu bază magnetică',
        caption: 'Fenix HM61R — Lanternă frontală și de lucru în unghi drept cu încărcare magnetică',
      },
      {
        src: '/media/shop/hm70r-01-2400x1800-1.png',
        alt: 'Lanternă frontală Fenix HM70R 1600 lumeni',
        caption: 'Fenix HM70R — Putere de 1600 lumeni alimentată de acumulator 21700 (5000 mAh)',
      },
      {
        src: '/media/shop/are-a2-2400x1800-2400x1800-1.jpg',
        alt: 'Încărcător inteligent Fenix ARE-A2 și acumulatori Li-Ion',
        caption: 'Încărcător inteligent cu afișaj LCD Fenix ARE-A2 pentru acumulatori Li-Ion și Ni-MH',
      },
    ],
  },
  {
    slug: 'tecline',
    name: 'TecLine Scuba Equipment',
    tagline: 'Detentoare ape reci, harnașamente Sidemount & Backmount, faruri canistră și accesorii tehnice',
    categoryGroup: 'diving',
    categoryLabel: 'Scufundări Tehnice & Sidemount',
    logo: '/media/shop/tecline-1.jpg',
    officialWebsite: 'https://teclinediving.eu/',
    summary:
      'Gama completă de echipamente tehnice de scufundare proiectate pentru explorarea sifoanelor, epavelor și scufundări la mare adâncime în ape reci. Configurații modulare DIR, Sidemount și Military Line.',
    productLines: [
      'Detentoare ape reci (V2 ICE, R2 TEC, V1, R5) pentru Sidemount și Twinset',
      'Sisteme compensatoare de flotabilitate (BCD): Aripi Sidemount Avenger/Stealth, Donut și Peanut',
      'Lanterne subacvatice principale cu canistră și backup (LED TecLight)',
      'Manometre tehnice (SPG), console, compasuri și profundimetre',
      'Robineți butelii, manifolduri, lăbuțe Jet/LightJet, măști frameless și moschetoane inox',
    ],
    featuredModels: [
      {
        model: 'Set Sidemount TecLine',
        badge: 'Configurație Sifoane & Restricții',
        specs: 'Harnașament complet + aripă compensatorie dedicată pasajelor înguste și peșterilor scufundate',
        articlePath: '/2021/09/14/oferta-set-sidemount-tecline-15-discount',
      },
      {
        model: 'LED TecLight Standard',
        badge: '3900 Lumeni · Canistră 150 m',
        specs: 'Triplu LED Cree XPL · Unghi fascicul 6° · Autonomie 4h 30min · Canistră Delrin cu mâner Goodman',
        articlePath: '/2021/08/06/led-teclight-standard-3900-lm-military-line',
      },
      {
        model: 'Military Line Special Forces',
        badge: 'Tactic & Intervenție',
        specs: 'Echipamente cu finisaj mat anti-reflex și materiale armate Kevlar pentru scafandri militari și salvare',
        articlePath: '/2022/05/20/military-line-tecline',
      },
      {
        model: 'Detentoare V2 ICE & R2 TEC',
        badge: 'Certificare EN250A Ape Reci',
        specs: 'Traseu optimizat al furtunurilor pentru configurații Sidemount și Twinset în ape de 4–8°C',
        articlePath: '/2023/11/07/hose-holders-for-111-7-liter-aluminum-cylinders-and-other-cylinders-with-a-diameter-of-182-152-mm',
      },
    ],
    gallery: [
      {
        src: '/media/shop/by_przemyslaw_zyber_4-1.jpg',
        alt: 'Set detentoare tehnice TecLine pentru ape reci',
        caption: 'Set complet de detentoare tehnice TecLine cu treapta I compensată cu membrană pentru ape reci',
      },
      {
        src: '/media/shop/photo_by_tomasz_plocinski_2.jpg',
        alt: 'Aripă compensatorie și harnașament tehnic TecLine',
        caption: 'Sistem de flotabilitate (BCD) și harnașament modular TecLine cu placă spate inox/aluminiu',
      },
      {
        src: '/media/shop/dsc8720.jpg',
        alt: 'Echipamente și accesorii tehnice TecLine',
        caption: 'Configurații tehnice, supape, manometre și accesorii din oțel inoxidabil marin TecLine',
      },
      {
        src: '/media/shop/teclight_by_tomasz_plocinski_14.jpg',
        alt: 'Lanternă subacvatică cu canistră TecLine LED TecLight 3900 lumeni',
        caption: 'Far subacvatic cu canistră TecLine LED TecLight 3900 lm și mâner Goodman reglabil',
      },
      {
        src: '/media/cave-diving/41613734_2191457734450778_4376036792281858048_n.jpg',
        alt: 'Gama de echipamente TecLine Scuba Diving',
        caption: 'Lăbuțe tehnice, măști frameless, moschetoane, mulinete (reels) și spool-uri pentru fir ghid',
      },
    ],
  },
  {
    slug: 'ammonite-system',
    name: 'Ammonite System',
    tagline: 'Lanterne subacvatice umbilicale, sisteme video și acumulatori pentru încălzire în costum uscat',
    categoryGroup: 'lighting',
    categoryLabel: 'Iluminat Speo & Subacvatic',
    logo: '/media/shop/ammonite.jpg',
    officialWebsite: 'https://ammonitesystem.com',
    summary:
      'Sisteme modulare de iluminat subacvatic și încălzire activă fabricate în UE din Delrin® și aluminiu anodizat dur, testate în cele mai solicitante explorări de cave diving și scufundări la epave.',
    productLines: [
      'Capete de iluminat umbilicale (LED Solaris, Sunray, MatriX, Sidemount)',
      'Lanterne subacvatice de rezervă (LED LedOne, Tubo, Mini)',
      'Sisteme de iluminare video subacvatică (LED Stingray Video Set)',
      'Acumulatori Li-Ion Accu Type (9 Ah – 24 Ah) și sisteme de încălzire Thermo',
    ],
    featuredModels: [
      {
        model: 'Gama Ammonite Dive Lights & Heating',
        badge: 'Modular · Umbilical & Thermo',
        specs: 'Cabluri interschimbabile Heavy-Duty, conectori etanși și canistre compatibile atât cu faruri cât și cu veste încălzite',
        articlePath: '/2020/11/07/ammonite-system-dive-lights-and-heating-systems',
      },
      {
        model: 'LED Stingray Video Set',
        badge: 'Iluminare Foto-Video Sifoane',
        specs: 'Set dublu de proiectoare video subacvatice cu unghi larg (120°) pentru documentare în galerii inundate',
        articlePath: '/2020/11/07/ammonite-system-dive-lights-and-heating-systems',
      },
    ],
    gallery: [
      {
        src: '/media/cave-diving/ammonite-system_products-2019-1.jpg',
        alt: 'Gama completă de faruri și canistre Ammonite System',
        caption: 'Sisteme modulare Ammonite System — capete LED umbilicale, lanterne backup și canistre Accu',
      },
      {
        src: '/media/shop/10052020-44.jpg',
        alt: 'Lanternă subacvatică umbilicală Ammonite System cu mâner Goodman',
        caption: 'Far principal cu mâner Goodman din aluminiu anodizat și comutator magnetic fără piese penetrante',
      },
      {
        src: '/media/shop/led-stingray-video-set-19.jpg',
        alt: 'Set iluminare video subacvatică Ammonite LED Stingray',
        caption: 'Ammonite LED Stingray Video Set — sistem complet de iluminare pentru filmări subacvatice în peșteri',
      },
    ],
  },
  {
    slug: 'kwark',
    name: 'Kwark Thermal Protection',
    tagline: 'Combinezoane termice Polartec® pentru costum uscat, lenjerie tehnică, cagule și șosete termice',
    categoryGroup: 'thermal',
    categoryLabel: 'Costume Uscate & Protecție Termică',
    logo: '/media/logos/kwark_logo_male.png',
    officialWebsite: '/contact',
    summary:
      'Protecție termică de înaltă performanță concepută special pentru scafandri de peșteră și speologi. Materialele Polartec® Power Stretch® Pro și Windbloc® mențin confortul termic în ape de 4–7°C fără a adăuga flotabilitate excesivă.',
    productLines: [
      'Combinezoane integrale (undersuits) pentru costum uscat (Seria Navy & Aquashell)',
      'Bluze și pantaloni termici din Polartec® Power Stretch® Pro',
      'Veste termice suplimentare pentru decompresii lungi',
      'Cagule, mănuși interioare și șosete termice anatomice',
    ],
    featuredModels: [
      {
        model: 'Kwark Navy Undersuit',
        badge: 'Polartec® Power Stretch® Pro',
        specs: 'Elasticitate pe 4 direcții · Evacuare rapidă a transpirației · Păstrează izolația chiar și umed · Fermoar dublu și orificii pentru P-Valve/încălzire',
        articlePath: '/2021/12/27/discount-10-pentru-persoanele-legitimate-la-frs-corsa-si-ansmr-la-toate-produsele-comercializate-de-transilvania-cave-diving',
      },
      {
        model: 'Kwark Aquashell & Straturi Termice',
        badge: 'Speologie & Scufundări Tehnice',
        specs: 'Protecție hidrofobă și rezistență la vânt, ideală atât sub costumul uscat cât și în explorări speologice',
        articlePath: '/2021/11/21/reduceri-de-pana-la-50-pentru-urmatoarea-gama-de-produse',
      },
    ],
    gallery: [
      {
        src: '/media/cave-diving/kw38530936_2.jpg',
        alt: 'Combinezon termic Kwark pentru costum uscat',
        caption: 'Combinezon integral Kwark pentru costum uscat cu croială anatomică și mobilitate completă',
      },
      {
        src: '/media/shop/kw081943xxl_1.jpg',
        alt: 'Bluză termică Kwark Polartec Power Stretch Pro',
        caption: 'Strat de bază termic Kwark Polartec® Power Stretch® Pro cu guler înalt',
      },
      {
        src: '/media/shop/kw081997s_1.jpg',
        alt: 'Echipament termic Kwark cu protecție la vânt',
        caption: 'Bluză tehnică Kwark pentru protecție termică în medii umede și reci',
      },
      {
        src: '/media/shop/kw081945xs_2.jpg',
        alt: 'Pantaloni termici Kwark pentru costum uscat și speologie',
        caption: 'Pantaloni termici cu cusături plate anti-frecare pentru ture lungi',
      },
      {
        src: '/media/shop/kw081102xs_1.jpg',
        alt: 'Șosete termice Kwark Polartec pentru costum uscat',
        caption: 'Șosete termice Polartec® pentru protecția picioarelor în cizmele costumului uscat',
      },
      {
        src: '/media/shop/kw10990965.jpg',
        alt: 'Cagulă termică Kwark',
        caption: 'Cagulă termică ergonomică pentru speologie și scufundări',
      },
    ],
  },
  {
    slug: 'ur-flex',
    name: 'UR-Flex Diving Hoses',
    tagline: 'Furtunuri profesionale de înaltă și joasă presiune pentru detentoare, manometre și costume uscate',
    categoryGroup: 'diving',
    categoryLabel: 'Scufundări Tehnice & Sidemount',
    logo: '/media/shop/ur-flex-1.jpg',
    officialWebsite: 'http://ur-flex.com/',
    summary:
      'Furtunuri de scufundare extrem de flexibile și rezistente la abraziune, disponibile într-o gamă completă de lungimi (de la 15 cm la 210 cm long-hose) pentru configurarea curată a echipamentelor Sidemount, Twinset și Stage.',
    productLines: [
      'Furtunuri de joasă presiune (LP) cu înveliș împletit din nylon (Braided) sau cauciuc',
      'Furtunuri de înaltă presiune (HP) armate cu Kevlar pentru manometre (SPG)',
      'Furtunuri inflator pentru aripă compensatorie (BCD) și costum uscat (Drysuit)',
    ],
    featuredModels: [
      {
        model: 'Furtunuri LP Braided & Cauciuc (15–210 cm)',
        badge: 'Joasă Presiune · Rutare Sidemount/DIR',
        specs: 'Rezistență la îndoire (kink-resistant) și flexibilitate superioară în apă rece',
        articlePath: '/2023/11/07/hose-holders-for-111-7-liter-aluminum-cylinders-and-other-cylinders-with-a-diameter-of-182-152-mm',
      },
      {
        model: 'Furtunuri HP Kevlar / Cauciuc pentru SPG',
        badge: 'Înaltă Presiune · 300+ Bar',
        specs: 'Diametru redus sau profil clasic din cauciuc cu protecție ridicată la frecarea de calcar',
        articlePath: '/2021/11/21/reduceri-de-pana-la-50-pentru-urmatoarea-gama-de-produse',
      },
    ],
    gallery: [
      {
        src: '/media/cave-diving/ur38regbnred.jpg',
        alt: 'Furtunuri de joasă presiune împletite UR-Flex',
        caption: 'Furtunuri de joasă presiune (LP) UR-Flex cu împletitură dublă din nylon și racorduri cromate',
      },
      {
        src: '/media/shop/urhprubla.jpg',
        alt: 'Furtunuri de înaltă presiune din cauciuc UR-Flex',
        caption: 'Furtunuri de înaltă presiune (HP) și joasă presiune din cauciuc tehnic rezistent la abraziune',
      },
    ],
  },
  {
    slug: 'bauer-kompressoren',
    name: 'Bauer Kompressoren',
    tagline: 'Compresoare de înaltă presiune (225/330 bar), sisteme Nitrox/Trimix și rampe de stocare aer',
    categoryGroup: 'computers',
    categoryLabel: 'Computere Tehnice & Compresoare',
    logo: '/media/logos/2018-10_logo_bauer_certified_partner_rgb.jpg',
    officialWebsite: 'https://www.bauer-kompressoren.de',
    summary:
      'Liderul mondial în compresoare de înaltă presiune pentru aer respirabil, sisteme de amestecuri gazoase (Nitrox & Trimix) și instalații de umplere pentru scafandri tehnici, baze de salvare și unități de intervenție.',
    productLines: [
      'Compresoare portabile de expediție (Junior II, Oceanus, Capitano, Mariner)',
      'Compresoare staționare insonorizate (Seria PE-VE, Mini-Verticus, Verticus)',
      'Sisteme de preparare amestecuri Nitrox și Trimix (B-Blending / Membrane)',
      'Panouri de umplere, rampe de stocare la 300 bar, filtre P21/P41 și sisteme B-Timer / B-Securus',
    ],
    featuredModels: [
      {
        model: 'Bauer Junior II (Benzină / Electric)',
        badge: '100 l/min · 225 / 330 Bar',
        specs: 'Compresorul portabil etalon pentru expediții de cave diving · Filtrare B-Timer și șasiu anticoroziv',
        articlePath: '/2025/01/25/junior-ii-30th-anniversary-%f0%9f%8e%89',
      },
      {
        model: 'Bauer Mariner 250 / 320',
        badge: '250–320 l/min · Profi-Line',
        specs: 'Bloc compresor în 3 sau 4 trepte cu răcire intensivă pentru utilizare continuă pe teren',
        articlePath: '/2025/01/25/junior-ii-30th-anniversary-%f0%9f%8e%89',
      },
      {
        model: 'Sisteme OX-Blending & Verticus',
        badge: 'Nitrox / Trimix & Stații Umplere',
        specs: 'Stații complete de preparare amestecuri respiratorii, stocare și panouri de distribuție multiplă',
        articlePath: '/2021/12/27/discount-10-pentru-persoanele-legitimate-la-frs-corsa-si-ansmr-la-toate-produsele-comercializate-de-transilvania-cave-diving',
      },
    ],
    gallery: [
      {
        src: '/media/shop/csm_mariner-250-b01_23cdbaa0da.jpg',
        alt: 'Compresor portabil de înaltă presiune Bauer Mariner 250',
        caption: 'Bauer Mariner 250 — Compresor mobil din gama Profi-Line pentru expediții și centre de scufundări',
      },
      {
        src: '/media/cave-diving/csm_junior-2-b-back_646810c7c8.jpg',
        alt: 'Compresor portabil Bauer Junior II cu motor termic',
        caption: 'Bauer Junior II-B — Compresor ultracompact cu motor pe benzină pentru teren izolat',
      },
      {
        src: '/media/shop/csm_mariner-ox-blending_c1cd7c46fe.jpg',
        alt: 'Sistem Bauer pentru preparare amestecuri Nitrox și Trimix',
        caption: 'Sistem integrat Bauer pentru prepararea în siguranță a amestecurilor Nitrox și Trimix',
      },
      {
        src: '/media/shop/csm_pe-ve-550-open-fill-panels_6a0c7f1bdc.jpg',
        alt: 'Stație de umplere și panouri de distribuție Bauer PE-VE',
        caption: 'Panouri de umplere și rampe de înaltă presiune Bauer pentru încărcarea simultană a buteliilor',
      },
      {
        src: '/media/shop/csm_verticus-super-silent-filling-hose_1e633a6ca6-2.jpg',
        alt: 'Compresor staționar insonorizat Bauer Verticus Super Silent',
        caption: 'Bauer Verticus Super Silent — Stație staționară cu monitorizare electronică a purității aerului',
      },
    ],
  },
  {
    slug: 'ursuit',
    name: 'Ursuit Drysuits',
    tagline: 'Costume uscate trilaminate din Cordura® pentru cave diving, lucrări subacvatice și salvare',
    categoryGroup: 'thermal',
    categoryLabel: 'Costume Uscate & Protecție Termică',
    logo: '/media/shop/ursuit.jpg',
    officialWebsite: 'https://www.ursuit.com',
    summary:
      'Fabricate în Finlanda pentru cele mai dure condiții subacvatice și de suprafață. Costumele uscate Ursuit utilizează construcție trilaminată cu cusături dublu sigilate (Flat Seam), întărituri din Cordura® și Kevlar® și croială telescopică.',
    productLines: [
      'Costume uscate trilaminate pentru scufundări tehnice și în peșteri (Heavy Light 2.0, Cordura FZ, Softdura)',
      'Costume uscate de intervenție și salvare în ape rapide / inundații (Rescue 2.0, MPS)',
      'Combinezoane interioare (X-Tex Finnfill) și accesorii originale Ursuit',
    ],
    featuredModels: [
      {
        model: 'Ursuit Heavy Light 2.0',
        badge: 'Trilaminat Cave & Tech Diving',
        specs: 'Fermoar frontal cu clapetă de protecție · Torso telescopic · Buzunare tehnice mari pe coapse și genunchiere Kevlar®',
        articlePath: '/2021/12/27/discount-10-pentru-persoanele-legitimate-la-frs-corsa-si-ansmr-la-toate-produsele-comercializate-de-transilvania-cave-diving',
      },
      {
        model: 'Ursuit Rescue 2.0 & Pursuit X3',
        badge: 'Salvare Acvatică & Speologie Activă',
        specs: 'Material Gore-Tex® / 4-Tex® respirabil și impermeabil pentru echipe de salvare montană, speologică și acvatică',
        articlePath: '/2021/12/27/discount-10-pentru-persoanele-legitimate-la-frs-corsa-si-ansmr-la-toate-produsele-comercializate-de-transilvania-cave-diving',
      },
    ],
    gallery: [
      {
        src: '/media/cave-diving/009640_rescue2.0_l1.png',
        alt: 'Costum uscat de salvare Ursuit Rescue 2.0',
        caption: 'Ursuit Rescue 2.0 — Costum uscat de intervenție și salvare cu vizibilitate ridicată',
      },
      {
        src: '/media/shop/heavy_light_2-0_72dpi_2_l.png',
        alt: 'Costum uscat trilaminat Ursuit Heavy Light 2.0',
        caption: 'Ursuit Heavy Light 2.0 — Costum uscat trilaminat cu fermoar frontal și buzunare cargo tehnice',
      },
      {
        src: '/media/shop/004202_pursuitx3_l.png',
        alt: 'Costum uscat Ursuit Pursuit X3',
        caption: 'Ursuit Pursuit X3 — Croială ergonomică și întărituri în zonele de uzură intensă',
      },
    ],
  },
  {
    slug: 'si-tech',
    name: 'Si Tech Drysuit Systems',
    tagline: 'Sisteme modulare de guler și manșete din silicon, mănuși uscate și supape pentru costum uscat',
    categoryGroup: 'thermal',
    categoryLabel: 'Costume Uscate & Protecție Termică',
    logo: '/media/shop/sitech.jpg',
    officialWebsite: 'https://www.sitech.se',
    summary:
      'Producătorul suedez de componente și sisteme modulare pentru costume uscate. Sistemele Si Tech permit înlocuirea imediată pe teren a manșetelor sau a gulerului deteriorat, fără adeziv și fără a pierde scufundarea.',
    productLines: [
      'Sisteme de manșete modulare și mănuși uscate (Quick Cuff, QCP Oval, Antares, Glove Lock QCP)',
      'Sisteme de etanșare la gât cu guler din silicon sau latex (Neck Tite, Quick Neck)',
      'Supape de inflare rotative 360° și supape automate de purjare cu profil redus',
      'Sisteme P-Valve (Argo) și treceri etanșe prin costum pentru cabluri de încălzire (E/O cord)',
    ],
    featuredModels: [
      {
        model: 'Quick Cuff / QCP Oval & Antares',
        badge: 'Mănuși Uscate & Manșete Silicon',
        specs: 'Inele ovale sau rotunde pentru montarea mănușilor uscate și schimbarea manșetelor în câteva minute',
        articlePath: '/2021/12/27/discount-10-pentru-persoanele-legitimate-la-frs-corsa-si-ansmr-la-toate-produsele-comercializate-de-transilvania-cave-diving',
      },
      {
        model: 'Neck Tite & Quick Neck',
        badge: 'Guler Silicon Interschimbabil',
        specs: 'Etanșare confortabilă din silicon hipoalergenic, rezistent la rupere, raze UV și ozon',
        articlePath: '/2021/12/27/discount-10-pentru-persoanele-legitimate-la-frs-corsa-si-ansmr-la-toate-produsele-comercializate-de-transilvania-cave-diving',
      },
      {
        model: 'Supape Inflare / Purjare & Argo P-Valve',
        badge: 'Control Flotabilitate & Decompresie',
        specs: 'Debit precis de aer și supapă de echilibrare fiziologică pentru scufundări tehnice de lungă durată',
        articlePath: '/2021/12/27/discount-10-pentru-persoanele-legitimate-la-frs-corsa-si-ansmr-la-toate-produsele-comercializate-de-transilvania-cave-diving',
      },
    ],
    gallery: [
      {
        src: '/media/shop/productsimagemap.jpg',
        alt: 'Arhitectura sistemelor modulare Si Tech pe costumul uscat',
        caption: 'Harta completă a componentelor Si Tech pentru echiparea unui costum uscat tehnic',
      },
      {
        src: '/media/shop/2.jpg',
        alt: 'Sistem de guler modular Si Tech Quick Neck / Neck Tite',
        caption: 'Sistem modular de etanșare la gât Si Tech cu guler din silicon schimbabil pe teren',
      },
      {
        src: '/media/shop/1-1.jpg',
        alt: 'Inele și manșete Si Tech Quick Cuff pentru mănuși uscate',
        caption: 'Sistem de inele Si Tech pentru manșete din silicon și atașarea mănușilor uscate',
      },
      {
        src: '/media/shop/imagegen.ashx_-2.jpg',
        alt: 'Supapă de inflare și purjare Si Tech pentru costum uscat',
        caption: 'Supape Si Tech de înaltă fiabilitate pentru controlul volumului de gaz din costumul uscat',
      },
      {
        src: '/media/shop/3.jpg',
        alt: 'Valvă P-Valve și accesorii Si Tech',
        caption: ' Componente și accesorii originale Si Tech pentru scufundări cu decompresie',
      },
    ],
  },
  {
    slug: 'shearwater',
    name: 'Shearwater Research',
    tagline: 'Computere de scufundări tehnice multi-gaz (Aer, Nitrox, Trimix, CCR) cu integrare wireless AI',
    categoryGroup: 'computers',
    categoryLabel: 'Computere Tehnice & Compresoare',
    logo: '/media/logos/logo-1.png',
    officialWebsite: 'https://www.shearwater.com',
    summary:
      'Standardul global în computere de scufundări tehnice și cave diving. Proiectate și fabricate în Canada, computerele Shearwater oferă ecrane luminoase lizibile în vizibilitate zero, meniuri intuitive cu două butoane și algoritm Bühlmann ZHL-16C cu Gradient Factors.',
    productLines: [
      'Computere tehnice de mână cu integrare aer (Perdix AI / Perdix 2, Petrel 3)',
      'Computere tehnice format ceas cu cristal de safir (Teric)',
      'Monitoare Near-Eye (HUD) pentru rebreather și vizibilitate redusă (NERD 2)',
      'Transmițătoare wireless de presiune (Swift AI) pentru monitorizarea simultană a până la 4 butelii (Sidemount / Stage)',
    ],
    featuredModels: [
      {
        model: 'Shearwater Perdix AI',
        badge: 'Standardul în Cave Diving',
        specs: 'OC Rec, OC Tec (5 gaze Nitrox/Trimix), CCR și Gauge · Baterie AA schimbabilă de utilizator · Până la 4 transmițătoare AI (ideal pentru Sidemount)',
        articlePath: '/2021/12/27/discount-10-pentru-persoanele-legitimate-la-frs-corsa-si-ansmr-la-toate-produsele-comercializate-de-transilvania-cave-diving',
      },
      {
        model: 'Shearwater Teric',
        badge: 'OLED Safir · Multi-Gaz & AI',
        specs: 'Ecran AMOLED full-color · Carcasă din oțel inoxidabil 316 și sticlă de safir · Alarme cu vibrații și busolă digitală compensată 3D',
        articlePath: '/2021/11/21/reduceri-de-pana-la-50-pentru-urmatoarea-gama-de-produse',
      },
      {
        model: 'Shearwater NERD 2',
        badge: 'Near-Eye Remote Display',
        specs: 'Micro-display optic montat pe detentor — toți parametrii vitali rămân permanent în câmpul vizual',
        articlePath: '/2021/12/27/discount-10-pentru-persoanele-legitimate-la-frs-corsa-si-ansmr-la-toate-produsele-comercializate-de-transilvania-cave-diving',
      },
    ],
    gallery: [
      {
        src: '/media/shop/teric-product-page-image-1.png',
        alt: 'Computer de scufundări tehnice Shearwater Teric',
        caption: 'Shearwater Teric — Computer tehnic multi-gaz cu ecran AMOLED, cristal de safir și integrare wireless AI',
      },
      {
        src: '/media/cave-diving/ai-product-page-image-1.png',
        alt: 'Computer de scufundări tehnice Shearwater Perdix AI cu transmițător',
        caption: 'Shearwater Perdix AI — Monitorizare simultană a presiunii din buteliile Sidemount/Twinset și calcul decompresie Trimix',
      },
      {
        src: '/media/shop/nerd-2-product-page-1.png',
        alt: 'Computer de scufundări Shearwater NERD 2 Near-Eye Remote Display',
        caption: 'Shearwater NERD 2 — Afișaj optic montat pe detentor pentru citirea instantanee a datelor în sifoane cu vizibilitate redusă',
      },
    ],
  },
];

const CATEGORY_TABS = [
  { id: 'all', label: 'Toate Echipamentele (9 Branduri)' },
  { id: 'lighting', label: 'Iluminat Speo & Subacvatic (Fenix, Ammonite)' },
  { id: 'diving', label: 'Scufundări & Sidemount (TecLine, UR-Flex)' },
  { id: 'thermal', label: 'Costume Uscate & Termice (Ursuit, Kwark, Si Tech)' },
  { id: 'computers', label: 'Computere & Compresoare (Shearwater, Bauer)' },
] as const;

interface EquipmentShowcaseProps {
  compact?: boolean;
}

export function EquipmentShowcase({ compact = false }: EquipmentShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string | null>(null);

  const filteredBrands = EQUIPMENT_CATALOG.filter((b) => {
    if (selectedBrandSlug) return b.slug === selectedBrandSlug;
    if (activeCategory === 'all') return true;
    return b.categoryGroup === activeCategory;
  });

  if (compact) {
    // Homepage Showcase Mode: Rich interactive brand & product showcase with real product photos & models
    return (
      <div className="space-y-8">
        {/* Quick Brand Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-karst-600 text-limestone-50 shadow-md'
                    : 'border border-cavern-700 bg-cavern-800/90 text-limestone-200 hover:border-karst-500/60 hover:text-limestone-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBrands.map((brand) => (
            <article
              key={brand.slug}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-cavern-700 bg-cavern-800/95 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-karst-500/70"
            >
              <div>
                {/* Brand Header Bar with Official Uncropped Logo */}
                <div className="flex items-center gap-3.5 border-b border-cavern-700/80 bg-cavern-900/90 px-5 py-3.5">
                  <div className="flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-cavern-600 bg-white p-1 shadow-sm">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-limestone-50">
                      {brand.name}
                    </h3>
                    <p className="text-[11px] font-medium text-karst-400">
                      {brand.categoryLabel}
                    </p>
                  </div>
                </div>

                {/* Uncropped Product Preview Strip (2 real product photos side-by-side at full visibility) */}
                <div className="grid grid-cols-2 gap-1.5 bg-cavern-950 p-2">
                  {brand.gallery.slice(0, 2).map((img, i) => (
                    <div
                      key={i}
                      className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border border-cavern-800 bg-cavern-900 p-1"
                    >
                      <img
                        src={img.src}
                        alt={img.alt || brand.name}
                        loading="lazy"
                        className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>

                {/* Body */}
                <div className="p-5">
                  <p className="text-xs leading-relaxed text-limestone-200 line-clamp-3">
                    {brand.summary}
                  </p>

                  {/* Top Featured Models */}
                  <div className="mt-4 space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-limestone-400">
                      Modele și linii principale:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {brand.featuredModels.slice(0, 3).map((m) => (
                        <span
                          key={m.model}
                          className="inline-flex items-center rounded-md border border-cavern-700 bg-cavern-900 px-2 py-0.5 text-[11px] font-medium text-limestone-100"
                        >
                          {m.model}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-cavern-700/80 bg-cavern-900/50 px-5 py-3.5">
                <span className="text-xs text-limestone-300">
                  {brand.gallery.length} imagini produse
                </span>
                <Link
                  href={`/magazin#brand-${brand.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-karst-400 transition group-hover:translate-x-0.5 hover:text-karst-300"
                >
                  Vezi catalogul {brand.name} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  // Full /magazin Page Professional Representation
  return (
    <div className="space-y-12">
      {/* Interactive Filter & Brand Selector Bar */}
      <div className="rounded-2xl border border-cavern-700 bg-cavern-800/90 p-5 sm:p-6 shadow-lg space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cavern-700 pb-4">
          <div className="flex items-center gap-2.5">
            <Filter className="h-5 w-5 text-karst-400" aria-hidden="true" />
            <h2 className="font-serif text-xl font-bold text-limestone-50">
              Explorează Catalogul Oficial pe Categorii și Producători
            </h2>
          </div>
          {selectedBrandSlug && (
            <button
              type="button"
              onClick={() => setSelectedBrandSlug(null)}
              className="rounded-lg border border-karst-500/50 bg-karst-600/20 px-3 py-1 text-xs font-semibold text-karst-300 hover:bg-karst-600/30"
            >
              Afișează toate cele 9 branduri ✕
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeCategory === tab.id && !selectedBrandSlug;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedBrandSlug(null);
                  setActiveCategory(tab.id);
                }}
                className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-karst-600 text-limestone-50 shadow-md'
                    : 'border border-cavern-700 bg-cavern-900 text-limestone-200 hover:border-karst-500/60 hover:text-limestone-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 9 Official Brand Logos Quick-Jump Strip */}
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-9 pt-1">
          {EQUIPMENT_CATALOG.map((b) => {
            const isSelected = selectedBrandSlug === b.slug;
            return (
              <button
                key={b.slug}
                type="button"
                onClick={() =>
                  setSelectedBrandSlug(isSelected ? null : b.slug)
                }
                className={`group flex flex-col items-center justify-center rounded-xl border p-2.5 transition-all ${
                  isSelected
                    ? 'border-karst-400 bg-cavern-900 ring-2 ring-karst-400/40'
                    : 'border-cavern-700 bg-cavern-900/70 hover:border-cavern-500 hover:bg-cavern-900'
                }`}
              >
                <div className="flex h-11 w-full items-center justify-center overflow-hidden rounded-lg bg-white p-1">
                  <img
                    src={b.logo}
                    alt={b.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition group-hover:scale-105"
                  />
                </div>
                <span className="mt-1.5 line-clamp-1 text-[11px] font-semibold text-limestone-200 group-hover:text-karst-400">
                  {b.name.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Brand Showcases with Original Tiled Product Galleries */}
      <div className="space-y-14">
        {filteredBrands.map((brand) => (
          <section
            key={brand.slug}
            id={`brand-${brand.slug}`}
            className="scroll-mt-28 overflow-hidden rounded-2xl border border-cavern-700 bg-cavern-800/85 shadow-xl"
          >
            {/* Brand Header Banner */}
            <div className="border-b border-cavern-700 bg-cavern-900/90 p-6 sm:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-cavern-600 bg-white p-2 shadow-md">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-karst-500/40 bg-karst-600/20 px-3 py-0.5 text-xs font-semibold text-karst-300">
                        {brand.categoryLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-limestone-300">
                        <ShieldCheck className="h-3.5 w-3.5 text-karst-400" />
                        Distribuție &amp; Consultanță Tehnică
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-2xl font-bold text-limestone-50 sm:text-3xl">
                      {brand.name}
                    </h3>
                    <p className="mt-1 text-sm text-limestone-200">
                      {brand.tagline}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="tel:+40770846001"
                    className="inline-flex items-center gap-2 rounded-xl bg-karst-600 px-4 py-2.5 text-xs font-semibold text-limestone-50 shadow transition hover:bg-karst-500"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Comandă / Stoc: +40 770 846 001</span>
                  </a>
                  {brand.officialWebsite.startsWith('/') ? (
                    <Link
                      href={brand.officialWebsite}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cavern-600 bg-cavern-800 px-4 py-2.5 text-xs font-medium text-limestone-100 transition hover:border-karst-400 hover:text-karst-400"
                    >
                      <span>Solicită Catalog &amp; Mărimi</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  ) : (
                    <a
                      href={brand.officialWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-cavern-600 bg-cavern-800 px-4 py-2.5 text-xs font-medium text-limestone-100 transition hover:border-karst-400 hover:text-karst-400"
                    >
                      <span>Catalog Oficial Producător</span>
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Brand Content Body */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Description & Product Lines */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-5 space-y-4">
                  <h4 className="font-serif text-lg font-bold text-limestone-50">
                    Despre Echipamentele {brand.name}
                  </h4>
                  <p className="text-sm leading-relaxed text-limestone-200">
                    {brand.summary}
                  </p>
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-karst-400">
                      Gama de produse comercializate:
                    </p>
                    <ul className="space-y-2">
                      {brand.productLines.map((line, lIdx) => (
                        <li
                          key={lIdx}
                          className="flex items-start gap-2.5 text-xs leading-relaxed text-limestone-100"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-karst-400" />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Featured Models & Technical Specs Cards */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-lg font-bold text-limestone-50">
                      Modele Reprezentative și Specificații Tehnice
                    </h4>
                    <span className="text-xs text-limestone-400">
                      Livrare din stoc sau pe comandă
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {brand.featuredModels.map((item) => (
                      <div
                        key={item.model}
                        className="flex flex-col justify-between rounded-xl border border-cavern-700 bg-cavern-900/90 p-4 transition hover:border-karst-500/60"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-serif text-base font-bold text-limestone-50">
                              {item.model}
                            </h5>
                          </div>
                          <span className="mt-1 inline-block rounded bg-cavern-800 px-2 py-0.5 font-mono text-[11px] font-medium text-safety-400 border border-cavern-700">
                            {item.badge}
                          </span>
                          <p className="mt-2.5 text-xs leading-relaxed text-limestone-200">
                            {item.specs}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-cavern-800 pt-2.5">
                          {item.articlePath ? (
                            <Link
                              href={item.articlePath}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-karst-400 hover:underline"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>Fișa tehnică completă</span>
                            </Link>
                          ) : (
                            <span className="text-[11px] text-limestone-400">
                              Configurabil la comandă
                            </span>
                          )}
                          <Link
                            href="/contact"
                            className="text-xs font-semibold text-limestone-200 hover:text-karst-400"
                          >
                            Cere ofertă →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Original Multi-Column Tiled Product Photo Gallery */}
              <div className="border-t border-cavern-700/80 pt-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-limestone-300">
                    Galerie Produse {brand.name} ({brand.gallery.length} imagini — click pentru zoom)
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-karst-400">
                    <Truck className="h-3.5 w-3.5" />
                    Transport gratuit la comenzi peste 300 Lei
                  </span>
                </div>
                <TiledMosaicGallery images={brand.gallery} compact />
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

