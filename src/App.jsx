import React, { useState } from 'react';
import InvoiceForm from './components/InvoiceForm';
import PreviewModal from './components/PreviewModal';
import DocumentTypeSelector from './components/DocumentTypeSelector';
import './App.css';

function App() {
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [documentType, setDocumentType] = useState('quotation');
  const [invoiceData, setInvoiceData] = useState({
    quoteNo: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    salesperson: '',
    job: '',
    company: '',
    trn: '',
    poBox: '',
    attention: '',
    subject: '',
    payableTo: 'GREAT ESCAPE TOURISM & MR BIKE DELIVERY',
    bankName: '',
    accountName: '',
    accountNumber: '',
    iban: '',
    branch: '',
    vatEnabled: true,
    items: []
  });

  const handleChange = (field, value) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { date: new Date().toISOString().split('T')[0], description: '', quantity: 1, unitPrice: '', amount: '' }
      ]
    }));
  };

  const handleRemoveItem = (index) => {
    setInvoiceData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleDocumentTypeSelect = (type) => {
    setDocumentType(type);
    setShowTypeSelector(false);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl">
        <InvoiceForm
          data={invoiceData}
          onChange={handleChange}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onPreview={() => setShowTypeSelector(true)}
          onDownload={() => setShowTypeSelector(true)}
        />

        {showTypeSelector && (
          <DocumentTypeSelector
            onSelect={handleDocumentTypeSelect}
            onClose={() => setShowTypeSelector(false)}
          />
        )}

        {showPreview && (
          <PreviewModal
            data={invoiceData}
            documentType={documentType}
            onClose={() => setShowPreview(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
