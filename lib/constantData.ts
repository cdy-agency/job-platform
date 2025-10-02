export const JOB_CATEGORIES = [
  { value: "general-labour", label: "Akazi rusange (General Labour)" },
  { value: "domestic-work", label: "Akazi ko mu rugo (Domestic Work)" },
  { value: "cleaning-janitorial", label: "Isuku (Cleaning & Janitorial)" },
  { value: "construction", label: "Ubwubatsi (Construction)" },
  { value: "drivers-riders", label: "Abashoferi n'Abamotari (Drivers & Riders)" },
  { value: "sales-marketing", label: "Abacuruzi/Marketing (Sales & Promotion)" },
  { value: "health-care", label: "Ubuvuzi n'Ububyaza (Health & Care)" },
  { value: "education-assistants", label: "Abarezi n'abafasha mu mashuri (Education & Assistants)" },
  { value: "it-digital", label: "Abashinzwe ikoranabuhanga (IT & Digital Jobs)" },
  { value: "packaging-production", label: "Gutunganya no gupakira (Packaging & Production)" },
  { value: "creative-media", label: "Akazi k'Ubuhanzi n'Imyidagaduro (Creative & Media)" },
  { value: "factory-workshop", label: "Gukora mu nganda (Factory/Workshop Jobs)" },
]

export const RWANDA_LOCATIONS = {
  "Kigali": ["Gasabo", "Kicukiro", "Nyarugenge"],
  "Eastern": ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"],
  "Northern": ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
  "Southern": ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"],
  "Western": ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"]
}

export const BENEFITS_OPTIONS = [
  { 
    id: "holiday-days", 
    label: "Holiday Days", 
    description: "Paid vacation days per month",
    hasValue: true,
    valueLabel: "Days per month",
    valuePlaceholder: "e.g., 2"
  },
  { 
    id: "food-allowance", 
    label: "Food/Launch Allowance", 
    description: "Meals provided during work hours",
    hasValue: false
  },
  { 
    id: "living-allowance", 
    label: "Living Allowance", 
    description: "Housing or accommodation support",
    hasValue: true,
    valueLabel: "Monthly amount (RWF)",
    valuePlaceholder: "e.g., 50000"
  },
  { 
    id: "insurance", 
    label: "Insurance Coverage", 
    description: "Health and/or life insurance",
    hasValue: false
  },
  { 
    id: "transport-allowance", 
    label: "Transport Allowance", 
    description: "Transportation support",
    hasValue: true,
    valueLabel: "Monthly amount (RWF)",
    valuePlaceholder: "e.g., 30000"
  },
  { 
    id: "training-development", 
    label: "Training & Development", 
    description: "Professional development opportunities",
    hasValue: false
  }
]

export const EXPERIENCE_OPTIONS = [
  { value: "-1", label: "-1 year" },
  { value: "0", label: "0 year" },
  { value: "1", label: "1 year" },
  { value: "2", label: "2 years" },
  { value: "3+", label: "3+ years" }
]

// Salary range options 
export const SALARY_RANGE_OPTIONS = [
  { value: "0-50", label: "0 - 50k RWF" },
  { value: "51-100", label: "51 - 100k RWF" },
  { value: "101-150", label: "101 - 150k RWF" },
  { value: "151-250", label: "251 - 350k RWF" },
  { value: "350", label: "350k + RWF" }
]