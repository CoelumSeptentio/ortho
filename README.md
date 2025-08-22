# Ortho

Ortho – ortopedinių prekių katalogo ir valdymo sistema.

## 🚀 Technologijos

- **Docker Compose** – aplikacijų paleidimui (su `healthcheck`, `depends_on`)
- **Nginx reverse proxy** – užklausų nukreipimui ir frontend starto laukimui
- **Nuxt 3 (Vue.js)** – frontend aplikacijai
- **Tailwind CSS** – stiliams
- **Node.js** – frontend paleidimui
- **MeiliSearch** – paieškai
- **CMS (Strapi)** – turinio / prekių administravimui

## 📂 Projekto struktūra

## 📂 Projekto struktūra

.
├── cms/ # Backend (Strapi)
├── frontend/ # Nuxt 3 frontend
├── reverse-proxy/ # Nginx konfigūracija ir script'ai
├── docker-compose.yml # pagrindinis docker compose
├── docker-compose.override.yml # dev aplinkos kintamieji
└── .gitignore

## 🛠️ Diegimas (development aplinkai)

1. Sukurk `.env` failą pagal `.env.example`.
2. Paleisk Docker konteinerius:
   ```bash
   docker-compose up -d
Frontend startuos per reverse-proxy.

📦 Naudojimas
Frontend – http://localhost:3000

CMS – http://localhost:1337 (jei Strapi aktyvus)

MeiliSearch – http://localhost:7700

🤝 Indėliai
Pull request’ai priimami.
Didesni pakeitimai – pradėkite nuo diskusijos „Issues“ skiltyje.

📜 Licencija
Projektas platinamas pagal MIT licenciją.

