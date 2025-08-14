export const JOB_CATEGORIES = [
  "Akazi rusange (General Labour)",
  "Akazi ko mu rugo (Domestic Work)",
  "Isuku (Cleaning & Janitorial)",
  "Ubwubatsi (Construction)",
  "Abashoferi n’Abamotari (Drivers & Riders)",
  "Abacuruzi/Marketing (Sales & Promotion)",
  "Ubuvuzi n’Ububyaza (Health & Care)",
  "Abarezi n’abafasha mu mashuri (Education & Assistants)",
  "Abashinzwe ikoranabuhanga (IT & Digital Jobs)",
  "Gutunganya no gupakira (Packaging & Production)",
  "Akazi k’Ubuhanzi n’Imyidagaduro (Creative & Media)",
  "Gukora mu nganda (Factory/Workshop Jobs)",
] as const

export type JobCategory = typeof JOB_CATEGORIES[number]