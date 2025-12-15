# Unit Converter (Kilometers ↔ Miles)

A clean, modern unit converter that converts:
- Kilometers → Miles
- Miles → Kilometers

Built like a mini “data pipeline”: **input → validate → transform → output**, with a small **history table** (last 5 conversions) to act like an audit trail.

## Features
- ✅ Convert km ↔ mi
- ✅ Input validation (empty / non-numeric values)
- ✅ Supports decimals and common formatting like commas (e.g., `1,000.5`)
- ✅ Clear on-page results + formula shown
- ✅ History table (stores last 5 conversions using `localStorage`)
- ✅ One-click reset and history clear

## Conversion Factors
- Miles = Kilometers × **0.621371**
- Kilometers = Miles × **1.60934**

Results are rounded to **2 decimal places**.

## Files
- `index.html` – UI structure
- `styles.css` – styling (responsive, modern)
- `script.js` – validation, conversion logic, history logging

## How to Run
1. Download or clone this repo
2. Open `index.html` in your browser  
   - No build tools or server required

## Quick Test Checklist (QA)
- `0 km` → `0 mi`
- `1 km` → `0.62 mi` (approx)
- `10 mi` → `16.09 km` (approx)
- Blank input → shows an error message
- `abc` → shows an error message
- `1,000.5` parses correctly

## Why I Built It This Way (Data Analyst Lens)
Real-world data is messy. I treated user input like raw data:
- normalize (remove spaces/commas),
- validate (must be a real number),
- transform (apply conversion factor),
- present results clearly,
- log recent results for traceability.

## License
MIT
