import { toast } from "sonner";
import { logoDataUrl, type BrokerProfile } from "@/lib/broker";

export async function downloadPdf(content: string, broker: BrokerProfile | null) {
  try {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(26, 24, 22);
    const name = (broker?.name ?? "BROKER").toUpperCase();
    const company = broker?.company?.trim() || "";
    const logo = await logoDataUrl(broker?.logoPath ?? null);
    let top = 18;
    if (logo) {
      const props = doc.getImageProperties(logo);
      const h = 14;
      const w = Math.min(60, (props.width / props.height) * h);
      doc.addImage(logo, props.fileType, 15, top - 4, w, (w / props.width) * props.height);
      top += 16;
    } else if (company) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.text(company.toUpperCase(), 15, top + 2);
      top += 9;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(26, 24, 22);
    doc.text("PROPERTY PRESENTATION", 15, top);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(142, 116, 83);
    doc.text(`DATE: ${new Date().toLocaleDateString("en-GB")}`, 15, top + 5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(26, 24, 22);
    doc.text(`PREPARED BY: ${name}`, 195, 18, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(92, 85, 78);
    [broker?.phone, broker?.email].filter(Boolean).forEach((l, i) => doc.text(String(l), 195, 23 + i * 4.5, { align: "right" }));
    const rule = top + 9;
    doc.setDrawColor(216, 206, 191);
    doc.setLineWidth(0.4);
    doc.line(15, rule, 195, rule);
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    const clean = content
      .replace(/^\s*\|?\s*:?-{2,}.*$/gm, "")
      .replace(/^\s*\|(.*)\|\s*$/gm, (_m, row: string) => row.split("|").map((c) => c.trim()).join("   "))
      .replace(/#{1,6}\s?/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/[^\x20-\x7E\n•–—]/g, "")
      .replace(/\n{3,}/g, "\n\n");
    const lines: string[] = doc.splitTextToSize(clean, 180);
    let y = rule + 8;
    const pageH = doc.internal.pageSize.height;
    for (const line of lines) {
      if (y > pageH - 20) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 15, y);
      y += 6;
    }
    doc.save(`${(company || "Property").replace(/\s+/g, "_")}_Presentation_${Date.now()}.pdf`);
  } catch (err) {
    console.error("PDF generation failed:", err);
    toast.error(`PDF export failed: ${(err as Error).message} — downloading as text instead.`);
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `Property_Presentation_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}
