-- Avatar System: เพิ่มระบบเหรียญ + inventory + equipped ในตาราง profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS coins integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inventory jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS equipped jsonb NOT NULL DEFAULT '{
    "skin": "skin_default",
    "hair": "hair_default",
    "hairColor": "haircolor_black",
    "hat": null,
    "shirt": "shirt_default",
    "pants": "pants_default",
    "shoes": "shoes_default",
    "accessory": null
  }'::jsonb;
