# Scripts Directory

This directory contains utility scripts for development and testing.

## Available Scripts

### test-upl1-coordinates.js

Tests the UPL-1 PDF form filling coordinates by generating a test PDF with sample data.

**Usage:**
```bash
node scripts/test-upl1-coordinates.js
```

**Output:**
- Generates `build/upl-1-test-filled.pdf` with test data in blue
- Displays coordinate positions in console
- Useful for verifying and adjusting field positions

**Purpose:**
- Verify coordinate accuracy before deployment
- Test changes to field positions
- Visual comparison with official blank form

### setup-database.js

Sets up the database schema and initial configuration.

**Usage:**
```bash
npm run setup-db
```

## UPL-1 Form Testing Workflow

1. **Make coordinate adjustments** in `src/utils/upl1PdfFiller.ts`
2. **Run test script**: `node scripts/test-upl1-coordinates.js`
3. **Review output** in `build/upl-1-test-filled.pdf`
4. **Compare** with blank UPL-1 form
5. **Iterate** until coordinates are accurate

## Adding New Scripts

When adding new scripts:

1. Add documentation here
2. Include usage instructions
3. Add error handling
4. Use clear console output
5. Save outputs to `build/` or `/tmp/` directories
