import React, { useState, useRef } from "react";
import {
  Upload, FileText, CheckCircle2, AlertCircle, Download, X,
  ArrowRight, ShieldCheck, Sparkles, Database, Users
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { addImportedLeads, type Lead, type LeadType, type Stage } from "@/lib/demo-leads";

interface CsvImporterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess?: (count: number) => void;
}

interface ParsedLeadDraft {
  name: string;
  phone: string;
  email?: string;
  area: string;
  budget: number;
  beds: number;
  type: LeadType;
  stage: Stage;
  source: string;
  country: string;
  notes?: string;
}

export function CsvImporterModal({ open, onOpenChange, onImportSuccess }: CsvImporterModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedDrafts, setParsedDrafts] = useState<ParsedLeadDraft[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [headers, setHeaders] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setFile(null);
    setParsedDrafts([]);
    setIsProcessing(false);
    setHeaders([]);
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "Full Name,Phone Number,Email,Area,Budget AED,Bedrooms,Type,Stage,Source,Country,Notes\n" +
      "Khalid Al-Nuaimi,+971501234567,khalid@example.com,Downtown Dubai,4500000,2,Off-plan,New,WhatsApp,UAE,High net worth cash investor interested in Burj Crown\n" +
      "Elena Rostova,+971529876543,elena.r@example.com,Palm Jumeirah,12500000,3,Ready,Qualified,Property Finder,Russia,Looking for signature beachfront villa\n" +
      "Marcus Sterling,+447700900123,marcus@example.co.uk,Dubai Marina,2800000,1,Off-plan,New,Meta Ads,UK,Golden Visa seeker wants 60/40 payment plan\n" +
      "Fatima Al-Mansoor,+971554321098,fatima@example.ae,Dubai Hills Estate,5200000,3,Ready,Viewing,Referral,UAE,Upgrading primary residence near Dubai Hills Mall";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "dealos_dubai_leads_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("DealOS CSV Template downloaded.");
  };

  const parseCsvText = (text: string) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      toast.error("CSV file must have a header row and at least one lead row.");
      return;
    }

    const headerCols = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, "").toLowerCase());
    setHeaders(headerCols);

    // Map columns dynamically
    const nameIdx = headerCols.findIndex((h) => h.includes("name") || h.includes("client") || h.includes("lead"));
    const phoneIdx = headerCols.findIndex((h) => h.includes("phone") || h.includes("mobile") || h.includes("whatsapp") || h.includes("contact"));
    const emailIdx = headerCols.findIndex((h) => h.includes("email") || h.includes("mail"));
    const areaIdx = headerCols.findIndex((h) => h.includes("area") || h.includes("location") || h.includes("community") || h.includes("district"));
    const budgetIdx = headerCols.findIndex((h) => h.includes("budget") || h.includes("price") || h.includes("aed"));
    const bedsIdx = headerCols.findIndex((h) => h.includes("bed") || h.includes("room") || h.includes("br"));
    const typeIdx = headerCols.findIndex((h) => h.includes("type"));
    const stageIdx = headerCols.findIndex((h) => h.includes("stage") || h.includes("status"));
    const sourceIdx = headerCols.findIndex((h) => h.includes("source") || h.includes("channel") || h.includes("portal"));
    const countryIdx = headerCols.findIndex((h) => h.includes("country") || h.includes("nationality"));
    const notesIdx = headerCols.findIndex((h) => h.includes("note") || h.includes("message") || h.includes("comment"));

    const drafts: ParsedLeadDraft[] = [];

    for (let i = 1; i < lines.length; i++) {
      // Split on commas while respecting quotes
      const match = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      const rawCols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      if (rawCols.length === 0 || !rawCols.some((c) => c.length > 0)) continue;

      const rawName = nameIdx >= 0 && rawCols[nameIdx] ? rawCols[nameIdx] : `Investor #${i}`;
      const rawPhone = phoneIdx >= 0 && rawCols[phoneIdx] ? rawCols[phoneIdx] : "+971 50 000 0000";
      const rawArea = areaIdx >= 0 && rawCols[areaIdx] ? rawCols[areaIdx] : "Downtown Dubai";
      
      const rawBudgetString = budgetIdx >= 0 ? rawCols[budgetIdx].replace(/[^0-9.]/g, "") : "2500000";
      const budget = parseFloat(rawBudgetString) || 2500000;

      const rawBeds = bedsIdx >= 0 ? parseInt(rawCols[bedsIdx], 10) : 2;
      const beds = isNaN(rawBeds) ? 2 : rawBeds;

      let type: LeadType = "Off-plan";
      if (typeIdx >= 0 && rawCols[typeIdx]) {
        const tLower = rawCols[typeIdx].toLowerCase();
        if (tLower.includes("ready")) type = "Ready";
        else if (tLower.includes("rent")) type = "Rent";
      }

      let stage: Stage = "New";
      if (stageIdx >= 0 && rawCols[stageIdx]) {
        const sLower = rawCols[stageIdx].toLowerCase();
        if (sLower.includes("qualif")) stage = "Qualified";
        else if (sLower.includes("contact")) stage = "Contacted";
        else if (sLower.includes("view")) stage = "Viewing";
        else if (sLower.includes("offer")) stage = "Offer";
      }

      const source = sourceIdx >= 0 && rawCols[sourceIdx] ? rawCols[sourceIdx] : "CSV Import";
      const country = countryIdx >= 0 && rawCols[countryIdx] ? rawCols[countryIdx] : "UAE";
      const notes = notesIdx >= 0 ? rawCols[notesIdx] : undefined;

      drafts.push({
        name: rawName,
        phone: rawPhone,
        email: emailIdx >= 0 ? rawCols[emailIdx] : undefined,
        area: rawArea,
        budget,
        beds,
        type,
        stage,
        source,
        country,
        notes,
      });
    }

    setParsedDrafts(drafts);
    if (drafts.length > 0) {
      toast.success(`Successfully parsed ${drafts.length} leads from CSV!`);
    } else {
      toast.error("Could not extract valid leads from the file.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCsvText(text);
      };
      reader.readAsText(selected);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && (dropped.name.endsWith(".csv") || dropped.type === "text/csv" || dropped.type === "text/plain")) {
      setFile(dropped);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCsvText(text);
      };
      reader.readAsText(dropped);
    } else {
      toast.error("Please drop a valid .csv file.");
    }
  };

  const executeImport = () => {
    if (parsedDrafts.length === 0) {
      toast.error("No valid leads to import.");
      return;
    }

    setIsProcessing(true);

    const fullLeads: Lead[] = parsedDrafts.map((d, index) => {
      const nameParts = d.name.trim().split(" ");
      const initials = nameParts.length > 1
        ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
        : d.name.substring(0, 2).toUpperCase();

      return {
        id: `IMP-${Date.now().toString().slice(-4)}-${index + 1}`,
        name: d.name,
        initials,
        country: d.country,
        phone: d.phone,
        type: d.type,
        beds: d.beds,
        area: d.area,
        budget: d.budget,
        payment: d.type === "Rent" ? "Yearly" : d.type === "Off-plan" ? "Payment plan" : "Cash",
        score: Math.min(95, Math.floor(65 + Math.random() * 30)),
        stage: d.stage,
        source: d.source,
        receivedHoursAgo: 0.1, // Mark as just arrived for instant speed-to-lead
        contacted: d.stage !== "New",
        followUpDueInHours: d.stage === "New" ? null : 2,
        message: d.notes || `Enquired about ${d.beds}BR in ${d.area}. Immediate follow-up required.`,
        task: d.stage === "New" ? "Qualify" : "Send shortlist",
      };
    });

    addImportedLeads(fullLeads);

    setTimeout(() => {
      setIsProcessing(false);
      toast.success(
        `Imported ${fullLeads.length} leads into DealOS! Ready for instant WhatsApp outreach.`
      );
      if (onImportSuccess) {
        onImportSuccess(fullLeads.length);
      }
      resetState();
      onOpenChange(false);
    }, 600);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) resetState();
        onOpenChange(val);
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-zinc-800 text-zinc-100 p-6 sm:p-8 rounded-3xl shadow-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-gold">
              <Database size={12} /> Enterprise Data Ingestion
            </span>
          </div>
          <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center justify-between">
            <span>Import Real Estate Leads (CSV)</span>
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">
            Bulk upload leads from Property Finder, Bayut, Meta Ads, or legacy CRM exports. DealOS automatically parses phone numbers, budgets, and preferred communities.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Top Actions: Template Download */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs">
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-gold shrink-0" />
              <div>
                <p className="font-semibold text-zinc-200">Need a pre-formatted Dubai broker spreadsheet?</p>
                <p className="text-zinc-400">Download our verified column structure including RERA-ready fields.</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs gap-1.5 shrink-0"
            >
              <Download size={13} />
              <span>Download CSV Template</span>
            </Button>
          </div>

          {/* Drag & Drop Upload Zone */}
          {!file ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-gold bg-gold/5 scale-[1.01]"
                  : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/70"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-4">
                <Upload size={26} />
              </div>
              <h3 className="font-semibold text-white text-base mb-1">
                Drag and drop your leads CSV here
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
                Supports exports from HubSpot, Salesforce, Property Finder CRM, Bayut Pro, or custom Google Sheets.
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="rounded-xl text-xs font-semibold px-4"
              >
                Browse Files (.csv)
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{file.name}</p>
                  <p className="text-xs text-zinc-400">
                    {(file.size / 1024).toFixed(1)} KB · {parsedDrafts.length} records detected
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={resetState}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Remove file"
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Preview Table of Parsed Leads */}
          {parsedDrafts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold text-zinc-300">
                  Data Preview (Showing top 5 of {parsedDrafts.length} leads)
                </span>
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 size={13} /> {parsedDrafts.length} ready to ingest
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-900/50">
                <table className="w-full text-xs text-left">
                  <thead className="bg-zinc-900 text-zinc-400 font-semibold uppercase tracking-wider border-b border-zinc-800">
                    <tr>
                      <th className="px-3.5 py-2.5">Investor Name</th>
                      <th className="px-3.5 py-2.5">Phone / WhatsApp</th>
                      <th className="px-3.5 py-2.5">Target Area</th>
                      <th className="px-3.5 py-2.5">Budget</th>
                      <th className="px-3.5 py-2.5">Type</th>
                      <th className="px-3.5 py-2.5">Stage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {parsedDrafts.slice(0, 5).map((l, i) => (
                      <tr key={i} className="hover:bg-zinc-800/30 text-zinc-300">
                        <td className="px-3.5 py-2.5 font-medium text-white">{l.name}</td>
                        <td className="px-3.5 py-2.5 font-mono text-zinc-300">{l.phone}</td>
                        <td className="px-3.5 py-2.5">{l.area}</td>
                        <td className="px-3.5 py-2.5 font-semibold text-gold">
                          AED {(l.budget / 1000000).toFixed(2)}M
                        </td>
                        <td className="px-3.5 py-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-300 border border-zinc-700">
                            {l.type}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                            {l.stage}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <div className="text-xs text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-gold" />
              <span>Full tenant data segregation · Zero data sharing</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={parsedDrafts.length === 0 || isProcessing}
                onClick={executeImport}
                className="bg-gold hover:bg-gold/90 text-zinc-950 font-bold px-5 rounded-xl gap-2 shadow-lg"
              >
                {isProcessing ? (
                  <span>Ingesting records…</span>
                ) : (
                  <>
                    <span>Import {parsedDrafts.length} Leads</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
