import React, { useRef } from 'react';
import InvoicePreview from './InvoicePreview';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";

const PreviewModal = ({ data, documentType, onClose }) => {
    const previewRef = useRef();
    const [scale, setScale] = React.useState(0.9);

    React.useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            const padding = 32; // 1rem padding on each side
            const targetWidth = 794; // A4 width in px (approx)
            const availableWidth = windowWidth - padding;

            if (availableWidth < targetWidth) {
                setScale(availableWidth / targetWidth);
            } else {
                setScale(0.9);
            }
        };

        handleResize(); // Initial calculation
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDownload = async () => {
        const element = previewRef.current;
        if (!element) return;

        // Create a temporary container for the capture to ensure consistent rendering
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-10000px';
        container.style.left = '-10000px';
        // Use the exact width from CSS (210mm)
        container.style.width = '210mm';
        container.style.minHeight = '297mm'; // A4 min-height
        container.style.backgroundColor = '#ffffff';
        container.style.zIndex = '-9999';

        // Clone the preview element
        const clone = element.cloneNode(true);
        // Reset margins on the clone to ensure it fits the container exactly
        clone.style.margin = '0';
        clone.style.boxShadow = 'none'; // Remove shadow for print

        container.appendChild(clone);
        document.body.appendChild(container);

        try {
            // Wait a moment for DOM to settle (though usually synchronous for simple appends)
            await new Promise(resolve => setTimeout(resolve, 100));

            // Calculate the full scroll height of the content
            const fullHeight = container.scrollHeight;
            const fullWidth = container.scrollWidth;

            const canvas = await html2canvas(container, {
                scale: 2, // Retain 2x scale for quality
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: '#ffffff',
                // Crucial: Set distinct width/height to the full content size
                width: fullWidth,
                height: fullHeight,
                windowWidth: fullWidth,
                windowHeight: fullHeight,
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0
            });

            const imgData = canvas.toDataURL('image/png', 1.0);

            // A4 dimensions in mm
            const pdfWidth = 210;
            const pdfHeight = 297;

            // Create PDF
            const pdf = new jsPDF('p', 'mm', 'a4');

            // Calculate image height in PDF units (maintaining aspect ratio)
            const imgProps = pdf.getImageProperties(imgData);
            const pdfImageHeight = (imgProps.height * pdfWidth) / imgProps.width;

            // Render PDF pages
            const pageHeight = pdfHeight;
            let heightLeft = pdfImageHeight;
            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImageHeight);
            heightLeft -= pageHeight;

            // Add subsequent pages if content overflows
            while (heightLeft > 0) {
                position -= pageHeight; // Shift image up to show next section
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImageHeight);
                heightLeft -= pageHeight;
            }

            const fileName = documentType === 'invoice' ? 'Invoice' : 'Quotation';
            pdf.save(`${fileName}_${data.quoteNo || 'Draft'}.pdf`);

        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            document.body.removeChild(container);
        }
    };

    const title = documentType === 'invoice' ? 'Invoice Preview' : 'Quotation Preview';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 md:p-4" onClick={onClose}>
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-lg shadow-lg flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1 overflow-auto p-4 md:p-6 bg-gray-100 flex justify-center">
                    <div
                        style={{
                            transform: `scale(${scale})`,
                            transformOrigin: 'top center',
                            height: scale < 1 ? `${297 * 3.78 * scale}px` : 'auto' // Adjust height to avoid extra scroll space if scaled
                        }}
                    >
                        <InvoicePreview data={data} documentType={documentType} ref={previewRef} />
                    </div>
                </div>

                <div className="p-4 border-t flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PreviewModal;
