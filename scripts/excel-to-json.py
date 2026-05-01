#!/usr/bin/env python3
"""
Regenerer src/data/andeler.json fra Excel-budsjettarket.

Kjør:
    python3 scripts/excel-to-json.py [path/til/excel.xlsx]

Hvis ingen sti gis, brukes default-stien til Dropbox-arket.
"""
import json
import sys
from pathlib import Path

import openpyxl

DEFAULT_XLSX = (
    "/Users/oyvindborstad/Library/CloudStorage/Dropbox/Orebakken BRL/"
    "Forslag til budsjett Rehab Orebakken 2026 pakke 1 og 2 26.04.26.xlsx"
)
OUT_JSON = Path(__file__).resolve().parent.parent / "src" / "data" / "andeler.json"


def main() -> None:
    xlsx = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(DEFAULT_XLSX)
    if not xlsx.exists():
        sys.exit(f"Fant ikke Excel-fil: {xlsx}")

    wb = openpyxl.load_workbook(xlsx, data_only=True)
    ws = wb["Per andel"]
    rows = list(ws.iter_rows(values_only=True))

    andeler = []
    for row in rows[2:]:  # hopp over to header-rader
        if not isinstance(row[0], (int, float)):
            continue
        andeler.append(
            {
                "andelsnr": int(row[0]),
                "leilNr": int(row[1]),
                "adresse": row[2],
                "areal": float(row[3]),
                "brok": float(row[4]),
                "dagensFu": float(row[5]),
                "p1": {
                    "nyFu": float(row[6]),
                    "okning": float(row[7]),
                    "stromBesp": float(row[8]),
                    "skfrAr1": float(row[9]),
                    "nettoAr1": float(row[10]),
                    "nettoSnitt": float(row[11]),
                },
                "p2": {
                    "nyFu": float(row[12]),
                    "okning": float(row[13]),
                    "stromBesp": float(row[14]),
                    "skfrAr1": float(row[15]),
                    "nettoAr1": float(row[16]),
                    "nettoSnitt": float(row[17]),
                },
            }
        )

    OUT_JSON.write_text(
        json.dumps(andeler, ensure_ascii=False, indent=0), encoding="utf-8"
    )
    print(f"Skrev {len(andeler)} andeler til {OUT_JSON}")


if __name__ == "__main__":
    main()
