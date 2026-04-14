// ====================================================================
// PharmaZone — Complete Medicine Database with Salt & Price Intelligence
// ====================================================================

export const MEDICINES_DB = [
  // ─── PAIN RELIEF ───────────────────────────────────────────────────
  {
    id: 1, name: "Dolo 650", genericName: "Paracetamol", salt: "Paracetamol 650mg",
    saltAnalysis: 'Paracetamol inhibits prostaglandin synthesis in the CNS, reducing fever and pain signals. Rapidly absorbed, peak effect in 30-60 min. Safe at recommended doses; hepatotoxic in overdose.',
    price: 30, category: "Pain Relief", requiresPrescription: false,
    manufacturer: "Micro Labs", uses: "Fever, Headache, Body Pain",
    sideEffects: "Nausea, Liver damage (overdose)",
    platformPrices: [
      { platformName: "PharmEasy",      price: 28, mrp: 30, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 26, mrp: 30, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 30, mrp: 30, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 29, mrp: 30, isCheapest: false, url: "#" },
      { platformName: "Blinkit",        price: 31, mrp: 35, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 3, name: "Calpol 500", genericName: "Paracetamol", salt: "Paracetamol 500mg",
    saltAnalysis: 'Same mechanism as Paracetamol 650mg but lower dose. Ideal for mild fever and headache. Widely regarded as the safest OTC analgesic for all age groups.',
    price: 15, category: "Pain Relief", requiresPrescription: false,
    manufacturer: "GSK", uses: "Mild fever, Headache",
    sideEffects: "Allergic reactions (rare)",
    platformPrices: [
      { platformName: "PharmEasy",      price: 14, mrp: 15, isCheapest: true,  url: "#" },
      { platformName: "Tata 1mg",       price: 15, mrp: 15, isCheapest: false, url: "#" },
      { platformName: "Apollo Pharmacy",price: 15, mrp: 15, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 15, mrp: 15, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 5, name: "Combiflam", genericName: "Ibuprofen + Paracetamol", salt: "Ibuprofen 400mg + Paracetamol 325mg",
    saltAnalysis: 'Dual-action: Ibuprofen (NSAID) blocks COX-1/COX-2 enzymes reducing inflammation, while Paracetamol raises pain threshold centrally. Synergistic effect superior to either alone.',
    price: 34, category: "Pain Relief", requiresPrescription: false,
    manufacturer: "Sanofi India", uses: "Pain, Inflammation, Fever",
    sideEffects: "Stomach upset, Gastric issues",
    platformPrices: [
      { platformName: "PharmEasy",      price: 32, mrp: 34, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 30, mrp: 34, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 34, mrp: 34, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 33, mrp: 34, isCheapest: false, url: "#" },
      { platformName: "Blinkit",        price: 35, mrp: 38, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 6, name: "Brufen 400", genericName: "Ibuprofen", salt: "Ibuprofen 400mg",
    saltAnalysis: 'Non-steroidal anti-inflammatory drug (NSAID). Inhibits COX enzymes, reducing prostaglandin synthesis. Effective for pain, fever, and inflammation. Take with food to avoid gastric irritation.',
    price: 28, category: "Pain Relief", requiresPrescription: false,
    manufacturer: "Abbott India", uses: "Pain, Arthritis, Fever",
    sideEffects: "Stomach pain, Heartburn, Dizziness",
    platformPrices: [
      { platformName: "PharmEasy",      price: 27, mrp: 28, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 25, mrp: 28, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 28, mrp: 28, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 26, mrp: 28, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 7, name: "Voveran 50", genericName: "Diclofenac", salt: "Diclofenac 50mg",
    saltAnalysis: 'Potent NSAID with preferential COX-2 inhibition. Reduces joint inflammation and pain effectively. Requires prescription due to cardiovascular and GI risk with long-term use.',
    price: 22, category: "Pain Relief", requiresPrescription: true,
    manufacturer: "Novartis India", uses: "Joint pain, Arthritis, Inflammation",
    sideEffects: "Gastric ulcer, Cardiovascular risk",
    platformPrices: [
      { platformName: "PharmEasy",      price: 20, mrp: 22, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 19, mrp: 22, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 22, mrp: 22, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 21, mrp: 22, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 8, name: "Zerodol SP", genericName: "Aceclofenac + Serratiopeptidase", salt: "Aceclofenac 100mg + Serratiopeptidase 15mg",
    saltAnalysis: 'Aceclofenac (NSAID) reduces inflammation; Serratiopeptidase (proteolytic enzyme) breaks down fibrin and dead tissue, reducing post-surgical swelling and pain synergistically.',
    price: 65, category: "Pain Relief", requiresPrescription: true,
    manufacturer: "IPCA Labs", uses: "Post-surgery pain, Swelling, Musculoskeletal pain",
    sideEffects: "Nausea, Gastritis, Diarrhea",
    platformPrices: [
      { platformName: "PharmEasy",      price: 62, mrp: 65, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 58, mrp: 65, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 65, mrp: 65, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 63, mrp: 65, isCheapest: false, url: "#" },
      { platformName: "Blinkit",        price: 67, mrp: 70, isCheapest: false, url: "#" },
    ]
  },

  // ─── ANTIBIOTICS ────────────────────────────────────────────────────
  {
    id: 2, name: "Augmentin 625 Duo", genericName: "Amoxicillin + Clavulanate", salt: "Amoxicillin 500mg + Clavulanic Acid 125mg",
    saltAnalysis: 'Amoxicillin is a broad-spectrum penicillin antibiotic. Clavulanic acid is a beta-lactamase inhibitor that prevents bacterial resistance. Together they cover resistant strains of H. influenzae, E. coli, and Staph.',
    price: 201, category: "Antibiotics", requiresPrescription: true,
    manufacturer: "GSK", uses: "Bacterial infections, Sinusitis, Pneumonia",
    sideEffects: "Diarrhea, Skin rash, Nausea",
    platformPrices: [
      { platformName: "PharmEasy",      price: 192, mrp: 201, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 185, mrp: 201, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 201, mrp: 201, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 198, mrp: 201, isCheapest: false, url: "#" },
      { platformName: "Blinkit",        price: 205, mrp: 220, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 10, name: "Azithral 500", genericName: "Azithromycin", salt: "Azithromycin 500mg",
    saltAnalysis: 'Macrolide antibiotic that binds to 50S ribosomal subunit, inhibiting bacterial protein synthesis. Long half-life (68 hrs) allows once-daily dosing. Effective against atypical organisms.',
    price: 110, category: "Antibiotics", requiresPrescription: true,
    manufacturer: "Alembic Pharma", uses: "Chest infections, STIs, Skin infections",
    sideEffects: "Nausea, Abdominal pain, Diarrhea",
    platformPrices: [
      { platformName: "PharmEasy",      price: 105, mrp: 110, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 98,  mrp: 110, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 110, mrp: 110, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 107, mrp: 110, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 11, name: "Cifran 500", genericName: "Ciprofloxacin", salt: "Ciprofloxacin 500mg",
    price: 85, category: "Antibiotics", requiresPrescription: true,
    manufacturer: "Sun Pharma", uses: "UTI, Respiratory infections, Typhoid",
    sideEffects: "Tendon rupture risk, Nausea, Dizziness",
    platformPrices: [
      { platformName: "PharmEasy",      price: 80, mrp: 85, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 76, mrp: 85, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 85, mrp: 85, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 82, mrp: 85, isCheapest: false, url: "#" },
    ]
  },

  // ─── CARDIAC CARE ──────────────────────────────────────────────────
  {
    id: 16, name: "Telma 40", genericName: "Telmisartan", salt: "Telmisartan 40mg",
    price: 88, category: "Cardiac Care", requiresPrescription: true,
    manufacturer: "Glenmark", uses: "Hypertension, Heart failure prevention",
    sideEffects: "Dizziness, Low BP, Hyperkalemia",
    platformPrices: [
      { platformName: "PharmEasy",      price: 84, mrp: 88, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 80, mrp: 88, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 88, mrp: 88, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 86, mrp: 88, isCheapest: false, url: "#" },
      { platformName: "Blinkit",        price: 90, mrp: 95, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 18, name: "Rosuvas 10", genericName: "Rosuvastatin", salt: "Rosuvastatin 10mg",
    price: 133, category: "Cardiac Care", requiresPrescription: true,
    manufacturer: "Sun Pharma", uses: "High cholesterol, Cardiovascular risk reduction",
    sideEffects: "Muscle pain, Liver enzyme elevation",
    platformPrices: [
      { platformName: "PharmEasy",      price: 128, mrp: 133, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 118, mrp: 133, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 133, mrp: 133, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 130, mrp: 133, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 20, name: "Ecosprin 75", genericName: "Aspirin", salt: "Aspirin 75mg",
    saltAnalysis: 'See above — anti-platelet mechanism via COX-1 inhibition.',
    price: 18, category: "Cardiac Care", requiresPrescription: false,
    manufacturer: "USV Pharma", uses: "Blood clot prevention, Heart attack risk",
    sideEffects: "Bleeding risk, Stomach irritation",
    platformPrices: [
      { platformName: "PharmEasy",      price: 16, mrp: 18, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 14, mrp: 18, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 18, mrp: 18, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 17, mrp: 18, isCheapest: false, url: "#" },
    ]
  },

  // ─── DIABETES ───────────────────────────────────────────────────────
  {
    id: 22, name: "Glycomet 500", genericName: "Metformin", salt: "Metformin 500mg",
    saltAnalysis: 'Biguanide class antidiabetic. Activates AMP-kinase, reducing hepatic glucose production (gluconeogenesis) and improving insulin sensitivity in peripheral tissues. Does not cause hypoglycemia.',
    price: 30, category: "Diabetes", requiresPrescription: true,
    manufacturer: "USV Pharma", uses: "Type 2 Diabetes management",
    sideEffects: "Nausea, Diarrhea, Lactic acidosis (rare)",
    platformPrices: [
      { platformName: "PharmEasy",      price: 28, mrp: 30, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 25, mrp: 30, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 30, mrp: 30, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 29, mrp: 30, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 23, name: "Januvia 100", genericName: "Sitagliptin", salt: "Sitagliptin 100mg",
    price: 2650, category: "Diabetes", requiresPrescription: true,
    manufacturer: "MSD Pharma", uses: "Type 2 Diabetes (add-on therapy)",
    sideEffects: "URI risk, Pancreatitis (rare)",
    platformPrices: [
      { platformName: "PharmEasy",      price: 2540, mrp: 2650, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 2490, mrp: 2650, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 2650, mrp: 2650, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 2580, mrp: 2650, isCheapest: false, url: "#" },
    ]
  },

  // ─── THYROID ────────────────────────────────────────────────────────
  {
    id: 4, name: "Thyronorm 50mcg", genericName: "Levothyroxine", salt: "Thyroxine Sodium 50mcg",
    price: 150, category: "Thyroid Care", requiresPrescription: true,
    manufacturer: "Abbott India", uses: "Hypothyroidism, Thyroid replacement therapy",
    sideEffects: "Palpitations, Weight loss (overdose), Insomnia",
    platformPrices: [
      { platformName: "PharmEasy",      price: 142, mrp: 150, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 135, mrp: 150, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 150, mrp: 150, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 145, mrp: 150, isCheapest: false, url: "#" },
    ]
  },

  // ─── SUPPLEMENTS ────────────────────────────────────────────────────
  {
    id: 27, name: "Shelcal 500", genericName: "Calcium + Vitamin D3", salt: "Calcium Carbonate 1250mg + Vitamin D3 250IU",
    price: 145, category: "Supplements", requiresPrescription: false,
    manufacturer: "Elder Pharma", uses: "Calcium deficiency, Osteoporosis prevention",
    sideEffects: "Constipation, Kidney stones (excess)",
    platformPrices: [
      { platformName: "PharmEasy",      price: 138, mrp: 145, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 130, mrp: 145, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 145, mrp: 145, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 140, mrp: 145, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 30, name: "Uprise D3 60K", genericName: "Vitamin D3", salt: "Cholecalciferol 60000 IU",
    saltAnalysis: 'Vitamin D3 megadose. Converted to calcidiol (25-OH D3) in liver, then calcitriol (1,25-OH D3) in kidneys — the active form. Regulates calcium/phosphate homeostasis and immune modulation.',
    price: 185, category: "Supplements", requiresPrescription: false,
    manufacturer: "Zuventus", uses: "Vitamin D deficiency, Bone health",
    sideEffects: "Hypercalcemia (excess)",
    platformPrices: [
      { platformName: "PharmEasy",      price: 175, mrp: 185, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 162, mrp: 185, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 185, mrp: 185, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 178, mrp: 185, isCheapest: false, url: "#" },
    ]
  },

  // ─── GASTRO ─────────────────────────────────────────────────────────
  {
    id: 32, name: "Pantop 40", genericName: "Pantoprazole", salt: "Pantoprazole 40mg",
    saltAnalysis: 'Proton Pump Inhibitor (PPI). Irreversibly inhibits H+/K+-ATPase enzyme in gastric parietal cells, reducing hydrochloric acid secretion by up to 90%. Used for GERD, peptic ulcers.',
    price: 45, category: "Gastro", requiresPrescription: false,
    manufacturer: "Aristo Pharma", uses: "Acid reflux, GERD, Peptic ulcer",
    sideEffects: "Headache, Diarrhea, Hypomagnesemia (long-term)",
    platformPrices: [
      { platformName: "PharmEasy",      price: 42, mrp: 45, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 38, mrp: 45, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 45, mrp: 45, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 43, mrp: 45, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 33, name: "Omez 20", genericName: "Omeprazole", salt: "Omeprazole 20mg",
    price: 42, category: "Gastro", requiresPrescription: false,
    manufacturer: "Dr Reddys", uses: "Acidity, GERD, H. Pylori (with antibiotics)",
    sideEffects: "Headache, Nausea, Vitamin B12 deficiency",
    platformPrices: [
      { platformName: "PharmEasy",      price: 40, mrp: 42, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 36, mrp: 42, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 42, mrp: 42, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 41, mrp: 42, isCheapest: false, url: "#" },
    ]
  },

  // ─── ALLERGY ────────────────────────────────────────────────────────
  {
    id: 37, name: "Allegra 120", genericName: "Fexofenadine", salt: "Fexofenadine 120mg",
    saltAnalysis: 'Third-generation H1 antihistamine. Selectively blocks peripheral H1 receptors without crossing blood-brain barrier, providing non-sedating allergy relief. Effective for 24 hours.',
    price: 175, category: "Allergy", requiresPrescription: false,
    manufacturer: "Sanofi India", uses: "Allergic rhinitis, Urticaria, Hay fever",
    sideEffects: "Headache, Nausea (rare)",
    platformPrices: [
      { platformName: "PharmEasy",      price: 168, mrp: 175, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 155, mrp: 175, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 175, mrp: 175, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 170, mrp: 175, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 38, name: "Cetirizine 10mg", genericName: "Cetirizine", salt: "Cetirizine Hydrochloride 10mg",
    price: 22, category: "Allergy", requiresPrescription: false,
    manufacturer: "Various", uses: "Allergic rhinitis, Itching, Urticaria",
    sideEffects: "Drowsiness, Dry mouth",
    platformPrices: [
      { platformName: "PharmEasy",      price: 20, mrp: 22, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 18, mrp: 22, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 22, mrp: 22, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 21, mrp: 22, isCheapest: false, url: "#" },
    ]
  },

  // ─── MENTAL HEALTH ──────────────────────────────────────────────────
  {
    id: 46, name: "Nexito Plus", genericName: "Escitalopram + Clonazepam", salt: "Escitalopram 10mg + Clonazepam 0.5mg",
    price: 145, category: "Mental Health", requiresPrescription: true,
    manufacturer: "Sun Pharma", uses: "Depression, Anxiety disorders, Panic attacks",
    sideEffects: "Drowsiness, Sexual dysfunction, Withdrawal effects",
    platformPrices: [
      { platformName: "PharmEasy",      price: 138, mrp: 145, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 128, mrp: 145, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 145, mrp: 145, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 140, mrp: 145, isCheapest: false, url: "#" },
    ]
  },

  // ─── DERMATOLOGY ────────────────────────────────────────────────────
  {
    id: 42, name: "Betnovate C", genericName: "Betamethasone + Clioquinol", salt: "Betamethasone 0.1% + Clioquinol 3%",
    saltAnalysis: 'Betamethasone (corticosteroid) reduces skin inflammation. Clioquinol (antimicrobial) treats co-existing bacterial/fungal infection. Combination ideal for infected eczema.',
    price: 88, category: "Dermatology", requiresPrescription: true,
    manufacturer: "GSK", uses: "Skin infections, Eczema, Dermatitis",
    sideEffects: "Skin thinning, Stretch marks (prolonged use)",
    platformPrices: [
      { platformName: "PharmEasy",      price: 84, mrp: 88, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",       price: 79, mrp: 88, isCheapest: true,  url: "#" },
      { platformName: "Apollo Pharmacy",price: 88, mrp: 88, isCheapest: false, url: "#" },
      { platformName: "Netmeds",        price: 85, mrp: 88, isCheapest: false, url: "#" },
    ]
  },
];

// =====================================================================
// AI-Powered Intelligence Engine
// =====================================================================

/**
 * Find the cheapest platform for a given medicine
 */
export const getCheapestPlatform = (medicine) => {
  if (!medicine.platformPrices || medicine.platformPrices.length === 0) return null;
  return medicine.platformPrices.reduce((min, p) => p.price < min.price ? p : min);
};

/**
 * Find generic substitutes by matching active salt/ingredient
 * Smart AI-like matching: exact salt > generic name > category
 */
export const findSubstitutes = (medicine) => {
  const mainSalt = medicine.salt?.split('+')[0]?.trim().toLowerCase() || '';
  const mainGeneric = medicine.genericName?.split('+')[0]?.trim().toLowerCase() || '';

  return MEDICINES_DB
    .filter(m => {
      if (m.id === medicine.id) return false;
      // Tier 1: Same primary salt
      const mSalt = m.salt?.split('+')[0]?.trim().toLowerCase() || '';
      const mGeneric = m.genericName?.split('+')[0]?.trim().toLowerCase() || '';
      return (
        mSalt.includes(mainSalt) ||
        mainSalt.includes(mSalt) ||
        mGeneric.includes(mainGeneric) ||
        mainGeneric.includes(mGeneric)
      );
    })
    .map(m => {
      const cheapest = getCheapestPlatform(m);
      const savings = medicine.price > m.price
        ? Math.round(((medicine.price - m.price) / medicine.price) * 100)
        : 0;
      return { ...m, cheapestPrice: cheapest?.price || m.price, cheapestPlatform: cheapest?.platformName, savings };
    })
    .sort((a, b) => a.cheapestPrice - b.cheapestPrice); // Cheapest first
};

/**
 * Get platform prices sorted cheapest first
 */
export const getSortedPlatformPrices = (medicine) => {
  if (!medicine?.platformPrices) return [];
  return [...medicine.platformPrices].sort((a, b) => a.price - b.price);
};

/**
 * Search medicines by name, genericName or salt
 */
export const searchMedicines = (query) => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return MEDICINES_DB.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.genericName?.toLowerCase().includes(q) ||
    m.salt?.toLowerCase().includes(q) ||
    m.category?.toLowerCase().includes(q) ||
    m.uses?.toLowerCase().includes(q)
  );
};

/**
 * Get medicine by ID
 */
export const getMedicineById = (id) => {
  return MEDICINES_DB.find(m => m.id === parseInt(id));
};

// ─── EXTRA MEDICINES (added for category coverage) ──────────────────────

// Supplements / Vitamins
MEDICINES_DB.push(
  {
    id: 101, name: "Vitamin D3 60K", genericName: "Cholecalciferol", salt: "Cholecalciferol 60000 IU",
    price: 52, category: "Supplements", requiresPrescription: false,
    manufacturer: "Sun Pharma", uses: "Vitamin D deficiency, Bone health, Immunity",
    sideEffects: "Nausea if overdosed",
    platformPrices: [
      { platformName: "PharmEasy",       price: 48, mrp: 52, isCheapest: true,  url: "#" },
      { platformName: "Tata 1mg",        price: 50, mrp: 52, isCheapest: false, url: "#" },
      { platformName: "Apollo Pharmacy", price: 52, mrp: 52, isCheapest: false, url: "#" },
      { platformName: "Netmeds",         price: 51, mrp: 52, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 102, name: "Becosules Capsules", genericName: "Vitamin B-Complex + Vitamin C", salt: "B-Complex + Ascorbic Acid 150mg",
    saltAnalysis: 'Water-soluble vitamin complex. B vitamins are enzyme cofactors in energy metabolism. Ascorbic acid (Vitamin C) is an antioxidant and essential for collagen synthesis and immune function.',
    price: 120, category: "Supplements", requiresPrescription: false,
    manufacturer: "Pfizer", uses: "Vitamin B & C deficiency, Fatigue, Skin health",
    sideEffects: "Nausea, stomach upset (rare)",
    platformPrices: [
      { platformName: "Tata 1mg",        price: 108, mrp: 120, isCheapest: true,  url: "#" },
      { platformName: "PharmEasy",       price: 112, mrp: 120, isCheapest: false, url: "#" },
      { platformName: "Blinkit",         price: 120, mrp: 125, isCheapest: false, url: "#" },
      { platformName: "Netmeds",         price: 115, mrp: 120, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 103, name: "Revital H", genericName: "Multivitamin + Ginseng", salt: "Multivitamin + Minerals + Ginseng",
    saltAnalysis: 'Comprehensive micronutrient supplement. Ginseng (Panax) contains ginsenosides that may enhance physical endurance, reduce fatigue, and modulate cortisol response to stress.',
    price: 320, category: "Supplements", requiresPrescription: false,
    manufacturer: "Ranbaxy (Sun Pharma)", uses: "Daily nutrition, Energy, Stamina",
    sideEffects: "Mild headache (rare)",
    platformPrices: [
      { platformName: "PharmEasy",       price: 288, mrp: 320, isCheapest: true,  url: "#" },
      { platformName: "Tata 1mg",        price: 304, mrp: 320, isCheapest: false, url: "#" },
      { platformName: "Apollo Pharmacy", price: 320, mrp: 320, isCheapest: false, url: "#" },
    ]
  }
);

// Dermatology / Skin
MEDICINES_DB.push(
  {
    id: 104, name: "Betnovate C Cream", genericName: "Betamethasone + Clioquinol", salt: "Betamethasone 0.1% + Clioquinol 3%",
    price: 75, category: "Dermatology", requiresPrescription: true,
    manufacturer: "GSK", uses: "Eczema, Psoriasis, Skin infections with inflammation",
    sideEffects: "Skin thinning on prolonged use",
    platformPrices: [
      { platformName: "NetMeds",         price: 68, mrp: 75, isCheapest: true,  url: "#" },
      { platformName: "PharmEasy",       price: 70, mrp: 75, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",        price: 72, mrp: 75, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 105, name: "Cetaphil Moisturizing Cream", genericName: "Emollient Cream", salt: "Petrolatum + Glycerin",
    saltAnalysis: 'Occlusive emollients that form a protective barrier on skin, preventing transepidermal water loss (TEWL). Glycerin acts as humectant drawing moisture into the stratum corneum.',
    price: 399, category: "Dermatology", requiresPrescription: false,
    manufacturer: "Galderma", uses: "Dry skin, Eczema, Sensitive skin moisturizer",
    sideEffects: "None significant",
    platformPrices: [
      { platformName: "Tata 1mg",        price: 359, mrp: 399, isCheapest: true,  url: "#" },
      { platformName: "Blinkit",         price: 380, mrp: 399, isCheapest: false, url: "#" },
      { platformName: "Apollo Pharmacy", price: 399, mrp: 399, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 106, name: "Candid B Cream", genericName: "Clotrimazole + Beclomethasone", salt: "Clotrimazole 1% + Beclomethasone 0.025%",
    saltAnalysis: 'Clotrimazole inhibits ergosterol synthesis in fungal cell membranes. Beclomethasone reduces the inflammatory response to fungal infection. Combination treats infected dermatitis more effectively.',
    price: 85, category: "Dermatology", requiresPrescription: true,
    manufacturer: "Glenmark", uses: "Fungal infections, Ringworm, Jock itch with inflammation",
    sideEffects: "Burning sensation, Skin dryness",
    platformPrices: [
      { platformName: "PharmEasy",       price: 76, mrp: 85, isCheapest: true,  url: "#" },
      { platformName: "Netmeds",         price: 80, mrp: 85, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",        price: 78, mrp: 85, isCheapest: false, url: "#" },
    ]
  }
);

// Heart / Cardiac Care
MEDICINES_DB.push(
  {
    id: 107, name: "Atorva 10", genericName: "Atorvastatin", salt: "Atorvastatin 10mg",
    saltAnalysis: 'HMG-CoA reductase inhibitor (statin). Competitively inhibits the rate-limiting enzyme in cholesterol biosynthesis in the liver. Reduces LDL by 30-50%, increases HDL slightly.',
    price: 65, category: "Cardiac Care", requiresPrescription: true,
    manufacturer: "Zydus", uses: "High cholesterol, Heart disease prevention",
    sideEffects: "Muscle pain, Liver enzyme elevation",
    platformPrices: [
      { platformName: "Tata 1mg",        price: 55, mrp: 65, isCheapest: true,  url: "#" },
      { platformName: "PharmEasy",       price: 60, mrp: 65, isCheapest: false, url: "#" },
      { platformName: "Netmeds",         price: 62, mrp: 65, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 108, name: "Ecosprin 75", genericName: "Aspirin (Low dose)", salt: "Aspirin 75mg",
    price: 12, category: "Cardiac Care", requiresPrescription: false,
    manufacturer: "USV", uses: "Blood clot prevention, Heart attack prevention",
    sideEffects: "Stomach bleeding (long term), Gastric irritation",
    platformPrices: [
      { platformName: "PharmEasy",       price: 10, mrp: 12, isCheapest: true,  url: "#" },
      { platformName: "Tata 1mg",        price: 11, mrp: 12, isCheapest: false, url: "#" },
      { platformName: "Apollo Pharmacy", price: 12, mrp: 12, isCheapest: false, url: "#" },
      { platformName: "Blinkit",         price: 13, mrp: 14, isCheapest: false, url: "#" },
    ]
  }
);

// Mental Health
MEDICINES_DB.push(
  {
    id: 109, name: "Etizola 0.5mg", genericName: "Etizolam", salt: "Etizolam 0.5mg",
    saltAnalysis: 'Thienodiazepine (similar to benzodiazepines). Potentiates GABA-A receptor action, producing anxiolytic, sedative, and muscle relaxant effects. Shorter half-life reduces hangover effect.',
    price: 48, category: "Mental Health", requiresPrescription: true,
    manufacturer: "Intas Pharma", uses: "Anxiety, Panic disorders, Short-term insomnia",
    sideEffects: "Drowsiness, Dependence risk",
    platformPrices: [
      { platformName: "Netmeds",         price: 42, mrp: 48, isCheapest: true,  url: "#" },
      { platformName: "PharmEasy",       price: 45, mrp: 48, isCheapest: false, url: "#" },
      { platformName: "Tata 1mg",        price: 46, mrp: 48, isCheapest: false, url: "#" },
    ]
  },
  {
    id: 110, name: "Amitone 10", genericName: "Amitriptyline", salt: "Amitriptyline 10mg",
    saltAnalysis: 'Tricyclic antidepressant (TCA). Blocks reuptake of serotonin and norepinephrine. Also has anticholinergic and antihistaminic effects. Used for depression, neuropathic pain, and migraine prophylaxis.',
    price: 25, category: "Mental Health", requiresPrescription: true,
    manufacturer: "Intas", uses: "Depression, Chronic pain, Migraine prevention",
    sideEffects: "Dry mouth, Drowsiness, Weight gain",
    platformPrices: [
      { platformName: "PharmEasy",       price: 22, mrp: 25, isCheapest: true,  url: "#" },
      { platformName: "Tata 1mg",        price: 23, mrp: 25, isCheapest: false, url: "#" },
      { platformName: "Apollo Pharmacy", price: 25, mrp: 25, isCheapest: false, url: "#" },
    ]
  }
);
