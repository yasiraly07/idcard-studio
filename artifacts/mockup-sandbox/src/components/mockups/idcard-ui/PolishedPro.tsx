import { useState } from "react";
import {
  LayoutTemplate, Palette, User, Building, Phone, Upload,
  Download, ChevronDown, ChevronUp, Image as ImageIcon,
  CheckCircle2, Sparkles, RotateCcw
} from "lucide-react";

type TemplateType = "modern" | "classic" | "minimal";

const COLORS = [
  { hex: "#6366f1", name: "Indigo" },
  { hex: "#10b981", name: "Emerald" },
  { hex: "#f59e0b", name: "Amber" },
  { hex: "#ef4444", name: "Rose" },
  { hex: "#8b5cf6", name: "Violet" },
  { hex: "#0ea5e9", name: "Sky" },
  { hex: "#1e293b", name: "Slate" },
  { hex: "#d946ef", name: "Fuchsia" },
];

const STUDENT = {
  name: "Alex Johnson",
  program: "B.Sc. Computer Science",
  id: "STU-2026-042",
  dob: "2002-08-15",
  blood: "O+",
  issued: "2026-09-01",
  expiry: "2030-05-31",
  school: "University of Excellence",
  address: "123 Education Ave, Knowledge City, 90210",
  emergency: "+1 (555) 123-4567",
  studentAddress: "456 Campus Drive, Apt 4B, Knowledge City",
};

function SectionHeader({ icon: Icon, label, open, onToggle }: any) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-2.5 px-1 group"
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</span>
      </div>
      {open
        ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        : <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />}
    </button>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</label>
      <input
        type="text"
        defaultValue={value}
        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
      />
    </div>
  );
}

function UploadRow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 p-2.5 bg-slate-50 border border-dashed border-slate-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer group">
      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-indigo-200 transition-colors">
        <ImageIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-600">{label}</p>
        <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
      </div>
      <Upload className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
    </div>
  );
}

function CardFront({ color, template }: { color: string; template: TemplateType }) {
  if (template === "classic") {
    return (
      <div className="w-full h-full bg-white flex flex-col border-4 rounded-xl overflow-hidden" style={{ borderColor: color }}>
        <div className="flex items-center gap-2 p-3 border-b-2" style={{ borderColor: color }}>
          <img src="https://picsum.photos/seed/logo/80/80" className="w-8 h-8 rounded object-cover" alt="logo" />
          <p className="font-black text-[11px] uppercase tracking-wide text-slate-900">{STUDENT.school}</p>
        </div>
        <div className="py-1 text-center text-white text-[9px] font-bold tracking-widest" style={{ backgroundColor: color }}>
          Student Identity Card
        </div>
        <div className="flex gap-3 p-3 flex-1">
          <img src="https://picsum.photos/seed/student/200/300" className="w-20 h-24 object-cover border-2 border-slate-100 rounded-lg shadow-sm" alt="student" />
          <div className="flex flex-col justify-center gap-2 flex-1">
            <div><p className="text-[8px] text-slate-400 uppercase font-bold">Name</p><p className="text-xs font-black text-slate-800">{STUDENT.name}</p></div>
            <div><p className="text-[8px] text-slate-400 uppercase font-bold">Program</p><p className="text-[10px] font-bold text-slate-700">{STUDENT.program}</p></div>
            <div><p className="text-[8px] text-slate-400 uppercase font-bold">ID</p><p className="text-[10px] font-bold text-slate-700">{STUDENT.id}</p></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mx-3 mb-3 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
          {[["D.O.B", STUDENT.dob], ["Blood", STUDENT.blood], ["Issued", STUDENT.issued], ["Expiry", STUDENT.expiry]].map(([l, v]) => (
            <div key={l}><p className="text-[7px] text-slate-400 uppercase font-bold">{l}</p><p className="text-[9px] font-bold text-slate-700">{v}</p></div>
          ))}
        </div>
      </div>
    );
  }
  if (template === "minimal") {
    return (
      <div className="w-full h-full bg-white flex flex-col relative rounded-xl overflow-hidden pl-4">
        <div className="absolute left-0 top-0 bottom-0 w-3 rounded-l-xl" style={{ backgroundColor: color }}></div>
        <div className="flex justify-between items-start pt-5 pr-4 mb-4">
          <img src="https://picsum.photos/seed/logo/80/80" className="w-10 h-10 rounded-lg object-cover grayscale" alt="logo" />
          <div className="text-right"><p className="font-black text-[11px] uppercase text-slate-900 leading-tight">{STUDENT.school}</p></div>
        </div>
        <img src="https://picsum.photos/seed/student/400/500" className="w-full h-36 object-cover rounded-xl mx-auto pr-4 shadow-sm" style={{ maxWidth: "calc(100% - 1rem)" }} alt="student" />
        <div className="flex-1 pr-4 pt-3">
          <h1 className="text-2xl font-black text-slate-900 leading-tight">{STUDENT.name}</h1>
          <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5 mb-3" style={{ color }}>{STUDENT.program}</p>
          <div className="grid grid-cols-2 gap-y-2">
            {[["ID No.", STUDENT.id], ["D.O.B", STUDENT.dob], ["Blood", STUDENT.blood], ["Exp.", STUDENT.expiry]].map(([l, v]) => (
              <div key={l}><p className="text-[7px] text-slate-400 uppercase font-bold">{l}</p><p className="text-[9px] font-bold text-slate-700">{v}</p></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full bg-white flex flex-col relative rounded-xl overflow-hidden">
      <div className="absolute top-0 w-full h-32 rounded-b-[2.5rem]" style={{ backgroundColor: color }}></div>
      <div className="relative z-10 flex flex-col items-center pt-5 px-5 h-full">
        <h2 className="text-white font-bold text-center text-[11px] tracking-wide uppercase leading-tight mb-3 drop-shadow">{STUDENT.school}</h2>
        <div className="relative">
          <img src="https://picsum.photos/seed/student/300/400" className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" alt="student" />
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: color }}></div>
        </div>
        <div className="mt-4 text-center">
          <h1 className="text-xl font-black text-slate-800">{STUDENT.name}</h1>
          <p className="text-[10px] font-bold mt-0.5" style={{ color }}>{STUDENT.program}</p>
        </div>
        <div className="w-full mt-auto mb-5 grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm">
          {[["ID Number", STUDENT.id], ["D.O.B", STUDENT.dob], ["Blood Group", STUDENT.blood], ["Issued", STUDENT.issued]].map(([l, v]) => (
            <div key={l}><p className="text-[7px] text-slate-400 uppercase font-bold tracking-wider">{l}</p><p className="text-[9px] font-bold text-slate-700">{v}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PolishedPro() {
  const [color, setColor] = useState("#6366f1");
  const [template, setTemplate] = useState<TemplateType>("modern");
  const [openSections, setOpenSections] = useState({ design: true, institution: true, student: false, contact: false });
  const [flipped, setFlipped] = useState(false);

  const toggle = (key: keyof typeof openSections) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <div className="w-[340px] shrink-0 bg-white border-r border-slate-100 flex flex-col shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <LayoutTemplate className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">IDCard Studio</h1>
              <p className="text-[10px] text-slate-400 font-medium">Design your student card</p>
            </div>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
          {/* Design */}
          <div className="rounded-xl overflow-hidden">
            <SectionHeader icon={Palette} label="Design" open={openSections.design} onToggle={() => toggle("design")} />
            {openSections.design && (
              <div className="pb-3 space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Template</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["modern", "classic", "minimal"] as TemplateType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTemplate(t)}
                        className={`py-2 text-xs font-bold rounded-lg capitalize transition-all ${
                          template === t
                            ? "text-white shadow-md shadow-indigo-200"
                            : "bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100"
                        }`}
                        style={template === t ? { background: `linear-gradient(135deg, #6366f1, #8b5cf6)` } : {}}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Theme Color</p>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setColor(c.hex)}
                        title={c.name}
                        className={`w-7 h-7 rounded-full transition-all ${
                          color === c.hex ? "ring-2 ring-offset-2 ring-slate-400 scale-110" : "hover:scale-110"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="border-b border-slate-100" />
          </div>

          {/* Institution */}
          <div className="rounded-xl overflow-hidden">
            <SectionHeader icon={Building} label="Institution" open={openSections.institution} onToggle={() => toggle("institution")} />
            {openSections.institution && (
              <div className="pb-3 space-y-2.5">
                <FieldRow label="School / University Name" value={STUDENT.school} />
                <FieldRow label="Address" value={STUDENT.address} />
                <UploadRow label="School Logo" />
                <UploadRow label="Authorized Signature" />
              </div>
            )}
            <div className="border-b border-slate-100" />
          </div>

          {/* Student */}
          <div className="rounded-xl overflow-hidden">
            <SectionHeader icon={User} label="Student Details" open={openSections.student} onToggle={() => toggle("student")} />
            {openSections.student && (
              <div className="pb-3 space-y-2.5">
                <FieldRow label="Full Name" value={STUDENT.name} />
                <FieldRow label="Program / Course" value={STUDENT.program} />
                <div className="grid grid-cols-2 gap-2">
                  <FieldRow label="ID Number" value={STUDENT.id} />
                  <FieldRow label="Blood Group" value={STUDENT.blood} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <FieldRow label="Date of Birth" value={STUDENT.dob} />
                  <FieldRow label="Issue Date" value={STUDENT.issued} />
                </div>
                <UploadRow label="Student Photo" />
              </div>
            )}
            <div className="border-b border-slate-100" />
          </div>

          {/* Contact */}
          <div className="rounded-xl overflow-hidden">
            <SectionHeader icon={Phone} label="Contact & Validity" open={openSections.contact} onToggle={() => toggle("contact")} />
            {openSections.contact && (
              <div className="pb-3 space-y-2.5">
                <FieldRow label="Emergency Contact" value={STUDENT.emergency} />
                <FieldRow label="Residential Address" value={STUDENT.studentAddress} />
                <div className="grid grid-cols-2 gap-2">
                  <FieldRow label="Issue Date" value={STUDENT.issued} />
                  <FieldRow label="Expiry Date" value={STUDENT.expiry} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Download button */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <button
            className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-90 active:scale-95"
            style={{ background: `linear-gradient(135deg, #6366f1, #8b5cf6)`, boxShadow: "0 8px 24px -8px rgba(99,102,241,0.5)" }}
          >
            <Download className="w-4 h-4" /> Download Both Sides
          </button>
          <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">Exports as high-res PNG • 2x quality</p>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-slate-100">
        {/* Dot grid background */}
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />

        {/* Toolbar */}
        <div className="relative z-10 flex items-center gap-2 mb-6">
          <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200 flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preview</span>
            <div className="w-px h-4 bg-slate-200" />
            <button
              onClick={() => setFlipped(false)}
              className={`text-xs font-bold px-2 py-0.5 rounded-md transition-all ${!flipped ? "text-white" : "text-slate-500 hover:text-slate-700"}`}
              style={!flipped ? { backgroundColor: color } : {}}
            >
              Front
            </button>
            <button
              onClick={() => setFlipped(true)}
              className={`text-xs font-bold px-2 py-0.5 rounded-md transition-all ${flipped ? "text-white" : "text-slate-500 hover:text-slate-700"}`}
              style={flipped ? { backgroundColor: color } : {}}
            >
              Back
            </button>
            <div className="w-px h-4 bg-slate-200" />
            <button onClick={() => setFlipped((f) => !f)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card display */}
        <div className="relative z-10 flex gap-8 items-start">
          {/* Front */}
          <div className={`flex flex-col items-center gap-3 transition-all duration-300 ${flipped ? "opacity-40 scale-95" : "opacity-100 scale-100"}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">Front</span>
            <div className="w-[260px] h-[400px] shadow-2xl rounded-xl overflow-hidden" style={{ boxShadow: "0 24px 48px -12px rgba(0,0,0,0.18)" }}>
              <CardFront color={color} template={template} />
            </div>
          </div>

          {/* Back */}
          <div className={`flex flex-col items-center gap-3 transition-all duration-300 ${!flipped ? "opacity-40 scale-95" : "opacity-100 scale-100"}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">Back</span>
            <div className="w-[260px] h-[400px] shadow-2xl rounded-xl overflow-hidden bg-white flex flex-col p-5 relative" style={{ boxShadow: "0 24px 48px -12px rgba(0,0,0,0.18)" }}>
              <div className="absolute top-0 left-0 right-0 h-2.5 rounded-t-xl" style={{ backgroundColor: color }} />
              <div className="mt-3 flex flex-col gap-3 flex-1">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Emergency Contact</p>
                  <p className="text-sm font-bold text-slate-800">{STUDENT.emergency}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Residential Address</p>
                  <p className="text-[11px] font-medium text-slate-700 leading-relaxed">{STUDENT.studentAddress}</p>
                </div>
                <div className="px-1">
                  <p className="text-[8px] text-slate-400 leading-relaxed">Property of <strong>{STUDENT.school}</strong>. If found return to:</p>
                  <p className="text-[9px] font-bold text-slate-700 mt-0.5">{STUDENT.address}</p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-end">
                <div className="flex flex-col items-center">
                  <div className="h-6 mb-1 text-slate-300 text-lg font-['Dancing_Script'] italic">Signature</div>
                  <div className="w-20 border-t border-slate-300 pt-0.5 text-center">
                    <p className="text-[6px] font-bold text-slate-400 uppercase tracking-widest">Auth. Signature</p>
                  </div>
                </div>
                <div>
                  <div className="flex gap-px">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} className="w-[2px] bg-slate-800 rounded-sm" style={{ height: `${12 + Math.sin(i * 0.8) * 6}px` }} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider text-center mt-2">Valid until: {STUDENT.expiry}</p>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="relative z-10 mt-6 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-xs font-medium text-slate-600">Card ready to download</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>
      </div>
    </div>
  );
}
