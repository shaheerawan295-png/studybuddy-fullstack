const sanitizeFileName = (name: string) =>
  name
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, "-")
    .toLowerCase();

export function downloadMarkdown(filename: string, markdown: string) {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `${sanitizeFileName(filename || "studybuddy-export")}.md`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function printElementAsPdf(elementId: string, title: string) {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error("Export content was not found on the page.");
  }

  const printableNode = element.cloneNode(true) as HTMLElement;
  printableNode.querySelectorAll(".no-print, button, a, input, select, textarea").forEach((child) => {
    child.remove();
  });

  const html = `
    <!doctype html>
    <html>
      <head>
        <title>${title}</title>
        <meta charset="utf-8" />
        <style>
          :root { color-scheme: light; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 32px;
            color: #0f172a;
            background: #ffffff;
            font-family: Arial, Helvetica, sans-serif;
            line-height: 1.55;
          }
          h1, h2, h3 { color: #0f172a; line-height: 1.2; }
          h1 { font-size: 28px; margin: 0 0 16px; }
          h2 { font-size: 22px; margin: 24px 0 10px; }
          h3 { font-size: 18px; margin: 18px 0 8px; }
          p, li { font-size: 14px; }
          ul, ol { padding-left: 22px; }
          img { max-width: 100%; }
          @page { margin: 18mm; }
        </style>
      </head>
      <body>
        <div style="max-width: 900px; margin: 0 auto;">${printableNode.outerHTML}</div>
      </body>
    </html>
  `;

  let printWindow = window.open("", "_blank", "noopener,noreferrer,width=900,height=1200");

  if (!printWindow) {
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "-9999px";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const frameDoc = iframe.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(html);
      frameDoc.close();
      iframe.contentWindow?.focus();
      window.setTimeout(() => {
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
      }, 300);
    }
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 300);
}
