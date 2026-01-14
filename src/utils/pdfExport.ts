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

// Helper function to sanitize text for PDF - removes special characters that cause encoding issues
const sanitizeText = (text: string): string => {
  if (!text) return "";
  
  return text
    // Replace common problematic characters
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/×/g, "x")
    .replace(/÷/g, "/")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/≠/g, "!=")
    .replace(/±/g, "+/-")
    .replace(/°/g, " degrees")
    .replace(/€/g, "EUR")
    .replace(/£/g, "GBP")
    .replace(/¥/g, "JPY")
    .replace(/₹/g, "INR")
    // Replace backticks and special quotes
    .replace(/[`´]/g, "'")
    // Replace special mathematical symbols
    .replace(/[∑∏∫∂∆∇√∞]/g, "")
    // Replace superscript/subscript numbers
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (match) => {
      const map: Record<string, string> = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
      return `^${map[match] || ''}`;
    })
    .replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (match) => {
      const map: Record<string, string> = { '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9' };
      return `_${map[match] || ''}`;
    })
    // Replace bullet points
    .replace(/[•◦▪▫●○]/g, "-")
    // Replace arrows
    .replace(/[→←↑↓↔↕⇒⇐⇑⇓]/g, "->")
    // Replace other special Unicode characters with ASCII equivalents or remove them
    .replace(/[^\x00-\x7F]/g, (char) => {
      // Try to get ASCII equivalent, otherwise remove
      const code = char.charCodeAt(0);
      if (code >= 0x00C0 && code <= 0x00C5) return 'A';
      if (code >= 0x00C8 && code <= 0x00CB) return 'E';
      if (code >= 0x00CC && code <= 0x00CF) return 'I';
      if (code >= 0x00D2 && code <= 0x00D6) return 'O';
      if (code >= 0x00D9 && code <= 0x00DC) return 'U';
      if (code >= 0x00E0 && code <= 0x00E5) return 'a';
      if (code >= 0x00E8 && code <= 0x00EB) return 'e';
      if (code >= 0x00EC && code <= 0x00EF) return 'i';
      if (code >= 0x00F2 && code <= 0x00F6) return 'o';
      if (code >= 0x00F9 && code <= 0x00FC) return 'u';
      if (code === 0x00D1) return 'N';
      if (code === 0x00F1) return 'n';
      if (code === 0x00C7) return 'C';
      if (code === 0x00E7) return 'c';
      return '';
    })
    // Clean up any double spaces
    .replace(/\s+/g, ' ')
    .trim();
};

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
    const sanitized = sanitizeText(text);
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    const lines = doc.splitTextToSize(sanitized, contentWidth);
    
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
    doc.text(`Category: ${sanitizeText(update.category)}`, margin, yPosition);
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
    
    // Calculate height needed for action text
    const sanitizedAction = sanitizeText(update.dev_action);
    const actionLines = doc.splitTextToSize(sanitizedAction, contentWidth - 10);
    const boxHeight = Math.max(30, actionLines.length * 5 + 15);
    
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(margin, yPosition, contentWidth, boxHeight, 3, 3, "F");
    doc.setDrawColor(99, 102, 241);
    doc.roundedRect(margin, yPosition, contentWidth, boxHeight, 3, 3, "S");
    
    yPosition += 8;
    doc.setFontSize(10);
    doc.setTextColor(99, 102, 241);
    doc.setFont("helvetica", "bold");
    doc.text("DEV ACTION REQUIRED", margin + 5, yPosition);
    yPosition += 6;
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
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
        const sanitizedTitle = sanitizeText(source.title);
        const truncatedTitle = sanitizedTitle.length > 60 
          ? sanitizedTitle.substring(0, 60) + "..." 
          : sanitizedTitle;
        doc.text(`- ${truncatedTitle}`, margin + 5, yPosition);
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
  const sanitizedTitle = sanitizeText(update.title).replace(/[^a-zA-Z0-9]/g, "_").substring(0, 30);
  const fileName = `RegWatch_${sanitizedTitle}_${Date.now()}.pdf`;
  doc.save(fileName);
};
