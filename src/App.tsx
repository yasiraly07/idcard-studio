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
  return (
    <div className="w-full h-full flex flex-col bg-white relative">
      <div className="absolute top-0 w-full h-28 sm:h-36 rounded-b-[3rem] z-0" style={{ backgroundColor: data.themeColor }} />
      <div className="relative z-10 flex flex-col items-center pt-4 sm:pt-6 px-4 sm:px-6 h-full">
        <h2 className="text-white font-bold text-center text-[11px] sm:text-[13px] tracking-wide uppercase leading-tight mb-3 sm:mb-4 drop-shadow-md">
          {data.schoolName}
        </h2>
        <div className="relative">
          <img
            src={data.photoUrl}
            className="w-20 sm:w-28 h-20 sm:h-28 rounded-full border-[4px] sm:border-[5px] border-white shadow-lg object-cover bg-white"
            crossOrigin="anonymous" alt="Student"
          />
          <div className="absolute bottom-0.5 sm:bottom-1 right-0.5 sm:right-1 w-5 sm:w-6 h-5 sm:h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: data.themeColor }} />
        </div>
        <div className="mt-4 sm:mt-5 text-center w-full">
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight tracking-tight">{data.studentName}</h1>
          <p className="text-[10px] sm:text-xs font-bold mt-1" style={{ color: data.themeColor }}>{data.program}</p>
        </div>
        <div className="w-full mt-auto mb-4 sm:mb-6 grid grid-cols-2 gap-y-3 sm:gap-y-4 gap-x-2 sm:gap-x-3 text-left bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm">
          <Detail label="ID Number" value={data.idNumber} />
          <Detail label="D.O.B" value={data.dob} />
          <Detail label="Blood Group" value={data.bloodGroup} />
          <Detail label="Issued" value={data.issueDate} />
        </div>
      </div>
    </div>
  );
}

function ModernBack({ data }: { data: StudentData }) {
  return (
    <div className="w-full h-full flex flex-col bg-white relative p-4 sm:p-6 text-center">
      <div className="absolute top-0 left-0 w-full h-2.5 sm:h-3" style={{ backgroundColor: data.themeColor }} />
      <div className="flex-grow flex flex-col items-center justify-center space-y-4 sm:space-y-6 mt-3 sm:mt-4">
        <div className="w-full bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
          <h3 className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Emergency Contact</h3>
          <p className="text-xs sm:text-sm font-bold text-slate-800">{data.emergencyContact}</p>
        </div>
        <div className="w-full bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
          <h3 className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Residential Address</h3>
          <p className="text-[10px] sm:text-xs font-medium text-slate-700 leading-relaxed">{data.address}</p>
        </div>
        <div className="w-full px-1 sm:px-2">
          <p className="text-[8px] sm:text-[9px] text-slate-500 leading-relaxed">
            This card is the property of <strong className="text-slate-700">{data.schoolName}</strong>. If found, please return to:
          </p>
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-700 mt-1">{data.schoolAddress}</p>
        </div>
      </div>
      <div className="mt-auto flex flex-col items-center pt-3 sm:pt-4 border-t border-slate-100">
        <div className="flex justify-between w-full items-end mb-3 sm:mb-4 px-2 sm:px-4 gap-4">
          <div className="flex flex-col items-center w-20 sm:w-24">
            {data.signatureUrl && (
              <img src={data.signatureUrl} className="h-6 sm:h-8 object-contain mb-1" crossOrigin="anonymous" alt="Signature" />
            )}
            <div className="w-full border-t border-slate-300 pt-1 text-center">
              <p className="text-[6px] sm:text-[7px] font-bold text-slate-400 uppercase tracking-widest">Auth. Signature</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <Barcode value={data.idNumber || '000000'} height={22} width={1.1} displayValue={false} margin={0} background="transparent" lineColor="#1e293b" />
          </div>
        </div>
        <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider">Valid until: {data.expiryDate}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Classic Template
// ─────────────────────────────────────────

function ClassicFront({ data }: { data: StudentData }) {
  return (
    <div className="w-full h-full flex flex-col bg-white border-[6px] sm:border-[8px]" style={{ borderColor: data.themeColor }}>
      <div className="flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-5 border-b-2" style={{ borderColor: data.themeColor }}>
        <img src={data.logoUrl} className="w-8 sm:w-10 h-8 sm:h-10 object-contain" crossOrigin="anonymous" alt="Logo" />
        <h2 className="font-serif font-bold text-[11px] sm:text-sm leading-tight text-slate-900 uppercase tracking-wide text-center">{data.schoolName}</h2>
      </div>
      <div className="py-1 sm:py-1.5 text-center text-white text-[9px] sm:text-[10px] font-bold tracking-widest uppercase shadow-sm" style={{ backgroundColor: data.themeColor }}>
        Student Identity Card
      </div>
      <div className="p-3 sm:p-5 flex flex-col h-full">
        <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-5">
          <img src={data.photoUrl} className="w-[80px] sm:w-[100px] h-[100px] sm:h-[130px] object-cover border-2 border-slate-200 shadow-sm p-1 bg-white" crossOrigin="anonymous" alt="Student" />
          <div className="flex flex-col justify-center space-y-2 sm:space-y-3 flex-1 overflow-hidden">
            <Detail label="Name" value={data.studentName} />
            <Detail label="Program" value={data.program} />
            <Detail label="ID Number" value={data.idNumber} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-auto bg-slate-50 p-3 sm:p-4 border border-slate-200 rounded-lg">
          <Detail label="D.O.B" value={data.dob} />
          <Detail label="Blood Group" value={data.bloodGroup} />
          <Detail label="Issue Date" value={data.issueDate} />
          <Detail label="Valid Thru" value={data.expiryDate} />
        </div>
      </div>
    </div>
  );
}

function ClassicBack({ data }: { data: StudentData }) {
  return (
    <div className="w-full h-full flex flex-col bg-white border-[6px] sm:border-[8px] p-4 sm:p-6" style={{ borderColor: data.themeColor }}>
      <div className="flex-grow flex flex-col space-y-4 sm:space-y-6 mt-2">
        <div className="text-center">
          <h3 className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200 pb-1.5 mb-2 tracking-wider">Emergency Contact</h3>
          <p className="text-xs sm:text-sm font-black text-slate-800">{data.emergencyContact}</p>
        </div>
        <div className="text-center">
          <h3 className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase border-b border-slate-200 pb-1.5 mb-2 tracking-wider">Residential Address</h3>
          <p className="text-[10px] sm:text-xs font-medium text-slate-700 leading-relaxed px-1 sm:px-2">{data.address}</p>
        </div>
        <div className="text-center mt-3 sm:mt-4 bg-slate-50 p-2 sm:p-3 rounded-lg border border-slate-100">
          <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">If found, please return to:</p>
          <p className="text-[9px] sm:text-[10px] font-bold text-slate-800 leading-relaxed">{data.schoolAddress}</p>
        </div>
      </div>
      <div className="mt-auto flex flex-col items-center pt-3 sm:pt-4">
        <div className="w-full flex justify-between items-center mb-3 sm:mb-5 gap-4">
          <div className="w-32 sm:w-40 flex flex-col items-center">
            {data.signatureUrl ? (
              <img src={data.signatureUrl} className="h-8 sm:h-10 object-contain mb-1" crossOrigin="anonymous" alt="Signature" />
            ) : (
              <div className="h-8 sm:h-10 mb-1" />
            )}
            <div className="w-full border-t-2 border-slate-800 pt-1 text-center">
              <p className="text-[7px] sm:text-[8px] font-bold text-slate-500 uppercase tracking-widest">Authorized Signature</p>
            </div>
          </div>
          <Barcode value={data.idNumber || '000000'} height={25} width={1.3} fontSize={9} background="transparent" lineColor="#0f172a" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Minimal Template
// ─────────────────────────────────────────

function MinimalFront({ data }: { data: StudentData }) {
  return (
    <div className="w-full h-full flex flex-col bg-white relative p-5 sm:p-7 pl-7 sm:pl-9">
      <div className="absolute left-0 top-0 bottom-0 w-3.5 sm:w-4" style={{ backgroundColor: data.themeColor }} />
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <img src={data.logoUrl} className="w-10 sm:w-12 h-10 sm:h-12 object-contain grayscale opacity-90" crossOrigin="anonymous" alt="Logo" />
        <div className="text-right">
          <h2 className="font-black text-[11px] sm:text-[13px] text-slate-900 leading-tight uppercase max-w-[120px] sm:max-w-[150px]">{data.schoolName}</h2>
          <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-1">Student</p>
        </div>
      </div>
      <img src={data.photoUrl} className="w-full h-36 sm:h-44 object-cover rounded-xl sm:rounded-2xl mb-4 sm:mb-6 shadow-sm grayscale-[20%]" crossOrigin="anonymous" alt="Student" />
      <div className="flex-grow flex flex-col">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1.5 sm:mb-2">{data.studentName}</h1>
        <p className="text-[10px] sm:text-xs font-bold mb-4 sm:mb-6 uppercase tracking-wider" style={{ color: data.themeColor }}>{data.program}</p>
        <div className="grid grid-cols-2 gap-y-3 sm:gap-y-4 mt-auto">
          <Detail label="ID No." value={data.idNumber} />
          <Detail label="D.O.B" value={data.dob} />
          <Detail label="Blood" value={data.bloodGroup} />
          <Detail label="Exp." value={data.expiryDate} />
        </div>
      </div>
    </div>
  );
}

function MinimalBack({ data }: { data: StudentData }) {
  return (
    <div className="w-full h-full flex flex-col bg-white relative p-5 sm:p-7 pl-7 sm:pl-9">
      <div className="absolute left-0 top-0 bottom-0 w-3.5 sm:w-4" style={{ backgroundColor: data.themeColor }} />
      <div className="flex-grow flex flex-col justify-center space-y-6 sm:space-y-8">
        <div>
          <p className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Emergency</p>
          <p className="text-xs sm:text-sm font-black text-slate-800">{data.emergencyContact}</p>
        </div>
        <div>
          <p className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Address</p>
          <p className="text-[10px] sm:text-xs font-bold text-slate-600 leading-relaxed">{data.address}</p>
        </div>
        <div>
          <p className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Return To</p>
          <p className="text-[10px] sm:text-xs font-bold text-slate-600 leading-relaxed">{data.schoolAddress}</p>
        </div>
      </div>
      <div className="mt-auto pt-4 sm:pt-6 border-t-2 border-slate-100 flex justify-between items-end gap-4">
        <div className="w-20 sm:w-24 flex flex-col">
          {data.signatureUrl ? (
            <img src={data.signatureUrl} className="h-6 sm:h-8 object-contain mb-1 self-start" crossOrigin="anonymous" alt="Signature" />
          ) : (
            <div className="h-6 sm:h-8 mb-1" />
          )}
          <div className="border-t-2 border-slate-300 pt-1">
            <p className="text-[7px] sm:text-[8px] text-slate-400 uppercase font-black tracking-widest">Signature</p>
          </div>
        </div>
        <div className="transform scale-75 origin-bottom-right">
          <Barcode value={data.idNumber || '000000'} height={30} width={1.1} displayValue={false} margin={0} background="transparent" lineColor="#0f172a" />
        </div>
      </div>
    </div>
  );
}
