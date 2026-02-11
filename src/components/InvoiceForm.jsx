import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, FileText, Download } from "lucide-react";

const InvoiceForm = ({ data, onChange, onAddItem, onRemoveItem, onPreview, onDownload }) => {
    const handleItemChange = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = value;

        // Auto-calculate amount
        if (field === 'quantity' || field === 'unitPrice') {
            const qtyVal = parseFloat(newItems[index].quantity);
            const priceVal = parseFloat(newItems[index].unitPrice);

            if (!isNaN(qtyVal) && !isNaN(priceVal) && newItems[index].unitPrice !== '') {
                newItems[index].amount = (qtyVal * priceVal).toFixed(2);
            } else {
                newItems[index].amount = '';
            }
        }

        onChange('items', newItems);
    };

    return (
        <div className="space-y-6 p-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex justify-between items-center w-full md:w-auto">
                    <h2 className="text-2xl font-bold tracking-tight">Invoice Generator</h2>
                    <img src="/get-logo.png" alt="Great Escapes Tourism" className="h-12 md:hidden object-contain" />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="vat-mode"
                            checked={data.vatEnabled}
                            onCheckedChange={(checked) => onChange('vatEnabled', checked)}
                        />
                        <Label htmlFor="vat-mode">VAT: ON / OFF</Label>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="outline" onClick={onPreview} className="flex-1 sm:flex-none">
                            <FileText className="mr-2 h-4 w-4" /> Preview
                        </Button>
                        <Button onClick={onDownload} className="flex-1 sm:flex-none">
                            <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="quoteNo">Invoice/Quote No</Label>
                                <Input
                                    id="quoteNo"
                                    value={data.quoteNo}
                                    onChange={(e) => onChange('quoteNo', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => onChange('date', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dueDate">Due Date</Label>
                                <Input
                                    id="dueDate"
                                    type="date"
                                    value={data.dueDate}
                                    onChange={(e) => onChange('dueDate', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="salesperson">Salesperson</Label>
                                <Input
                                    id="salesperson"
                                    value={data.salesperson}
                                    onChange={(e) => onChange('salesperson', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="job">Job</Label>
                                <Input
                                    id="job"
                                    value={data.job}
                                    onChange={(e) => onChange('job', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                value={data.subject}
                                onChange={(e) => onChange('subject', e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Client Information</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="company">Company Name</Label>
                            <Input
                                id="company"
                                value={data.company}
                                onChange={(e) => onChange('company', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="trn">TRN No</Label>
                                <Input
                                    id="trn"
                                    value={data.trn}
                                    onChange={(e) => onChange('trn', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="attention">Attention</Label>
                                <Input
                                    id="attention"
                                    value={data.attention}
                                    onChange={(e) => onChange('attention', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="poBox">Address / PO Box</Label>
                            <Input
                                id="poBox"
                                value={data.poBox}
                                onChange={(e) => onChange('poBox', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payableTo">Make Checks Payable To</Label>
                            <select
                                id="payableTo"
                                value={data.payableTo}
                                onChange={(e) => onChange('payableTo', e.target.value)}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="GREAT ESCAPE TOURISM">GREAT ESCAPE TOURISM</option>
                                <option value="MR BIKE DELIVERY">MR BIKE DELIVERY</option>
                                <option value="GREAT ESCAPE TOURISM & MR BIKE DELIVERY">GREAT ESCAPE TOURISM & MR BIKE DELIVERY</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Banking Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input
                                id="bankName"
                                value={data.bankName}
                                onChange={(e) => onChange('bankName', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="branch">Branch</Label>
                            <Input
                                id="branch"
                                value={data.branch}
                                onChange={(e) => onChange('branch', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="accountName">Account Name</Label>
                            <Input
                                id="accountName"
                                value={data.accountName}
                                onChange={(e) => onChange('accountName', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input
                                    id="accountNumber"
                                    value={data.accountNumber}
                                    onChange={(e) => onChange('accountNumber', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="iban">IBAN</Label>
                                <Input
                                    id="iban"
                                    value={data.iban}
                                    onChange={(e) => onChange('iban', e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Line Items</CardTitle>
                    <Button variant="secondary" size="sm" onClick={onAddItem}>
                        <Plus className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {data.items.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 items-start border-b md:border-b-0 pb-4 md:pb-0 last:border-0">
                                <div className="flex-1 space-y-2 w-full">
                                    <Label className="md:hidden">Description</Label>
                                    {index === 0 && <Label className="hidden md:block">Description</Label>}
                                    <div className="flex flex-col gap-2">
                                        <Input
                                            type="date"
                                            value={item.date || ''}
                                            onChange={(e) => handleItemChange(index, 'date', e.target.value)}
                                            className="w-full md:w-40"
                                        />
                                        <Textarea
                                            placeholder="Description"
                                            value={item.description}
                                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                            className="resize-y"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <div className="w-20 md:w-24 space-y-2">
                                        <Label className="md:hidden">Qty</Label>
                                        {index === 0 && <Label className="hidden md:block">Qty</Label>}
                                        <Input
                                            placeholder="Qty"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1 md:w-32 space-y-2">
                                        <Label className="md:hidden">Price</Label>
                                        {index === 0 && <Label className="hidden md:block">Price</Label>}
                                        <Input
                                            type="number"
                                            placeholder="Price"
                                            value={item.unitPrice}
                                            onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1 md:w-32 space-y-2">
                                        <Label className="md:hidden">Amount</Label>
                                        {index === 0 && <Label className="hidden md:block">Amount</Label>}
                                        <Input
                                            value={item.amount}
                                            readOnly
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div className={`pt-8 md:pt-0 ${index === 0 ? "md:pt-8" : ""}`}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                            onClick={() => onRemoveItem(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default InvoiceForm;
