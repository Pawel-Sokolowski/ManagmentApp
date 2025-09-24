const express = require('express');
const router = express.Router();

// In-memory storage for demo purposes (should use database in production)
let documents = [
  {
    id: '1',
    name: 'Faktura FV/2024/001.pdf',
    type: 'invoice',
    category: 'faktury',
    size: 245760,
    clientId: '1',
    uploadedBy: '1',
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['faktura', 'vat', '2024'],
    isArchived: false
  },
  {
    id: '2',
    name: 'Umowa o współpracy.pdf',
    type: 'contract',
    category: 'umowy',
    size: 512000,
    clientId: '2',
    uploadedBy: '1',
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['umowa', 'współpraca'],
    isArchived: false
  },
  {
    id: '3',
    name: 'Deklaracja VAT-7 listopad 2024.pdf',
    type: 'tax_document',
    category: 'podatki',
    size: 128000,
    clientId: '1',
    uploadedBy: '2',
    uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['vat-7', 'listopad', '2024'],
    isArchived: false
  }
];

let categories = [
  { id: 'faktury', name: 'Faktury', color: '#3b82f6' },
  { id: 'umowy', name: 'Umowy', color: '#10b981' },
  { id: 'podatki', name: 'Podatki', color: '#f59e0b' },
  { id: 'korespondencja', name: 'Korespondencja', color: '#8b5cf6' },
  { id: 'inne', name: 'Inne', color: '#6b7280' }
];

// Get all documents
router.get('/', (req, res) => {
  const { category, clientId, archived = 'false' } = req.query;
  
  let filteredDocuments = documents;
  
  if (category) {
    filteredDocuments = filteredDocuments.filter(doc => doc.category === category);
  }
  
  if (clientId) {
    filteredDocuments = filteredDocuments.filter(doc => doc.clientId === clientId);
  }
  
  if (archived === 'true') {
    filteredDocuments = filteredDocuments.filter(doc => doc.isArchived);
  } else if (archived === 'false') {
    filteredDocuments = filteredDocuments.filter(doc => !doc.isArchived);
  }
  
  res.json(filteredDocuments);
});

// Get document by ID
router.get('/:id', (req, res) => {
  const document = documents.find(doc => doc.id === req.params.id);
  if (!document) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json(document);
});

// Upload document (mock)
router.post('/', (req, res) => {
  const { name, type, category, clientId, uploadedBy, tags = [] } = req.body;
  
  if (!name || !type || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const newDocument = {
    id: (documents.length + 1).toString(),
    name,
    type,
    category,
    size: Math.floor(Math.random() * 1000000) + 50000, // Random size for demo
    clientId: clientId || null,
    uploadedBy: uploadedBy || '1',
    uploadedAt: new Date().toISOString(),
    tags,
    isArchived: false
  };

  documents.push(newDocument);
  res.status(201).json(newDocument);
});

// Update document
router.put('/:id', (req, res) => {
  const documentIndex = documents.findIndex(doc => doc.id === req.params.id);
  if (documentIndex === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }

  const updates = req.body;
  documents[documentIndex] = { ...documents[documentIndex], ...updates, id: req.params.id };
  
  res.json(documents[documentIndex]);
});

// Archive document
router.put('/:id/archive', (req, res) => {
  const documentIndex = documents.findIndex(doc => doc.id === req.params.id);
  if (documentIndex === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }

  documents[documentIndex].isArchived = true;
  res.json({ message: 'Document archived successfully' });
});

// Delete document
router.delete('/:id', (req, res) => {
  const documentIndex = documents.findIndex(doc => doc.id === req.params.id);
  if (documentIndex === -1) {
    return res.status(404).json({ error: 'Document not found' });
  }

  documents.splice(documentIndex, 1);
  res.json({ message: 'Document deleted successfully' });
});

// Get document categories
router.get('/categories', (req, res) => {
  res.json(categories);
});

// Search documents
router.get('/search/:query', (req, res) => {
  const { query } = req.params;
  const searchResults = documents.filter(doc => 
    doc.name.toLowerCase().includes(query.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
    doc.category.toLowerCase().includes(query.toLowerCase())
  );
  res.json(searchResults);
});

module.exports = router;