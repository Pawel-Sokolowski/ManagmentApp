# PDF Templates and Field Mappings

This directory contains PDF templates and their corresponding field mappings for various Polish tax and administrative forms.

## Directory Structure

```
src/assets/pdf-templates/
├── PIT-37/
│   ├── 2023/
│   │   └── PIT-37_2023.pdf    (place official PDF here)
│   ├── 2022/
│   │   └── PIT-37_2022.pdf    (place official PDF here)
│   └── mapping.json           (field mappings and calculations)
├── UPL-1/
│   ├── 2023/
│   │   └── UPL-1_2023.pdf     (place official PDF here)
│   └── mapping.json           (field mappings)
└── [other-form-types]/
```

## Mapping File Format

Each form type has a `mapping.json` file that defines:
- Field names and their coordinates on the PDF
- Calculation rules for computed fields
- Version information

### Example mapping.json

```json
{
  "version": "2023",
  "fields": {
    "taxpayerName": { "pdfField": "field1", "page": 1, "x": 150, "y": 720 },
    "taxpayerId": { "pdfField": "field2", "page": 1, "x": 150, "y": 695 },
    "childDeduction": { "pdfField": "field42", "page": 2, "x": 400, "y": 500 }
  },
  "calculations": {
    "totalTaxDeduction": "childDeduction * numberOfChildren",
    "taxBase": "totalIncome - totalTaxDeduction",
    "taxDue": "taxBase * 0.17"
  }
}
```

### Field Object Properties

- `pdfField`: Name of the field in the PDF (for reference)
- `page`: Page number (1-based index) where the field appears
- `x`: X coordinate (from left) for text placement
- `y`: Y coordinate (from bottom) for text placement

### Calculations

The `calculations` object defines computed fields using simple expressions.
These are processed by the TaxFormService before filling the PDF.

## Coordinate System

PDF coordinates are measured from the bottom-left corner (0,0):
- X axis: left to right (0 to 595 for A4)
- Y axis: bottom to top (0 to 842 for A4)
- Standard A4 size: 595 × 842 points

## Using the TaxFormService

```typescript
import { TaxFormService } from '../utils/taxFormService';

const taxFormService = new TaxFormService();

// Fill a form
const formData = {
  taxpayerName: 'Jan Kowalski',
  taxpayerId: '12345678901',
  employmentIncome: 50000,
  civilContractIncome: 10000,
  numberOfChildren: 2,
  childDeduction: 1112.04,
  taxPaid: 5000
};

const pdfBlob = await taxFormService.fillFormAsBlob('PIT-37', '2023', formData);

// Download or display the filled PDF
const url = URL.createObjectURL(pdfBlob);
window.open(url);
```

## Form-Specific Calculations

### PIT-37 (Personal Income Tax)

The service automatically calculates:
- `totalIncome` = employmentIncome + civilContractIncome
- `totalTaxDeduction` = childDeduction × numberOfChildren
- `taxBase` = totalIncome - totalTaxDeduction
- `taxDue` = taxBase × 0.17 (simplified 17% rate)
- `taxToPay` = taxDue - taxPaid

### UPL-1 (Power of Attorney)

No calculations required - direct field mapping only.

## Adding New Form Templates

To add a new form template:

1. **Create directory structure**:
   ```bash
   mkdir -p src/assets/pdf-templates/FORM-NAME/2023
   ```

2. **Add PDF template**:
   Place the official PDF in the year directory:
   ```
   src/assets/pdf-templates/FORM-NAME/2023/FORM-NAME_2023.pdf
   ```

3. **Create mapping.json**:
   Define field mappings and calculations:
   ```json
   {
     "version": "2023",
     "fields": {
       "fieldName": { "pdfField": "pdfFieldName", "page": 1, "x": 100, "y": 700 }
     },
     "calculations": {
       "computedField": "field1 + field2"
     }
   }
   ```

4. **Determine coordinates**:
   - Open the PDF in a viewer that shows coordinates
   - Or use trial and error with test fills
   - Remember: Y coordinates are from the bottom

5. **Update AuthorizationFormGenerator**:
   Add template-based generation for the new form:
   ```typescript
   if (data.formType === 'NEW-FORM') {
     try {
       return await this.generateNewFormFromTemplate(data);
     } catch (error) {
       // Fallback to jsPDF generation
     }
   }
   ```

6. **Add form-specific calculations** (if needed):
   Update `TaxFormService.processFormSpecificCalculations()`:
   ```typescript
   if (formType === 'NEW-FORM') {
     processedData.calculatedFields = this.processNewFormCalculations(data, mappings);
   }
   ```

## Troubleshooting

### Template Not Loading
- Check that the PDF file exists in the correct directory
- Verify the file name matches the expected pattern: `FORM-TYPE_YEAR.pdf`
- Check browser console for specific error messages

### Text Not Appearing or Misaligned
- Verify coordinates in mapping.json
- Remember Y coordinates are from bottom, not top
- Check page number (1-based index)
- Try adjusting x/y values in small increments

### Calculations Not Working
- Ensure field names in calculations match exactly with field definitions
- Check that input data contains all required fields
- Review TaxFormService implementation for the specific form type

## Benefits of Template-Based Approach

1. **Official Forms**: Uses actual government-issued PDF forms
2. **Accurate Layout**: No need to recreate forms from scratch
3. **Version Support**: Easy to support multiple years/versions
4. **Maintainability**: Separate templates from code
5. **Flexibility**: Field mappings can be updated without code changes

## Future Enhancements

- Dynamic coordinate detection using OCR
- Visual coordinate editor for adjusting field positions
- Support for checkboxes and radio buttons
- Multi-language support
- Form validation based on mappings
