
'use client';

import { useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export function usePrint() {
  const print = (component: React.ReactElement) => {
    const markup = renderToStaticMarkup(component);
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            ${markup}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      // Use a timeout to ensure styles are loaded
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  return { print };
}
