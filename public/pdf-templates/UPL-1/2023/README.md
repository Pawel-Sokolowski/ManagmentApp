# UPL-1 2023 Template

✅ **This template is available** - copied from PDFFile folder.

## Source
- Original file: `PDFFile/upl-1_06-08-2.pdf`
- Also available in: `public/upl-1_06-08-2.pdf`
- Form: Power of Attorney to Tax Office (Pełnomocnictwo do Urzędu Skarbowego)

## Usage
This form is ready to use with the TaxFormService.

```typescript
const service = new TaxFormService();
await service.fillFormAsBlob('UPL-1', '2023', formData);
```

## Note
This is the same file that was previously used in the UPL1PdfFiller implementation.
