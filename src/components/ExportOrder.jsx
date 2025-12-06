import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { toast } from 'react-toastify';

export default function ExportOrder() {
  const [isExporting, setIsExporting] = useState(false);

  const functions = getFunctions(); 
  const exportOrders = httpsCallable(functions, 'exportOrdersToSheet');

  const handleExport = async () => {
    setIsExporting(true);
    toast.info("Exporting orders to Google Sheet...");

    try {
      const res = await exportOrders();
      toast.success(`✅ Exported ${res.data.count} orders successfully!`);
    } catch (error) {
      console.error(error);
      toast.error("❌ Export failed. Check Firebase logs.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`mb-4 px-4 py-2 rounded text-white transition ${
          isExporting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isExporting ? 'Exporting...' : 'Export Orders to Google Sheets'}
      </button>

      {/* Other dashboard content */}
    </div>
  );
}
