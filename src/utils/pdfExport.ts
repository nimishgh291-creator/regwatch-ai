import jsPDF from "jspdf";

interface RegulatoryUpdate {
  id: number;
  title: string;
  summary: string | null;
  risk_level: string | null;
  dev_action: string | null;
  source_url: string | null;
  detailed_analysis: string[] | null;
  dev_impact_score: number | null;
  category: string | null;
}

interface MarketImpactResult {
  analysis: string;
  sources: { title: string; url: string }[];
  tavilyAnswer: string | null;
}

export const exportToPDF = (
  update: RegulatoryUpdate,
  marketImpact?: MarketImpactResult | null
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPosition = 20;

  // Helper function to add wrapped text
  const addWrappedText = (text: string, fontSize: number, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    const lines = doc.splitTextToSize(text, contentWidth);
    
    lines.forEach((line: string) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });
    yPosition += 5;
  };

  // Header
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("RegWatch AI Report", margin, 25);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, 35);

  yPosition = 55;
  doc.setTextColor(0, 0, 0);

  // Title
  addWrappedText(update.title, 16, true);
  yPosition += 5;

  // Category and Risk Level
  const riskColors: Record<string, [number, number, number]> = {
    high: [239, 68, 68],
    medium: [234, 179, 8],
    low: [34, 197, 94],
  };
  
  if (update.category) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Category: ${update.category}`, margin, yPosition);
    yPosition += 6;
  }

  if (update.risk_level) {
    const [r, g, b] = riskColors[update.risk_level] || [100, 100, 100];
    doc.setTextColor(r, g, b);
    doc.text(`Risk Level: ${update.risk_level.toUpperCase()}`, margin, yPosition);
    yPosition += 10;
  }

  doc.setTextColor(0, 0, 0);

  // Summary
  if (update.summary) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", margin, yPosition);
    yPosition += 8;
    addWrappedText(update.summary, 10);
    yPosition += 5;
  }

  // Detailed Analysis
  if (update.detailed_analysis && update.detailed_analysis.length > 0) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Analysis", margin, yPosition);
    yPosition += 8;
    
    update.detailed_analysis.forEach((item, index) => {
      addWrappedText(`${index + 1}. ${item}`, 10);
    });
    yPosition += 5;
  }

  // Dev Action
  if (update.dev_action) {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(margin, yPosition, contentWidth, 30, 3, 3, "F");
    doc.setDrawColor(99, 102, 241);
    doc.roundedRect(margin, yPosition, contentWidth, 30, 3, 3, "S");
    
    yPosition += 8;
    doc.setFontSize(10);
    doc.setTextColor(99, 102, 241);
    doc.setFont("helvetica", "bold");
    doc.text("DEV ACTION REQUIRED", margin + 5, yPosition);
    yPosition += 6;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    const actionLines = doc.splitTextToSize(update.dev_action, contentWidth - 10);
    actionLines.forEach((line: string) => {
      doc.text(line, margin + 5, yPosition);
      yPosition += 5;
    });
    yPosition += 15;
  }

  // Dev Impact Score
  if (update.dev_impact_score) {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Developer Impact Score: ${update.dev_impact_score}/10`, margin, yPosition);
    yPosition += 10;
  }

  // Market Impact Analysis
  if (marketImpact) {
    if (yPosition > 220) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFillColor(245, 243, 255);
    doc.roundedRect(margin, yPosition, contentWidth, 15, 3, 3, "F");
    yPosition += 10;
    doc.setFontSize(12);
    doc.setTextColor(139, 92, 246);
    doc.setFont("helvetica", "bold");
    doc.text("AI Market Impact Analysis", margin + 5, yPosition);
    yPosition += 12;
    
    doc.setTextColor(0, 0, 0);
    addWrappedText(marketImpact.analysis, 10);
    yPosition += 5;

    if (marketImpact.sources.length > 0) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Sources:", margin, yPosition);
      yPosition += 6;
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(99, 102, 241);
      marketImpact.sources.slice(0, 5).forEach((source) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        const truncatedTitle = source.title.length > 60 
          ? source.title.substring(0, 60) + "..." 
          : source.title;
        doc.text(`• ${truncatedTitle}`, margin + 5, yPosition);
        yPosition += 5;
      });
    }
  }

  // Footer
  const totalPages = doc.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${totalPages} | RegWatch AI - Regulatory Intelligence Platform`,
      pageWidth / 2,
      287,
      { align: "center" }
    );
  }

  // Save
  const fileName = `RegWatch_${update.title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30)}_${Date.now()}.pdf`;
  doc.save(fileName);
};
