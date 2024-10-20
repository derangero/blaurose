import jsPDF from 'jspdf';
import { useCallback, useMemo } from 'react';

export function exportToCsv(gridEl: HTMLDivElement, fileName: string) {
    const { head, body, foot } = getGridContent(gridEl);
    const content = [...head, ...body, ...foot]
      .map((cells) => cells.map(serialiseCellValue).join(','))
      .join('\n');
  
    downloadFile(fileName, new Blob([content], { type: 'text/csv;charset=utf-8;' }));
  }
  
  export async function exportToPdf(gridEl: HTMLDivElement, fileName: string) {
    const { head, body, foot } = getGridContent(gridEl);
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ]);
    const poppins = useFont("Poppins-Regular", "/fonts/Poppins-Regular.ttf")
    const doc = new jsPDF({
      orientation: 'l',
      unit: 'pt',
      format: 'a4',
      putOnlyUsedFonts: false
    });
    doc.setFont('Yu Gothic UI', 'normal');
    doc.text('Hello あ', 10, 10);
    autoTable(doc, {
      head,
      body,
      foot,
      horizontalPageBreak: true,
      styles: {font: 'Yu Gothic UI', fontStyle: 'normal', cellPadding: 1.5, fontSize: 8, cellWidth: 'wrap'},
      tableWidth: 'wrap'
    });
    doc.save(fileName);
  }
  
  function getGridContent(gridEl: HTMLDivElement) {
    return {
      head: getRows('.rdg-header-row'),
      body: getRows('.rdg-row:not(.rdg-summary-row)'),
      foot: getRows('.rdg-summary-row')
    };
  
    function getRows(selector: string) {
      return Array.from(gridEl.querySelectorAll<HTMLDivElement>(selector)).map((gridRow) => {
        return Array.from(gridRow.querySelectorAll<HTMLDivElement>('.rdg-cell')).map(
          (gridCell) => gridCell.innerText
        );
      });
    }
  }
  
  function serialiseCellValue(value: unknown) {
    if (typeof value === 'string') {
      const formattedValue = value.replace(/"/g, '""');
      return formattedValue.includes(',') ? `"${formattedValue}"` : formattedValue;
    }
    return value;
  }
  
  function downloadFile(fileName: string, data: Blob) {
    const downloadLink = document.createElement('a');
    downloadLink.download = fileName;
    const url = URL.createObjectURL(data);
    downloadLink.href = url;
    downloadLink.click();
    URL.revokeObjectURL(url);
  }

  export function useFont(name: string, path: string, style?: string): Font {

    const promise = useMemo(() => loadFont(path), [ path ])
    const install = useCallback(async (pdf: jsPDF) => {
      const data = await promise
      if (!data) return
      
      const fileName = name + ".ttf"
      pdf.addFileToVFS(fileName, Buffer.from(data).toString("base64"))
      pdf.addFont(fileName, name, style ?? "normal")
    }, [ name, promise, style ])
  
    return useMemo(() => ({
      name,
      install,
    }), [ name, install ])
  }

  async function loadFont(path: string): Promise<ArrayBuffer | undefined> {
    try {
      if (typeof window === "undefined") return undefined
      const response = await fetch(path)
      if (!response.ok) {
        console.error(`Failed to fetch font: ${response.statusText}`)
        return undefined
      }
      return await response.arrayBuffer()
    } catch (e) {
      console.error(e)
      return undefined
    }
  }

  export interface Font {
    name: string,
  
    install(pdf: jsPDF): Promise<void>
  }
  