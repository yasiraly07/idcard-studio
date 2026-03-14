import React, { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import Barcode from 'react-barcode';
import { Upload, Download, Image as ImageIcon, LayoutTemplate, Palette, User, Building, Phone } from 'lucide-react';

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
  themeColor: '#3b82f6',
};

const Input = ({ label, type = "text", ...props }: any) => (
  <div className={props.className}>
    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>
    {type === 'textarea' ? (
      <textarea 
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm resize-none" 
        rows={3}
        {...props} 
      />
    ) : (
      <input 
        type={type}
        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm" 
        {...props} 
      />
    )}
  </div>
);

const Section = ({ title, icon: Icon, children }: any) => (
  <div className="mb-8">
    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
      <Icon className="w-4 h-4 text-indigo-500" /> {title}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

const Detail = ({ label, value }: { label: string, value: string }) => (
  <div className="overflow-hidden">
    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">{label}</p>
    <p className="text-xs font-bold text-slate-700 truncate">{value}</p>
  </div>
);

export default function App() {
  const [data, setData] = useState<StudentData>(DEFAULT_DATA);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'photoUrl' | 'signatureUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData((prev) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadCard = async () => {
    if (!frontRef.current || !backRef.current) return;
    
    try {
      const opts = { pixelRatio: 2, backgroundColor: 'transparent' };
      
      const dataUrlFront = await toPng(frontRef.current, opts);
      const linkFront = document.createElement('a');
      linkFront.download = `student-card-${data.idNumber}-front.png`;
      linkFront.href = dataUrlFront;
      linkFront.click();

      setTimeout(async () => {
        const dataUrlBack = await toPng(backRef.current!, opts);
        const linkBack = document.createElement('a');
        linkBack.download = `student-card-${data.idNumber}-back.png`;
        linkBack.href = dataUrlBack;
        linkBack.click();
      }, 500);
      
    } catch (error) {
      console.error('Error generating card image:', error);
      alert('Failed to download the card images.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-3 md:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Left Panel: Form */}
      <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-2rem)] lg:max-h-[calc(100vh-3rem)] custom-scrollbar">
        <h1 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-800">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <LayoutTemplate className="w-6 h-6 text-indigo-600" />
          </div>
          {APP_NAME}
        </h1>

        <div className="space-y-8">
          {/* Design Section */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Design Template</label>
              <div className="grid grid-cols-3 gap-2">
                {(['modern', 'classic', 'minimal'] as TemplateType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setData((prev) => ({ ...prev, template: t }))}
                    className={`py-2 px-2 text-xs font-bold rounded-lg capitalize border transition-all ${
                      data.template === t
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" /> Theme Color
              </label>
              <div className="flex flex-wrap gap-3">
                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#1e293b', '#0ea5e9', '#d946ef'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setData((prev) => ({ ...prev, themeColor: color }))}
                    className={`w-8 h-8 rounded-full border-2 transition-transform shadow-sm ${
                      data.themeColor === color ? 'scale-125 border-slate-900' : 'border-transparent hover:scale-110'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <Section title="Institution Details" icon={Building}>
            <Input label="School/University Name" name="schoolName" value={data.schoolName} onChange={handleInputChange} className="sm:col-span-2" />
            <Input label="School Address" name="schoolAddress" value={data.schoolAddress} onChange={handleInputChange} type="textarea" className="sm:col-span-2" />
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" /> School Logo
              </label>
              <div className="flex items-center gap-4">
                <img src={data.logoUrl} alt="Logo" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-sm" />
                <label className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" /> Upload Logo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'logoUrl')} />
                </label>
              </div>
            </div>
            <div className="sm:col-span-2 mt-2">
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" /> Authorized Signature
              </label>
              <div className="flex items-center gap-4">
                {data.signatureUrl ? (
                  <img src={data.signatureUrl} alt="Signature" className="h-12 w-auto object-contain border border-slate-200 rounded-lg shadow-sm bg-white px-2" />
                ) : (
                  <div className="h-12 w-24 border border-dashed border-slate-300 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] text-slate-400">No Sig</div>
                )}
                <label className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" /> Upload Signature
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'signatureUrl')} />
                </label>
              </div>
            </div>
          </Section>

          <Section title="Student Details" icon={User}>
            <Input label="Full Name" name="studentName" value={data.studentName} onChange={handleInputChange} className="sm:col-span-2" />
            <Input label="Program/Course" name="program" value={data.program} onChange={handleInputChange} className="sm:col-span-2" />
            <Input label="ID Number" name="idNumber" value={data.idNumber} onChange={handleInputChange} />
            <Input label="Date of Birth" name="dob" type="date" value={data.dob} onChange={handleInputChange} />
            <Input label="Blood Group" name="bloodGroup" value={data.bloodGroup} onChange={handleInputChange} />
            <div className="sm:col-span-2 mt-2">
              <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" /> Student Photo
              </label>
              <div className="flex items-center gap-4">
                <img src={data.photoUrl} alt="Photo" className="w-12 h-16 rounded-lg object-cover border border-slate-200 shadow-sm" />
                <label className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" /> Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'photoUrl')} />
                </label>
              </div>
            </div>
          </Section>

          <Section title="Contact & Validity" icon={Phone}>
            <Input label="Emergency Contact" name="emergencyContact" value={data.emergencyContact} onChange={handleInputChange} className="sm:col-span-2" />
            <Input label="Residential Address" name="address" value={data.address} onChange={handleInputChange} type="textarea" className="sm:col-span-2" />
            <Input label="Issue Date" name="issueDate" type="date" value={data.issueDate} onChange={handleInputChange} />
            <Input label="Expiry Date" name="expiryDate" type="date" value={data.expiryDate} onChange={handleInputChange} />
          </Section>
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="flex-1 flex flex-col items-center bg-slate-100 rounded-2xl border border-slate-200 p-4 md:p-6 lg:p-10 relative overflow-y-auto max-h-[calc(100vh-2rem)] lg:max-h-[calc(100vh-3rem)] custom-scrollbar">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="relative z-10 flex flex-col items-center gap-6 md:gap-10 w-full">
          <div className="flex flex-col sm:flex-row gap-6 md:gap-10 items-center justify-center w-full">
            {/* Front Card */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full shadow-sm">Front Side</span>
              <div 
                ref={frontRef}
                className="bg-white rounded-xl overflow-hidden w-[280px] sm:w-[320px] h-[440px] sm:h-[500px] relative flex flex-col shrink-0"
                style={{ boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }}
              >
                <CardFront data={data} />
              </div>
            </div>

            {/* Back Card */}
            <div className="flex flex-col items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white px-4 py-1.5 rounded-full shadow-sm">Back Side</span>
              <div 
                ref={backRef}
                className="bg-white rounded-xl overflow-hidden w-[280px] sm:w-[320px] h-[440px] sm:h-[500px] relative flex flex-col shrink-0"
                style={{ boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }}
              >
                <CardBack data={data} />
              </div>
            </div>
          </div>

          <button
            onClick={downloadCard}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-indigo-200 transition-all flex items-center gap-3"
          >
            <Download className="w-5 h-5" /> Download Both Sides
          </button>
        </div>
      </div>
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

// --- Modern Template ---

function ModernFront({ data }: { data: StudentData }) {
  return (
    <div className="w-full h-full flex flex-col bg-white relative">
      <div className="absolute top-0 w-full h-28 sm:h-36 rounded-b-[3rem] z-0" style={{ backgroundColor: data.themeColor }}>
      </div>
      <div className="relative z-10 flex flex-col items-center pt-4 sm:pt-6 px-4 sm:px-6 h-full">
        <h2 className="text-white font-bold text-center text-[11px] sm:text-[13px] tracking-wide uppercase leading-tight mb-3 sm:mb-4 drop-shadow-md">{data.schoolName}</h2>
        <div className="relative">
          <img src={data.photoUrl} className="w-20 sm:w-28 h-20 sm:h-28 rounded-full border-[4px] sm:border-[5px] border-white shadow-lg object-cover bg-white" crossOrigin="anonymous" alt="Student" />
          <div className="absolute bottom-0.5 sm:bottom-1 right-0.5 sm:right-1 w-5 sm:w-6 h-5 sm:h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: data.themeColor }}></div>
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
      <div className="absolute top-0 left-0 w-full h-2.5 sm:h-3" style={{ backgroundColor: data.themeColor }}></div>
      
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
            {data.signatureUrl && <img src={data.signatureUrl} className="h-6 sm:h-8 object-contain mb-1" crossOrigin="anonymous" alt="Signature" />}
            <div className="w-full border-t border-slate-300 pt-1 text-center">
              <p className="text-[6px] sm:text-[7px] font-bold text-slate-400 uppercase tracking-widest">Auth. Signature</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <Barcode value={data.idNumber || '000000'} height={22} sm:height={25} width={1.1} sm:width={1.2} displayValue={false} margin={0} background="transparent" lineColor="#1e293b" />
          </div>
        </div>
        <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-wider">Valid until: {data.expiryDate}</p>
      </div>
    </div>
  );
}

// --- Classic Template ---

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
              <div className="h-8 sm:h-10 mb-1"></div>
            )}
            <div className="w-full border-t-2 border-slate-800 pt-1 text-center">
              <p className="text-[7px] sm:text-[8px] font-bold text-slate-500 uppercase tracking-widest">Authorized Signature</p>
            </div>
          </div>
          <Barcode value={data.idNumber || '000000'} height={25} sm:height={30} width={1.3} sm:width={1.4} fontSize={9} sm:fontSize={10} background="transparent" lineColor="#0f172a" />
        </div>
      </div>
    </div>
  );
}

// --- Minimal Template ---

function MinimalFront({ data }: { data: StudentData }) {
  return (
    <div className="w-full h-full flex flex-col bg-white relative p-5 sm:p-7 pl-7 sm:pl-9">
      <div className="absolute left-0 top-0 bottom-0 w-3.5 sm:w-4" style={{ backgroundColor: data.themeColor }}></div>
      
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
      <div className="absolute left-0 top-0 bottom-0 w-3.5 sm:w-4" style={{ backgroundColor: data.themeColor }}></div>
      
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
            <div className="h-6 sm:h-8 mb-1"></div>
          )}
          <div className="border-t-2 border-slate-300 pt-1">
            <p className="text-[7px] sm:text-[8px] text-slate-400 uppercase font-black tracking-widest">Signature</p>
          </div>
        </div>
        <div className="transform origin-bottom-right scale-65 sm:scale-75">
          <Barcode value={data.idNumber || '000000'} height={30} sm:height={35} width={1.1} sm:width={1.2} displayValue={false} margin={0} background="transparent" lineColor="#0f172a" />
        </div>
      </div>
    </div>
  );
}
