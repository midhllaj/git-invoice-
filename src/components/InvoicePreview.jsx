import React, { forwardRef } from 'react';
import { toWords } from 'number-to-words';

const InvoicePreview = forwardRef(({ data, documentType = 'quotation' }, ref) => {
    // Calculate totals
    const total = data.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    // Convert number to words - keeping this helper function
    const numberToWords = (num) => {
        const roundedNum = Math.round(num);
        const words = toWords(roundedNum);
        return words.toUpperCase();
    };

    // Format date to DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Format currency to 2 decimal places
    // Format currency to 2 decimal places
    const formatCurrency = (amount) => {
        return parseFloat(amount || 0).toFixed(2);
    }

    const documentTitle = documentType === 'invoice' ? 'Invoice' : 'Quotation';
    const numberLabel = documentType === 'invoice' ? 'INVO' : 'QUOTE';

    return (
        <div className="invoice-preview-container" ref={ref} id="invoice-preview">

            {/* Header Section */}
            <div className="header-section">
                <div style={{ width: '200px' }}>
                    <img src="/get-logo.png" alt="Logo" style={{ width: '100%', maxWidth: '180px' }} />
                </div>
                <div className="invoice-title">
                    {documentTitle}
                </div>
            </div>

            <div className="header-blue-line"></div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="company-info">
                    <div className="company-name">Great Escapes Tourism</div>
                    <div className="company-slogan">Dreams Come True</div>
                    <div className="company-contact">Tel : 00971 4 341 5949</div>
                </div>
                <div className="invoice-meta">
                    <div>{formatDate(data.date).toUpperCase()}</div> {/* Using date from data, formatted to have month name if possible but sticking to DD/MM/YYYY for now or Custom format */}
                    <div style={{ marginTop: '10px' }}>{numberLabel}: {data.quoteNo}</div>
                </div>
            </div>

            {/* Client Section */}
            <div className="client-section">
                <div className="client-label">TO</div>
                <div className="client-name">{data.company || "CLIENT EXTENSION"}</div>
                <div style={{ fontWeight: 'bold' }}>{data.attention}</div> {/* Assuming phone/contact is in attention field for now */}
            </div>

            {/* Job Details Grid */}
            <div className="job-details-grid">
                <div>
                    <div className="job-box-header">Salesperson</div>
                    <div className="job-box-content">{data.salesperson || "RAOUF"}</div>
                </div>
                <div>
                    <div className="job-box-header">Job</div>
                    <div className="job-box-content">{data.job || "ACCOUNTANT"}</div>
                </div>
                <div>
                    <div className="job-box-header" style={{ backgroundColor: '#95b3d7', color: '#333' }}>Due Date</div>
                    <div className="job-box-content" style={{ backgroundColor: '#dbe5f1', color: '#333' }}>{data.dueDate ? formatDate(data.dueDate) : ""}</div>
                </div>
            </div>

            {/* Main Items Table */}
            <table className="items-table">
                <thead>
                    <tr>
                        <th className="col-date">DATE</th>
                        <th className="col-desc">Description</th>
                        <th className="col-total">Line Total</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? "even-row" : "odd-row"} style={{ height: '30px' }}>
                            <td className="col-date">{item.date ? formatDate(item.date) : ""}</td>
                            <td className="col-desc" style={{ whiteSpace: 'pre-wrap' }}>{item.description}</td>
                            <td className="col-total">{item.amount}</td>
                        </tr>
                    ))}
                    {/* Empty Rows Padding */}
                    {Array.from({ length: Math.max(0, 12 - data.items.length) }).map((_, i) => (
                        <tr key={`empty-${i}`} className={(data.items.length + i) % 2 === 0 ? "even-row" : "odd-row"} style={{ height: '30px' }}>
                            <td className="col-date"></td>
                            <td className="col-desc"></td>
                            <td className="col-total"></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Banking and Totals Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="banking-container" style={{ width: '60%' }}>
                    <div className="banking-title">ACCOUNT DEATAILS ARE AS FOLLOWS;</div>
                    <div style={{ height: '10px' }}></div>
                    <div className="banking-line">{data.bankName || "MR BIKES DELIVERY SERVICES"}</div>
                    <div className="banking-line">ACCOUNT NUMBER. {data.accountNumber || "11955 2528 20001"}</div>
                    <div className="banking-line">IBAN : {data.iban || "AE 1400 300 11955 2528 20001"}</div>
                    <div className="banking-line">{data.branch || "ADCB BANK, AL BUSTAN BRANCH,"}</div>
                    <div className="banking-line">DUBAI, UAE</div>
                </div>

                <div style={{ width: '35%' }}>
                    <div className="total-row">
                        <span className="total-label" style={{ color: '#4472c4' }}>Total</span>
                        <span>AED {formatCurrency(total)}</span>
                    </div>
                </div>
            </div>

            {/* Sign and Stamp */}
            <div className="stamp-section">
                <div style={{ fontWeight: 'bold' }}>Sign & Stamp</div>
                <div class="stamp-placeholder">
                    {/* Stamp Image Placeholder */}
                    <img src="/get-stamp.png" alt="" style={{ width: '100%', opacity: 0.8 }} />
                </div>
            </div>

            {/* Payable To Text */}
            <div className="payable-text">
                <div style={{ fontWeight: 'normal' }}>MAKE ALL CHECK PAYABLE TO</div>
                <div style={{ color: '#4472c4' }}>{data.payableTo}</div>
                <div style={{ fontSize: '14pt', marginTop: '5px' }}>Thank you for your business!</div>
            </div>

            {/* Footer Bar */}
            <div className="footer-bar">
                Al Sharafi Building - S 14 , P.O. Box 111113 , Dubai-UAE, info@getdubai.com, www.getourism.com
            </div>

        </div>
    );
});
export default InvoicePreview;
