# Digital Editions Test: REED-style GitHub Pages Starter

This repository now contains a **GitHub Pages-ready starter** for a TEI/EATS-based digital edition inspired by REED Online (<https://ereed.org/>).

## What this starter does

- Stores records in **TEI XML** (`docs/data/records.xml`)
- Stores person/place authority data in an **EATS-like XML file** (`docs/data/eats.xml`)
- Transforms TEI into HTML in the browser using **XSLT** (`docs/xslt/tei-to-html.xsl`)
- Adds lightweight faceted browsing (date/place/person) with JavaScript (`docs/assets/app.js`)
- Publishes as a static site through **GitHub Pages** from the `docs/` folder

## Why this is a starter (not a full REED clone)

REED Online includes a mature backend + indexing + editorial workflow. GitHub Pages is static hosting, so exact parity requires significant additional engineering (precomputed indexes, richer authority reconciliation, and advanced search tooling).

This project gives you a practical baseline that follows the same core principles:

- TEI as source-of-truth
- Authority control with EATS-like entities
- XML → web rendering via XSLT (Kiln-style pipeline concept)

## Quick start

1. Commit and push this repository to GitHub.
2. In **Settings → Pages**, set source to deploy from branch/folder and choose **`/docs`**.
3. Open the published site URL.

## Suggested next steps

- Split records into one TEI file per document and generate a build-time index.
- Add schema validation (TEI Relax NG + EATS constraints) in CI.
- Add static pre-rendering (Saxon/Node or XSLT 3.0 build script) for large corpora.
- Introduce richer authority resolution (`sameAs`, variants, uncertain IDs).
- Add IIIF manifests for manuscript/page images.
