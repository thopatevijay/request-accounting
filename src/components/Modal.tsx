import { copyToClipboard, getDecimals, getSymbol, truncateString } from '@/utils';
import { Types } from '@requestnetwork/request-client.js';
import React from 'react';
import { FaWindowClose } from 'react-icons/fa';
import { FaCheckCircle, FaTimesCircle, FaHourglassStart, FaHourglassHalf, FaCopy } from 'react-icons/fa';
import { formatUnits } from "viem";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRequest: Types.IRequestDataWithEvents | undefined;
}

interface StatusResult {
  status: string;
  icon: JSX.Element | null;
}

const Modal = ({ isOpen, onClose, selectedRequest }: ModalProps): JSX.Element => {

  const downloadPDF = () => {
    const doc = new jsPDF();
    const estimatedTextHeight = 250;
    doc.text(`Invoice #${selectedRequest?.requestId.slice(0, 8)}`, 10, 10);
    doc.text(`Issued on: ${new Date(selectedRequest?.timestamp! * 1000).toLocaleDateString()}`, 10, 20);
    doc.text(`Due by: ${new Date(selectedRequest?.timestamp! * 1000 + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 10, 30);
    doc.text(`From:`, 10, 40);
    doc.text(`Address: ${selectedRequest?.payee?.value}`, 20, 50);
    doc.text(`Email: ${selectedRequest?.contentData?.sellerInfo?.email}`, 20, 60);
    doc.text(`Name: ${selectedRequest?.contentData?.sellerInfo?.firstName}`, 20, 70);
    doc.text(`Company: ${selectedRequest?.contentData?.sellerInfo?.businessName}`, 20, 80);
    doc.text(`City: ${selectedRequest?.contentData?.sellerInfo?.address?.locality}`, 20, 90);
    doc.text(`Region: ${selectedRequest?.contentData?.sellerInfo?.address?.region}`, 20, 100);
    doc.text(`Billed to:`, 10, 110);
    doc.text(`Address: ${selectedRequest?.payer?.value}`, 20, 120);
    doc.text(`Email: ${selectedRequest?.contentData?.buyerInfo?.email}`, 20, 130);
    doc.text(`Name: ${selectedRequest?.contentData?.buyerInfo?.firstName}`, 20, 140);
    doc.text(`Company: ${selectedRequest?.contentData?.buyerInfo?.businessName}`, 20, 150);
    doc.text(`City: ${selectedRequest?.contentData?.buyerInfo?.address?.locality}`, 20, 160);
    doc.text(`Region: ${selectedRequest?.contentData?.buyerInfo?.address?.region}`, 20, 170);
    doc.text(`Payment Details:`, 10, 180);
    doc.text(`Payment Chain: ${selectedRequest?.currencyInfo?.network}`, 20, 190);
    doc.text(`Invoice Currency: ${getSymbol(selectedRequest?.currencyInfo.network!, selectedRequest?.currencyInfo.value!)}`, 20, 200);
    doc.text(`Item Details:`, 10, 210);

    const startY = estimatedTextHeight + 10;

    autoTable(doc, {
      startY: startY,
      head: [['DESCRIPTION', 'QTY', 'UNIT PRICE', 'DISCOUNT', 'TAX', 'AMOUNT']],
      body: selectedRequest?.contentData?.invoiceItems.map((item: any) => {
        const unitPrice = Number(formatUnits(
          BigInt(item?.unitPrice as string),
          getDecimals(
            selectedRequest.currencyInfo.network!,
            selectedRequest.currencyInfo.value,
          ) ?? 18,
        ));
        const totalAmount = item.quantity * unitPrice;
        return [
          item.name,
          item.quantity,
          unitPrice,
          item.discount,
          item.tax.amount,
          totalAmount
        ];
      }),
    });

    doc.text(`Memo: ${selectedRequest?.contentData?.note}`, 10, 220 + estimatedTextHeight);

    doc.save('invoice.pdf');
  };


  const getStatus = (state: string, expectedAmount: BigInt, balance: BigInt): StatusResult => {
    if (balance >= expectedAmount) {
      return { status: "Paid", icon: <FaCheckCircle className="text-green-500" /> };
    }
    switch (state) {
      case Types.RequestLogic.STATE.ACCEPTED:
        return { status: "Accepted", icon: <FaCheckCircle className="text-blue-500" /> };
      case Types.RequestLogic.STATE.CANCELED:
        return { status: "Canceled", icon: <FaTimesCircle className="text-red-500" /> };
      case Types.RequestLogic.STATE.CREATED:
        return { status: "Created", icon: <FaHourglassStart className="text-yellow-500" /> };
      case Types.RequestLogic.STATE.PENDING:
        return { status: "Pending", icon: <FaHourglassHalf className="text-yellow-500" /> };
      default:
        return { status: "Unknown", icon: null };
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white rounded-lg shadow-lg p-4 w-full max-w-2xl max-h-screen overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={onClose}
            ><FaWindowClose /></button>
            {selectedRequest && (
              <div className="p-4 space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Invoice #{selectedRequest.requestId.slice(0, 8)}</h2>
                  <span className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full">
                    {getStatus(selectedRequest.state, BigInt(selectedRequest.expectedAmount), BigInt(selectedRequest.balance?.balance ?? 0)).status}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p><strong>Issued on:</strong> {new Date(selectedRequest.timestamp * 1000).toLocaleDateString()}</p>
                    <p><strong>Due by:</strong> {new Date(selectedRequest.timestamp * 1000 + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="border-t border-gray-200 py-4">
                  <div className="flex justify-between">
                    <div className="w-1/2 pr-4">
                      <h3 className="text-lg font-bold mb-2">From:</h3>
                      <p className="mb-1 flex items-center"><strong>Address:</strong> {truncateString(selectedRequest?.payee?.value ?? '', 20)}
                        <FaCopy className="ml-2 cursor-pointer" onClick={() => copyToClipboard(selectedRequest?.payee?.value ?? '')} />
                      </p>
                      <p className="mb-1"><strong>Email:</strong>{selectedRequest?.contentData?.sellerInfo?.email}</p>
                      <p className="mb-1"><strong>Name:</strong>{selectedRequest?.contentData?.sellerInfo?.firstName}</p>
                      <p className="mb-1"><strong>Company:</strong>{selectedRequest?.contentData?.sellerInfo?.businessName}</p>
                      <p className="mb-1"><strong>City:</strong>{selectedRequest?.contentData?.sellerInfo?.address?.locality}</p>
                      <p className="mb-1"><strong>Region:</strong>{selectedRequest?.contentData?.sellerInfo?.address?.region}</p>
                    </div>
                    <div className="w-1/2 pl-4">
                      <h3 className="text-lg font-bold mb-2">Billed to:</h3>
                      <p className="mb-1 flex items-center"><strong>Address:</strong> {truncateString(selectedRequest?.payer?.value ?? '', 20)}
                        <FaCopy className="ml-2 cursor-pointer" onClick={() => copyToClipboard(selectedRequest?.payer?.value ?? '')} />
                      </p>

                      <p className="mb-1"><strong>Email:</strong>{selectedRequest?.contentData?.buyerInfo?.email}</p>
                      <p className="mb-1"><strong>Name:</strong>{selectedRequest?.contentData?.buyerInfo?.firstName}</p>
                      <p className="mb-1"><strong>Company:</strong>{selectedRequest?.contentData?.buyerInfo?.businessName}</p>
                      <p className="mb-1"><strong>City:</strong>{selectedRequest?.contentData?.buyerInfo?.address?.locality}</p>
                      <p className="mb-1"><strong>Region:</strong>{selectedRequest?.contentData?.buyerInfo?.address?.region}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 py-4">
                  <h3 className="text-lg font-bold mb-2">Payment Details:</h3>
                  <p className="mb-1"><strong>Payment Chain:</strong>{" "}{selectedRequest?.currencyInfo?.network}</p>
                  <p className="mb-1"><strong>Invoice Currency:</strong>{" "}
                    {getSymbol(
                      selectedRequest.currencyInfo.network!,
                      selectedRequest.currencyInfo.value,
                    )}
                  </p>
                </div>
                <div className="border-t border-gray-200 py-4">
                  <h3 className="text-lg font-bold mb-2">Item Details:</h3>
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">DESCRIPTION</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">QTY</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">UNIT PRICE</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">DISCOUNT</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">TAX</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRequest?.contentData?.invoiceItems.map((item: any, index: string) => {
                        const unitPrice = Number(formatUnits(
                          BigInt(item?.unitPrice as string),
                          getDecimals(
                            selectedRequest.currencyInfo.network!,
                            selectedRequest.currencyInfo.value,
                          ) ?? 18,
                        ));
                        const totalAmount = item.quantity * unitPrice;
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-2 px-4 border-b border-gray-200">{item.name}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{item.quantity}</td>
                            <td className="py-2 px-4 border-b border-gray-200">
                              {unitPrice} {""}
                            </td>
                            <td className="py-2 px-4 border-b border-gray-200">{item.discount}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{item.tax.amount}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{totalAmount}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-gray-200 py-4">
                  <h3 className="text-lg font-bold mb-2">Memo:</h3>
                  <p className="mb-1">{selectedRequest?.contentData?.note}</p>
                </div>
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  onClick={downloadPDF}
                >
                  Download PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
