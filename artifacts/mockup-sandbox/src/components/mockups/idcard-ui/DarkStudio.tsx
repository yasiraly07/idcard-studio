import { useState } from "react";
import {
  LayoutTemplate, Palette, User, Building, Phone, Upload,
  Download, Image as ImageIcon, ArrowRight, Check, Layers, Zap
} from "lucide-react";

type TemplateType = "modern" | "classic" | "minimal";
type Step = "design" | "institution" | "student" | "contact";

const STEPS: { id: Step; label: string; icon: any }[] = [
  { id: "design", label: "Design", icon: Palette },
  { id: "institution", label: "Institution", icon: Building },
  { id: "student", label: "Student", icon: User },
  { id: "contact", label: "Contact", icon: Phone },
];

const COLORS = [
  "#6366f1", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#0ea5e9", "#f97316", "#d946ef",
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

function DarkInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{label}</label>
      <input
        type="text"
        defaultValue={value}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/30 focus:bg-white/8 transition-all"
      />
    </div>
  );
}

function UploadZone({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-white/15 rounded-xl p-3 flex items-center gap-3 hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer group">
      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
        <ImageIcon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-300">{label}</p>
        <p className="text-[10px] text-slate-500">Click to upload • PNG, JPG</p>
      </div>
      <Upload className="w-3.5 h-3.5 text-slate-500 ml-auto group-hover:text-slate-300 transition-colors" />
    </div>
  );
}

function CardPreview({ color, template }: { color: string; template: TemplateType }) {
  if (template === "classic") {
    return (
      <div className="w-full h-full bg-white flex flex-col border-4 rounded-2xl overflow-hidden" style={{ borderColor: color }}>
        <div className="flex items-center gap-2 p-3 border-b-2" style={{ borderColor: color }}>
          <img src="https://picsum.photos/seed/logo/80/80" className="w-7 h-7 rounded object-cover" alt="logo" />
          <p className="font-black text-[10px] uppercase tracking-wide text-slate-900">{STUDENT.school}</p>
        </div>
        <div className="py-1 text-center text-white text-[8px] font-bold tracking-widest" style={{ backgroundColor: color }}>Student Identity Card</div>
        <div className="flex gap-3 p-3 flex-1">
          <img src="https://picsum.photos/seed/student/200/300" className="w-16 h-20 object-cover border border-slate-100 rounded shadow-sm" alt="student" />
          <div className="flex flex-col justify-center gap-1.5 flex-1">
            <div><p className="text-[7px] text-slate-400 uppercase font-bold">Name</p><p className="text-[11px] font-black text-slate-800">{STUDENT.name}</p></div>
            <div><p className="text-[7px] text-slate-400 uppercase font-bold">Program</p><p className="text-[9px] font-bold text-slate-700">{STUDENT.program}</p></div>
            <div><p className="text-[7px] text-slate-400 uppercase font-bold">ID</p><p className="text-[9px] font-bold text-slate-700">{STUDENT.id}</p></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1.5 mx-3 mb-3 p-2 bg-slate-50 rounded border border-slate-100">
          {[["D.O.B", STUDENT.dob], ["Blood", STUDENT.blood], ["Issued", STUDENT.issued], ["Expiry", STUDENT.expiry]].map(([l, v]) => (
            <div key={l}><p className="text-[6px] text-slate-400 uppercase font-bold">{l}</p><p className="text-[8px] font-bold text-slate-700">{v}</p></div>
          ))}
        </div>
      </div>
    );
  }
  if (template === "minimal") {
    return (
      <div className="w-full h-full bg-white flex flex-col relative rounded-2xl overflow-hidden pl-4">
        <div className="absolute left-0 top-0 bottom-0 w-3 rounded-l-2xl" style={{ backgroundColor: color }} />
        <div className="flex justify-between pt-4 pr-4">
          <img src="https://picsum.photos/seed/logo/80/80" className="w-8 h-8 rounded object-cover grayscale" alt="logo" />
          <div className="text-right"><p className="font-black text-[10px] uppercase text-slate-900">{STUDENT.school}</p></div>
        </div>
        <img src="https://picsum.photos/seed/student/400/500" className="mt-3 mr-3 h-28 w-full object-cover rounded-xl shadow-sm" alt="student" style={{ width: "calc(100% - 0.75rem)" }} />
        <div className="flex-1 pr-4 pt-2">
          <h1 className="text-xl font-black text-slate-900">{STUDENT.name}</h1>
          <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color }}>{STUDENT.program}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {[["ID", STUDENT.id], ["D.O.B", STUDENT.dob], ["Blood", STUDENT.blood], ["Exp.", STUDENT.expiry]].map(([l, v]) => (
              <div key={l}><p className="text-[6px] text-slate-400 uppercase font-bold">{l}</p><p className="text-[8px] font-bold text-slate-700">{v}</p></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full bg-white flex flex-col relative rounded-2xl overflow-hidden">
      <div className="absolute top-0 w-full h-28 rounded-b-[2rem]" style={{ backgroundColor: color }} />
      <div className="relative z-10 flex flex-col items-center pt-4 px-4 h-full">
        <h2 className="text-white font-bold text-center text-[10px] tracking-wide uppercase leading-tight mb-2 drop-shadow">{STUDENT.school}</h2>
        <img src="https://picsum.photos/seed/student/300/400" className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover" alt="student" />
        <div className="mt-3 text-center">
          <h1 className="text-lg font-black text-slate-800">{STUDENT.name}</h1>
          <p className="text-[9px] font-bold mt-0.5" style={{ color }}>{STUDENT.program}</p>
        </div>
        <div className="w-full mt-auto mb-4 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 shadow-sm">
          {[["ID Number", STUDENT.id], ["D.O.B", STUDENT.dob], ["Blood Group", STUDENT.blood], ["Issued", STUDENT.issued]].map(([l, v]) => (
            <div key={l}><p className="text-[6px] text-slate-400 uppercase font-bold tracking-wider">{l}</p><p className="text-[8px] font-bold text-slate-700">{v}</p></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DarkStudio() {
  const [color, setColor] = useState("#6366f1");
  const [template, setTemplate] = useState<TemplateType>("modern");
  const [step, setStep] = useState<Step>("design");
  const [showBack, setShowBack] = useState(false);

  const currentIdx = STEPS.findIndex((s) => s.id === step);

  return (
    <div
      className="min-h-screen flex overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif", background: "#0f1117" }}
    >
      {/* Dark Sidebar */}
      <div className="w-[320px] shrink-0 flex flex-col border-r border-white/5" style={{ background: "#161b27" }}>
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)" }}
            >
              <LayoutTemplate className="w-4.5 h-4.5 text-white" style={{ width: "18px", height: "18px" }} />
            </div>
            <div>
              <h1 className="text-sm font-black text-white leading-tight">IDCard Studio</h1>
              <p className="text-[10px] text-slate-500 font-medium">Professional ID maker</p>
            </div>
            <div className="ml-auto">
              <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
                <Zap className="w-2.5 h-2.5 text-emerald-400" />
                <span className="text-[9px] font-bold text-emerald-400">Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Step tabs */}
        <div className="flex px-4 pt-3 gap-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < currentIdx;
            const active = s.id === step;
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all ${
                  active
                    ? "bg-white/8 border border-white/10"
                    : "hover:bg-white/4"
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  done
                    ? "bg-emerald-500"
                    : active
                    ? "border-2 border-indigo-400"
                    : "border border-white/20"
                }`}>
                  {done ? <Check className="w-3 h-3 text-white" /> : <Icon className="w-2.5 h-2.5 text-slate-400" />}
                </div>
                <span className={`text-[8px] font-bold uppercase tracking-wider ${active ? "text-white" : "text-slate-500"}`}>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {step === "design" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Template Style</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["modern", "classic", "minimal"] as TemplateType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTemplate(t)}
                      className={`py-2.5 text-xs font-bold rounded-xl capitalize transition-all border ${
                        template === t
                          ? "border-indigo-500/50 text-white"
                          : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                      style={template === t ? { background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))" } : {}}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Accent Color</p>
                <div className="grid grid-cols-4 gap-2.5">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`h-8 rounded-lg transition-all relative ${color === c ? "ring-2 ring-white/40 ring-offset-1 ring-offset-[#161b27] scale-110" : "hover:scale-105"}`}
                      style={{ backgroundColor: c }}
                    >
                      {color === c && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white drop-shadow" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Preview Color</p>
                <div
                  className="h-10 rounded-xl w-full border border-white/10 flex items-center px-3 gap-2"
                  style={{ backgroundColor: `${color}22` }}
                >
                  <div className="w-5 h-5 rounded-full border-2 border-white/20 shadow" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono text-white/70">{color}</span>
                </div>
              </div>
            </div>
          )}

          {step === "institution" && (
            <div className="space-y-3">
              <DarkInput label="School / University Name" value={STUDENT.school} />
              <DarkInput label="School Address" value={STUDENT.address} />
              <UploadZone label="School Logo" />
              <UploadZone label="Authorized Signature" />
            </div>
          )}

          {step === "student" && (
            <div className="space-y-3">
              <DarkInput label="Full Name" value={STUDENT.name} />
              <DarkInput label="Program / Course" value={STUDENT.program} />
              <div className="grid grid-cols-2 gap-2">
                <DarkInput label="ID Number" value={STUDENT.id} />
                <DarkInput label="Blood Group" value={STUDENT.blood} />
              </div>
              <DarkInput label="Date of Birth" value={STUDENT.dob} />
              <UploadZone label="Student Photo" />
            </div>
          )}

          {step === "contact" && (
            <div className="space-y-3">
              <DarkInput label="Emergency Contact" value={STUDENT.emergency} />
              <DarkInput label="Residential Address" value={STUDENT.studentAddress} />
              <div className="grid grid-cols-2 gap-2">
                <DarkInput label="Issue Date" value={STUDENT.issued} />
                <DarkInput label="Expiry Date" value={STUDENT.expiry} />
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="p-4 border-t border-white/5 space-y-2">
          {currentIdx < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(STEPS[currentIdx + 1].id)}
              className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              Next: {STEPS[currentIdx + 1].label} <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              className="w-full py-2.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 8px 24px -8px rgba(16,185,129,0.4)" }}
            >
              <Download className="w-4 h-4" /> Download Cards
            </button>
          )}
          {currentIdx > 0 && (
            <button
              onClick={() => setStep(STEPS[currentIdx - 1].id)}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div
        className="flex-1 flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f1117 0%, #161b27 50%, #0f1117 100%)" }}
      >
        {/* Glow effect */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: color, top: "20%", left: "40%" }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Controls */}
        <div className="relative z-10 flex items-center gap-2 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex items-center gap-3 backdrop-blur-sm">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">View</span>
            <div className="w-px h-4 bg-white/10" />
            {["Front", "Back"].map((side) => (
              <button
                key={side}
                onClick={() => setShowBack(side === "Back")}
                className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                  (side === "Back") === showBack
                    ? "text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                style={(side === "Back") === showBack ? { backgroundColor: color } : {}}
              >
                {side}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="relative z-10 flex gap-10 items-start">
          {/* Front */}
          <div className={`flex flex-col items-center gap-3 transition-all duration-500 ${showBack ? "opacity-30 -translate-x-4 scale-90" : "opacity-100 translate-x-0 scale-100"}`}>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Front Side</span>
            <div
              className="w-[240px] h-[380px] rounded-2xl overflow-hidden"
              style={{
                boxShadow: showBack
                  ? "0 8px 32px rgba(0,0,0,0.6)"
                  : `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), 0 0 60px ${color}33`,
              }}
            >
              <CardPreview color={color} template={template} />
            </div>
          </div>

          {/* Back */}
          <div className={`flex flex-col items-center gap-3 transition-all duration-500 ${!showBack ? "opacity-30 translate-x-4 scale-90" : "opacity-100 translate-x-0 scale-100"}`}>
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Back Side</span>
            <div
              className="w-[240px] h-[380px] rounded-2xl overflow-hidden bg-white flex flex-col p-4 relative"
              style={{
                boxShadow: !showBack
                  ? "0 8px 32px rgba(0,0,0,0.6)"
                  : `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), 0 0 60px ${color}33`,
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-2 rounded-t-2xl" style={{ backgroundColor: color }} />
              <div className="mt-2 flex flex-col gap-2.5 flex-1">
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Emergency</p>
                  <p className="text-[11px] font-bold text-slate-800">{STUDENT.emergency}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Address</p>
                  <p className="text-[9px] font-medium text-slate-700 leading-relaxed">{STUDENT.studentAddress}</p>
                </div>
                <div className="px-1">
                  <p className="text-[7px] text-slate-400 leading-relaxed">Property of <strong>{STUDENT.school}</strong>. Return to:</p>
                  <p className="text-[8px] font-bold text-slate-700 mt-0.5">{STUDENT.address}</p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-2.5 flex justify-between items-end">
                <div>
                  <div className="h-5 mb-1 text-slate-300 text-sm font-['Dancing_Script'] italic">Signature</div>
                  <div className="w-16 border-t border-slate-300 pt-0.5">
                    <p className="text-[5px] font-bold text-slate-400 uppercase tracking-widest">Auth. Signature</p>
                  </div>
                </div>
                <div className="flex gap-px">
                  {Array.from({ length: 34 }).map((_, i) => (
                    <div key={i} className="w-[2px] bg-slate-800 rounded-sm" style={{ height: `${10 + Math.sin(i * 0.8) * 5}px` }} />
                  ))}
                </div>
              </div>
              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wider text-center mt-1.5">Valid until: {STUDENT.expiry}</p>
            </div>
          </div>
        </div>

        {/* Tag */}
        <div className="relative z-10 mt-8">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm"
            style={{ backgroundColor: `${color}15` }}
          >
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
            <span className="text-xs font-semibold text-white/60">High-res PNG export • 2× quality</span>
          </div>
        </div>
      </div>
    </div>
  );
}
