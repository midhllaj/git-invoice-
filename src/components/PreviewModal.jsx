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
        // Create a clone of the element to render it in a predictable environment
        const element = previewRef.current;
        const clone = element.cloneNode(true);

        // Create a container that forces desktop width, placed off-screen
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '-10000px';
        container.style.left = '-10000px';
        container.style.width = '794px'; // Force A4 width explicitly
        container.style.height = 'auto';
        container.style.zIndex = '-1000';
        container.style.background = 'white'; // Ensure background is present

        container.appendChild(clone);
        document.body.appendChild(container);

        try {
            // Create canvas from the cloned element
            const canvas = await html2canvas(clone, {
                scale: 3, // Slightly reduced scale to prevent memory crashes on mobile while maintaining 300dpi+ quality roughly
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: '#ffffff',
                imageTimeout: 0,
                windowWidth: 794,
                width: 794, // Explicitly tell html2canvas the capture width
            });

            const imgData = canvas.toDataURL('image/png', 1.0);

            // A4 dimensions in mm
            const pdfWidth = 210;
            const pdfHeight = 297;

            const pdf = new jsPDF('p', 'mm', 'a4', true);

            // Calculate height to maintain aspect ratio, although A4 is fixed
            const imgProps = pdf.getImageProperties(imgData);
            const pdfImageHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfImageHeight, undefined, 'FAST');

            const fileName = documentType === 'invoice' ? 'Invoice' : 'Quotation';
            pdf.save(`${fileName}_${data.quoteNo || 'Draft'}.pdf`);
        } catch (error) {
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            // Cleanup the temporary container
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
