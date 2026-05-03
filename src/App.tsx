import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import Barcode from 'react-barcode';
import {
  Upload, Download, Image as ImageIcon, LayoutTemplate, Palette,
  User, Building, Phone, ChevronDown, ChevronUp, CheckCircle2,
  Sparkles, RotateCcw,
} from 'lucide-react';

const APP_NAME = 'IDCard Studio';

type TemplateType = 'modern' | 'classic' | 'minimal';

interface StudentData {
  schoolName: string;
  schoolAddress: string;
  studentName: string;
  program: string;
  idNumber: string;
  dob: string;
  bloodGroup: string;
  issueDate: string;
  expiryDate: string;
  emergencyContact: string;
  address: string;
  logoUrl: string;
  photoUrl: string;
  signatureUrl: string;
  template: TemplateType;
  themeColor: string;
}

const DEFAULT_DATA: StudentData = {
  schoolName: 'University of Excellence',
  schoolAddress: '123 Education Ave, Knowledge City, 90210',
  studentName: 'Alex Johnson',
  program: 'B.Sc. Computer Science',
  idNumber: 'STU-2026-042',
  dob: '2002-08-15',
  bloodGroup: 'O+',
  issueDate: '2026-09-01',
  expiryDate: '2030-05-31',
  emergencyContact: '+1 (555) 123-4567',
  address: '456 Campus Drive, Apt 4B, Knowledge City',
  logoUrl: 'https://picsum.photos/seed/logo/100/100',
  photoUrl: 'https://picsum.photos/seed/student/300/400',
  signatureUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgODAiPjxwYXRoIGQ9Ik0yMCw2MCBDNDAsMjAgNjAsMjAgODAsNjAgQzEwMCw4MCAxMjAsMjAgMTQwLDQwIEMxNjAsNjAgMTgwLDQwIDE5MCw1MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIzIi8+PC9zdmc+',
  template: 'modern',
  themeColor: '#6366f1',
};

const THEME_COLORS = [
  { hex: '#6366f1', name: 'Indigo' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#f59e0b', name: 'Amber' },
  { hex: '#ef4444', name: 'Rose' },
  { hex: '#8b5cf6', name: 'Violet' },
  { hex: '#1e293b', name: 'Slate' },
  { hex: '#0ea5e9', name: 'Sky' },
  { hex: '#d946ef', name: 'Fuchsia' },
];

// --- Reusable UI primitives ---

function FieldInput({ label, type = 'text', ...props }: any) {
  return (
    <div className={props.className}>
      <label className="block text-[10px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">{label}</label>
      {type === 'textarea' ? (
        <textarea
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all text-sm resize-none text-slate-700"
          rows={3}
          {...props}
        />
      ) : (
        <input
          type={type}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-400 focus:border-transparent outline-none transition-all text-sm text-slate-700"
          {...props}
        />
      )}
    </div>
  );
}

function UploadZone({
  label, previewSrc, previewClass = 'w-10 h-10 rounded-lg',
  onUpload,
}: {
  label: string;
  previewSrc?: string;
  previewClass?: string;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex items-center gap-3 p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer group">
      {previewSrc ? (
        <img src={previewSrc} alt="preview" className={`${previewClass} object-cover border border-slate-200 shadow-sm group-hover:border-indigo-200 transition-colors`} />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-indigo-200 transition-colors">
          <ImageIcon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">{label}</p>
        <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
      </div>
      <Upload className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors shrink-0" />
      <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
    </label>
  );
}

function SectionHeader({
  icon: Icon, title, open, onToggle,
}: {
  icon: any; title: string; open: boolean; onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-2.5 px-1 group"
    >
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-indigo-50 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{title}</span>
      </div>
      {open
        ? <ChevronUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        : <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />}
    </button>
  );
}

const Detail = ({ label, value }: { label: string; value: string }) => (
  <div className="overflow-hidden">
    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">{label}</p>
    <p className="text-xs font-bold text-slate-700 break-words whitespace-normal">{value}</p>
  </div>
);

// --- Main App ---

export default function App() {
  const [data, setData] = useState<StudentData>(DEFAULT_DATA);
  const [showBack, setShowBack] = useState(false);
  const [openSections, setOpenSections] = useState({
    design: true,
    institution: true,
    student: false,
    contact: false,
  });
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const toggle = (key: keyof typeof openSections) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (field: 'logoUrl' | 'photoUrl' | 'signatureUrl') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => setData((prev) => ({ ...prev, [field]: reader.result as string }));
      reader.readAsDataURL(file);
    };

  const downloadCard = async () => {
    if (!frontRef.current || !backRef.current) return;
    try {
      const opts = { pixelRatio: 2, backgroundColor: 'transparent' };
      const urlFront = await toPng(frontRef.current, opts);
      const linkFront = document.createElement('a');
      linkFront.download = `student-card-${data.idNumber}-front.png`;
      linkFront.href = urlFront;
      linkFront.click();
      setTimeout(async () => {
        const urlBack = await toPng(backRef.current!, opts);
        const linkBack = document.createElement('a');
        linkBack.download = `student-card-${data.idNumber}-back.png`;
        linkBack.href = urlBack;
        linkBack.click();
      }, 500);
    } catch (err) {
      console.error('Error generating card:', err);
      alert('Failed to download card images.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col lg:flex-row overflow-hidden" style={{ height: '100vh' }}>

      {/* ── Left Sidebar ── */}
      <aside className="w-full lg:w-[360px] xl:w-[400px] shrink-0 bg-white border-r border-slate-100 flex flex-col shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
              <LayoutTemplate className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">{APP_NAME}</h1>
              <p className="text-[10px] text-slate-400 font-medium">Design your student card</p>
            </div>
          </div>
        </div>

        {/* Scrollable form */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-0.5 custom-scrollbar">

          {/* Design section */}
          <div>
            <SectionHeader icon={Palette} title="Design" open={openSections.design} onToggle={() => toggle('design')} />
            {openSections.design && (
              <div className="pb-4 space-y-4">
                {/* Template */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Template</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['modern', 'classic', 'minimal'] as TemplateType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setData((prev) => ({ ...prev, template: t }))}
                        className={`py-2 text-xs font-bold rounded-lg capitalize transition-all ${
                          data.template === t
                            ? 'text-white shadow-md shadow-indigo-200'
                            : 'bg-slate-50 border border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                        style={data.template === t ? { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' } : {}}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Color */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3 h-3" /> Theme Color
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {THEME_COLORS.map((c) => (
                      <button
                        key={c.hex}
                        title={c.name}
                        onClick={() => setData((prev) => ({ ...prev, themeColor: c.hex }))}
                        className={`w-7 h-7 rounded-full transition-all ${
                          data.themeColor === c.hex
                            ? 'ring-2 ring-offset-2 ring-slate-400 scale-110'
                            : 'hover:scale-110'
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

          {/* Institution section */}
          <div>
            <SectionHeader icon={Building} title="Institution Details" open={openSections.institution} onToggle={() => toggle('institution')} />
            {openSections.institution && (
              <div className="pb-4 space-y-3">
                <FieldInput label="School / University Name" name="schoolName" value={data.schoolName} onChange={handleChange} />
                <FieldInput label="School Address" name="schoolAddress" value={data.schoolAddress} onChange={handleChange} type="textarea" />
                <UploadZone
                  label="School Logo"
                  previewSrc={data.logoUrl}
                  previewClass="w-10 h-10 rounded-lg"
                  onUpload={handleImageUpload('logoUrl')}
                />
                <UploadZone
                  label="Authorized Signature"
                  previewSrc={data.signatureUrl}
                  previewClass="h-10 w-auto max-w-[80px] rounded-lg bg-white px-1"
                  onUpload={handleImageUpload('signatureUrl')}
                />
              </div>
            )}
            <div className="border-b border-slate-100" />
          </div>

          {/* Student section */}
          <div>
            <SectionHeader icon={User} title="Student Details" open={openSections.student} onToggle={() => toggle('student')} />
            {openSections.student && (
              <div className="pb-4 space-y-3">
                <FieldInput label="Full Name" name="studentName" value={data.studentName} onChange={handleChange} />
                <FieldInput label="Program / Course" name="program" value={data.program} onChange={handleChange} />
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput label="ID Number" name="idNumber" value={data.idNumber} onChange={handleChange} />
                  <FieldInput label="Blood Group" name="bloodGroup" value={data.bloodGroup} onChange={handleChange} />
                </div>
                <FieldInput label="Date of Birth" name="dob" type="date" value={data.dob} onChange={handleChange} />
                <UploadZone
                  label="Student Photo"
                  previewSrc={data.photoUrl}
                  previewClass="w-10 h-14 rounded-lg"
                  onUpload={handleImageUpload('photoUrl')}
                />
              </div>
            )}
            <div className="border-b border-slate-100" />
          </div>

          {/* Contact section */}
          <div>
            <SectionHeader icon={Phone} title="Contact & Validity" open={openSections.contact} onToggle={() => toggle('contact')} />
            {openSections.contact && (
              <div className="pb-4 space-y-3">
                <FieldInput label="Emergency Contact" name="emergencyContact" value={data.emergencyContact} onChange={handleChange} />
                <FieldInput label="Residential Address" name="address" value={data.address} onChange={handleChange} type="textarea" />
                <div className="grid grid-cols-2 gap-3">
                  <FieldInput label="Issue Date" name="issueDate" type="date" value={data.issueDate} onChange={handleChange} />
                  <FieldInput label="Expiry Date" name="expiryDate" type="date" value={data.expiryDate} onChange={handleChange} />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Download footer */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <button
            onClick={downloadCard}
            className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 8px 24px -8px rgba(99,102,241,0.5)',
            }}
          >
            <Download className="w-4 h-4" /> Download Both Sides
          </button>
          <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">Exports as high-res PNG · 2× quality</p>
        </div>
      </aside>

      {/* ── Preview Panel ── */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-slate-100">

        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-50"
          style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '22px 22px' }}
        />

        {/* Toolbar */}
        <div className="relative z-10 flex items-center gap-2 mb-6">
          <div className="bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200 flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preview</span>
            <div className="w-px h-4 bg-slate-200" />
            <button
              onClick={() => setShowBack(false)}
              className="text-xs font-bold px-2.5 py-1 rounded-lg transition-all"
              style={!showBack ? { backgroundColor: data.themeColor, color: '#fff' } : { color: '#64748b' }}
            >
              Front
            </button>
            <button
              onClick={() => setShowBack(true)}
              className="text-xs font-bold px-2.5 py-1 rounded-lg transition-all"
              style={showBack ? { backgroundColor: data.themeColor, color: '#fff' } : { color: '#64748b' }}
            >
              Back
            </button>
            <div className="w-px h-4 bg-slate-200" />
            <button
              onClick={() => setShowBack((v) => !v)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              title="Flip card"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Cards row */}
        <div className="relative z-10 flex flex-col sm:flex-row gap-6 md:gap-10 items-center justify-center w-full px-6">

          {/* Front */}
          <div className={`flex flex-col items-center gap-3 transition-all duration-300 ${showBack ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">Front</span>
            <div
              ref={frontRef}
              className="bg-white rounded-xl overflow-hidden w-[270px] sm:w-[310px] h-[420px] sm:h-[480px] relative shrink-0"
              style={{ boxShadow: showBack ? '0 8px 30px -8px rgba(0,0,0,0.12)' : '0 24px 50px -12px rgba(0,0,0,0.18)' }}
            >
              <CardFront data={data} />
            </div>
          </div>

          {/* Back */}
          <div className={`flex flex-col items-center gap-3 transition-all duration-300 ${!showBack ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`}>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">Back</span>
            <div
              ref={backRef}
              className="bg-white rounded-xl overflow-hidden w-[270px] sm:w-[310px] h-[420px] sm:h-[480px] relative shrink-0"
              style={{ boxShadow: !showBack ? '0 8px 30px -8px rgba(0,0,0,0.12)' : '0 24px 50px -12px rgba(0,0,0,0.18)' }}
            >
              <CardBack data={data} />
            </div>
          </div>

        </div>

        {/* Status bar */}
        <div className="relative z-10 mt-8 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-xs font-medium text-slate-600">Card ready to download</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

      </main>
    </div>
  );
}

// --- Dispatchers ---

function CardFront({ data }: { data: StudentData }) {
  switch (data.template) {
    case 'modern': return <ModernFront data={data} />;
    case 'classic': return <ClassicFront data={data} />;
    case 'minimal': return <MinimalFront data={data} />;
    default: return <ModernFront data={data} />;
  }
}

function CardBack({ data }: { data: StudentData }) {
  switch (data.template) {
    case 'modern': return <ModernBack data={data} />;
    case 'classic': return <ClassicBack data={data} />;
    case 'minimal': return <MinimalBack data={data} />;
    default: return <ModernBack data={data} />;
  }
}

// ─────────────────────────────────────────
// Modern Template
// ─────────────────────────────────────────

function ModernFront({ data }: { data: StudentData }) {
  const hex = data.themeColor;
  return (
    <div className="w-full h-full flex flex-col bg-white relative overflow-hidden">

      {/* Header background with decorative circles */}
      <div className="absolute top-0 left-0 right-0 h-[175px]" style={{ background: `linear-gradient(135deg, ${hex}ee, ${hex}bb)` }}>
        {/* decorative rings */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full opacity-20 border-[20px] border-white" />
        <div className="absolute top-4 -right-4 w-20 h-20 rounded-full opacity-10 border-[12px] border-white" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-10 border-[16px] border-white" />
        {/* wave divider */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 400 28" preserveAspectRatio="none" style={{ height: 28 }}>
          <path d="M0,0 C100,28 300,28 400,0 L400,28 L0,28 Z" fill="white" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center h-full">

        {/* Logo + School name */}
        <div className="flex items-center gap-2 pt-4 px-5 w-full justify-center">
          <img src={data.logoUrl} crossOrigin="anonymous" alt="Logo" className="w-6 h-6 rounded-md object-contain bg-white/20 p-0.5" />
          <p className="text-white text-[10px] font-bold uppercase tracking-widest leading-tight text-center drop-shadow-sm">
            {data.schoolName}
          </p>
        </div>

        {/* "STUDENT ID CARD" badge */}
        <div className="mt-1 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
          <p className="text-white text-[8px] font-black uppercase tracking-[0.2em]">Student ID Card</p>
        </div>

        {/* Photo */}
        <div className="mt-3 relative">
          <div className="w-[84px] h-[84px] rounded-full p-1 bg-white shadow-xl">
            <img
              src={data.photoUrl} crossOrigin="anonymous" alt="Student"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div
            className="absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-md"
            style={{ backgroundColor: hex }}
          >
            <div className="w-2 h-2 rounded-full bg-white/80" />
          </div>
        </div>

        {/* Name & program */}
        <div className="mt-3 text-center px-4">
          <h1 className="text-[17px] font-black text-slate-900 tracking-tight leading-none">{data.studentName}</h1>
          <p className="text-[10px] font-bold mt-1 uppercase tracking-wider" style={{ color: hex }}>{data.program}</p>
        </div>

        {/* Divider */}
        <div className="w-8 h-0.5 rounded-full mt-3 mx-auto" style={{ backgroundColor: hex }} />

        {/* Info grid */}
        <div className="w-full px-4 mt-3 grid grid-cols-2 gap-1.5">
          {[
            { label: 'ID Number', value: data.idNumber },
            { label: 'Date of Birth', value: data.dob },
            { label: 'Blood Group', value: data.bloodGroup },
            { label: 'Issue Date', value: data.issueDate },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl p-2.5 border" style={{ backgroundColor: `${hex}08`, borderColor: `${hex}20` }}>
              <p className="text-[8px] font-black uppercase tracking-wider mb-0.5" style={{ color: `${hex}99` }}>{label}</p>
              <p className="text-[10px] font-black text-slate-800 truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* Validity strip */}
        <div className="mt-auto mb-4 w-full px-4 flex items-center justify-between">
          <div className="h-px flex-1 bg-slate-100" />
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2">Valid thru {data.expiryDate}</p>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

function ModernBack({ data }: { data: StudentData }) {
  const hex = data.themeColor;
  return (
    <div className="w-full h-full flex flex-col bg-white relative overflow-hidden">

      {/* Top accent bar */}
      <div className="h-2.5 w-full" style={{ background: `linear-gradient(90deg, ${hex}, ${hex}88)` }} />

      {/* Decorative background circle */}
      <div className="absolute bottom-0 right-0 w-48 h-48 rounded-full opacity-5" style={{ backgroundColor: hex, transform: 'translate(30%, 30%)' }} />

      <div className="flex-1 flex flex-col p-5 pt-4">

        {/* School header */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <img src={data.logoUrl} crossOrigin="anonymous" alt="Logo" className="w-7 h-7 object-contain rounded-lg border border-slate-100 p-0.5" />
          <div>
            <p className="text-[9px] font-black text-slate-800 uppercase tracking-wide leading-tight">{data.schoolName}</p>
            <p className="text-[7px] text-slate-400 font-medium mt-0.5">{data.schoolAddress}</p>
          </div>
        </div>

        {/* Info rows */}
        <div className="mt-4 space-y-2.5 flex-1">
          <InfoRow hex={hex} label="Emergency Contact" value={data.emergencyContact} />
          <InfoRow hex={hex} label="Residential Address" value={data.address} />
          <div className="mt-3 rounded-xl p-3 border border-dashed border-slate-200 bg-slate-50">
            <p className="text-[7.5px] text-slate-500 leading-relaxed text-center">
              This card is the property of <span className="font-black text-slate-700">{data.schoolName}</span>. If found, please return to the address above.
            </p>
          </div>
        </div>

        {/* Footer: signature + barcode + validity */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-end justify-between gap-3">
            <div className="flex flex-col w-28">
              {data.signatureUrl && (
                <img src={data.signatureUrl} crossOrigin="anonymous" alt="Signature" className="h-7 object-contain mb-1 self-start" />
              )}
              <div className="border-t border-slate-300 pt-1">
                <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Auth. Signature</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Barcode value={data.idNumber || '000000'} height={24} width={1.1} displayValue={false} margin={0} background="transparent" lineColor="#1e293b" />
              <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">Valid until {data.expiryDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ hex, label, value }: { hex: string; label: string; value: string }) {
  return (
    <div className="flex gap-2.5 items-start">
      <div className="w-1 h-full min-h-[32px] rounded-full shrink-0 mt-0.5" style={{ backgroundColor: `${hex}50` }} />
      <div>
        <p className="text-[8px] font-black uppercase tracking-wider mb-0.5" style={{ color: `${hex}aa` }}>{label}</p>
        <p className="text-[10px] font-bold text-slate-800 leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Classic Template
// ─────────────────────────────────────────

function ClassicFront({ data }: { data: StudentData }) {
  const hex = data.themeColor;
  return (
    <div className="w-full h-full flex flex-col bg-white relative">

      {/* Triple-stripe top */}
      <div className="flex flex-col">
        <div className="h-3" style={{ backgroundColor: hex }} />
        <div className="h-1 opacity-40" style={{ backgroundColor: hex }} />
        <div className="h-0.5 opacity-20" style={{ backgroundColor: hex }} />
      </div>

      {/* School header */}
      <div className="flex flex-col items-center pt-3 pb-2.5 px-5 border-b-2" style={{ borderColor: `${hex}30` }}>
        <div className="flex items-center gap-3">
          <img src={data.logoUrl} crossOrigin="anonymous" alt="Logo" className="w-11 h-11 object-contain rounded-xl border-2 p-0.5 bg-white shadow-sm" style={{ borderColor: `${hex}40` }} />
          <div className="text-left">
            <h2 className="font-black text-[12px] text-slate-900 uppercase tracking-wide leading-tight">{data.schoolName}</h2>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{data.schoolAddress.split(',')[1]?.trim() || data.schoolAddress}</p>
          </div>
        </div>
        {/* STUDENT IDENTITY CARD ribbon */}
        <div className="mt-2 px-4 py-0.5 rounded-sm text-white text-[8px] font-black uppercase tracking-[0.25em] shadow-sm" style={{ backgroundColor: hex }}>
          ✦ Official Student Identity Card ✦
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex gap-3 flex-1">
        {/* Photo with official border */}
        <div className="shrink-0">
          <div className="p-1 border-2 shadow-sm" style={{ borderColor: `${hex}60` }}>
            <img
              src={data.photoUrl} crossOrigin="anonymous" alt="Student"
              className="w-[85px] h-[110px] object-cover"
            />
          </div>
          <p className="text-[7px] font-black text-center text-slate-400 uppercase tracking-widest mt-1">Photo</p>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center gap-2 flex-1 overflow-hidden">
          <ClassicField label="Full Name" value={data.studentName} hex={hex} />
          <ClassicField label="Programme" value={data.program} hex={hex} />
          <ClassicField label="ID Number" value={data.idNumber} hex={hex} accent />
          <ClassicField label="Blood Group" value={data.bloodGroup} hex={hex} />
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="mx-4 mb-4 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden">
        <div className="h-0.5 w-full" style={{ backgroundColor: `${hex}50` }} />
        <div className="grid grid-cols-2 divide-x divide-slate-100">
          <div className="px-3 py-2">
            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</p>
            <p className="text-[10px] font-black text-slate-800 mt-0.5">{data.dob}</p>
          </div>
          <div className="px-3 py-2">
            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Valid Through</p>
            <p className="text-[10px] font-black mt-0.5" style={{ color: hex }}>{data.expiryDate}</p>
          </div>
        </div>
      </div>

      {/* Triple-stripe bottom */}
      <div className="flex flex-col mt-auto">
        <div className="h-0.5 opacity-20" style={{ backgroundColor: hex }} />
        <div className="h-1 opacity-40" style={{ backgroundColor: hex }} />
        <div className="h-2.5" style={{ backgroundColor: hex }} />
      </div>
    </div>
  );
}

function ClassicField({ label, value, hex, accent = false }: { label: string; value: string; hex: string; accent?: boolean }) {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-1 rounded-full h-full min-h-[28px] shrink-0 mt-0.5" style={{ backgroundColor: accent ? hex : `${hex}30` }} />
      <div className="overflow-hidden">
        <p className="text-[7.5px] font-black uppercase tracking-wider text-slate-400">{label}</p>
        <p className={`text-[10px] leading-tight truncate mt-0.5 ${accent ? 'font-black' : 'font-bold'} text-slate-800`}>{value}</p>
      </div>
    </div>
  );
}

function ClassicBack({ data }: { data: StudentData }) {
  const hex = data.themeColor;
  return (
    <div className="w-full h-full flex flex-col bg-white relative">

      {/* Triple-stripe top */}
      <div className="flex flex-col">
        <div className="h-3" style={{ backgroundColor: hex }} />
        <div className="h-1 opacity-40" style={{ backgroundColor: hex }} />
        <div className="h-0.5 opacity-20" style={{ backgroundColor: hex }} />
      </div>

      <div className="flex-1 flex flex-col p-4 gap-3">

        {/* Stamp-like title */}
        <div className="flex items-center justify-center gap-2 border border-dashed border-slate-200 rounded-lg py-2">
          <img src={data.logoUrl} crossOrigin="anonymous" alt="Logo" className="w-6 h-6 object-contain opacity-70" />
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{data.schoolName}</p>
        </div>

        {/* Emergency */}
        <div className="rounded-lg border border-slate-100 overflow-hidden">
          <div className="px-3 py-1.5 text-[7px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: hex }}>
            Emergency Contact
          </div>
          <div className="px-3 py-2">
            <p className="text-[11px] font-black text-slate-800">{data.emergencyContact}</p>
          </div>
        </div>

        {/* Address */}
        <div className="rounded-lg border border-slate-100 overflow-hidden">
          <div className="px-3 py-1.5 text-[7px] font-black uppercase tracking-widest text-white" style={{ backgroundColor: hex }}>
            Residential Address
          </div>
          <div className="px-3 py-2">
            <p className="text-[9px] font-medium text-slate-700 leading-relaxed">{data.address}</p>
          </div>
        </div>

        {/* Return to */}
        <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 text-center">
          <p className="text-[7px] font-black uppercase tracking-widest text-slate-400 mb-1">If found, please return to:</p>
          <p className="text-[9px] font-bold text-slate-700 leading-snug">{data.schoolAddress}</p>
        </div>

        {/* Signature + barcode */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex flex-col w-28">
            {data.signatureUrl && (
              <img src={data.signatureUrl} crossOrigin="anonymous" alt="Signature" className="h-8 object-contain mb-1 self-start" />
            )}
            <div className="border-t-2 pt-1" style={{ borderColor: hex }}>
              <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest">Authorized Signature</p>
            </div>
          </div>
          <Barcode value={data.idNumber || '000000'} height={28} width={1.3} fontSize={8} background="transparent" lineColor="#0f172a" />
        </div>
      </div>

      {/* Triple-stripe bottom */}
      <div className="flex flex-col mt-auto">
        <div className="h-0.5 opacity-20" style={{ backgroundColor: hex }} />
        <div className="h-1 opacity-40" style={{ backgroundColor: hex }} />
        <div className="h-2.5" style={{ backgroundColor: hex }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Minimal Template
// ─────────────────────────────────────────

function MinimalFront({ data }: { data: StudentData }) {
  const hex = data.themeColor;
  return (
    <div className="w-full h-full flex flex-col bg-white relative overflow-hidden">

      {/* Thick left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[6px]" style={{ background: `linear-gradient(180deg, ${hex}, ${hex}66)` }} />

      {/* Subtle diagonal watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, ${hex} 0px, ${hex} 1px, transparent 1px, transparent 28px)`,
        }}
      />

      <div className="flex flex-col h-full pl-6 pr-5 pt-5 pb-5 relative z-10">

        {/* Header row: logo left, school right */}
        <div className="flex items-start justify-between mb-4">
          <img src={data.logoUrl} crossOrigin="anonymous" alt="Logo" className="w-10 h-10 object-contain rounded-xl border border-slate-100 p-0.5 shadow-sm" />
          <div className="text-right max-w-[140px]">
            <h2 className="font-black text-[11px] text-slate-900 leading-tight uppercase tracking-wide">{data.schoolName}</h2>
            <div className="flex items-center justify-end gap-1 mt-1">
              <div className="w-4 h-px" style={{ backgroundColor: hex }} />
              <p className="text-[8px] font-bold text-slate-400 tracking-widest uppercase">Student</p>
            </div>
          </div>
        </div>

        {/* Photo — full width, magazine style */}
        <div className="relative w-full mb-3 rounded-xl overflow-hidden shadow-md" style={{ height: 140 }}>
          <img src={data.photoUrl} crossOrigin="anonymous" alt="Student" className="w-full h-full object-cover object-top" />
          {/* gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-12" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />
        </div>

        {/* Name & program */}
        <h1 className="text-[22px] font-black text-slate-900 tracking-tight leading-none">{data.studentName}</h1>
        <div className="flex items-center gap-2 mt-1 mb-3">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: hex }} />
          <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: hex }}>{data.program}</p>
        </div>

        {/* Info row */}
        <div className="mt-auto grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-slate-100 pt-3">
          {[
            { label: 'ID No.', value: data.idNumber },
            { label: 'DOB', value: data.dob },
            { label: 'Blood', value: data.bloodGroup },
            { label: 'Expires', value: data.expiryDate },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
              <p className="text-[10px] font-black text-slate-800 mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MinimalBack({ data }: { data: StudentData }) {
  const hex = data.themeColor;
  return (
    <div className="w-full h-full flex flex-col bg-white relative overflow-hidden">

      {/* Thick left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-[6px]" style={{ background: `linear-gradient(180deg, ${hex}, ${hex}66)` }} />

      {/* Subtle diagonal watermark */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, ${hex} 0px, ${hex} 1px, transparent 1px, transparent 28px)`,
        }}
      />

      <div className="flex flex-col h-full pl-6 pr-5 pt-5 pb-5 relative z-10">

        {/* Monogram / school stamp */}
        <div className="flex items-center gap-2 mb-5">
          <img src={data.logoUrl} crossOrigin="anonymous" alt="Logo" className="w-7 h-7 object-contain opacity-60" />
          <div className="h-px flex-1 bg-slate-100" />
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">ID Back</p>
        </div>

        {/* Three data blocks */}
        <div className="flex-1 flex flex-col justify-center gap-5">
          <MinimalBlock hex={hex} label="Emergency" value={data.emergencyContact} large />
          <MinimalBlock hex={hex} label="Address" value={data.address} />
          <MinimalBlock hex={hex} label="Return To" value={data.schoolAddress} />
        </div>

        {/* Footer */}
        <div className="mt-auto border-t-2 border-slate-100 pt-3 flex items-end justify-between gap-3">
          <div className="flex flex-col w-24">
            {data.signatureUrl && (
              <img src={data.signatureUrl} crossOrigin="anonymous" alt="Signature" className="h-7 object-contain mb-1 self-start opacity-90" />
            )}
            <div className="border-t border-slate-300 pt-1">
              <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Signature</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <Barcode value={data.idNumber || '000000'} height={26} width={1.1} displayValue={false} margin={0} background="transparent" lineColor="#0f172a" />
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-1">Valid until {data.expiryDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MinimalBlock({ hex, label, value, large = false }: { hex: string; label: string; value: string; large?: boolean }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-px h-full min-h-[24px] rounded-full shrink-0" style={{ backgroundColor: `${hex}60` }} />
      <div>
        <p className="text-[7.5px] font-black uppercase tracking-widest mb-0.5" style={{ color: `${hex}99` }}>{label}</p>
        <p className={`font-black text-slate-800 leading-tight ${large ? 'text-[12px]' : 'text-[9px]'}`}>{value}</p>
      </div>
    </div>
  );
}
