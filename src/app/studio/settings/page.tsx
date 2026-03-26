"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Sliders, Palette, Link as LinkIcon, Camera, Loader2, Save, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

const TABS = [
  { id: "profile", label: "Public Profile", icon: User },
  { id: "general", label: "Site Controls", icon: Sliders },
  { id: "appearance", label: "Branding Engine", icon: Palette },
  { id: "integrations", label: "Newsletter & API", icon: LinkIcon },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const [initialData, setInitialData] = useState({
    authorName: "Aditya",
    bio: "Visionary storyteller and builder.",
    twitter: "https://twitter.com/aditya",
    instagram: "https://instagram.com/aditya",
    portfolio: "https://aditya.dev",
    globalComments: true,
    newsletterPopup: false,
    publicSearch: true,
    primaryColor: "#990000",
    typography: "serif",
    newsletterApiKey: "sk_test_123456789",
    newsletterListId: "lst_987654321",
  });

  const [formData, setFormData] = useState(initialData);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);

  useEffect(() => {
    setIsDirty(JSON.stringify(formData) !== JSON.stringify(initialData));
  }, [formData, initialData]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!isDirty) return;
    setIsSaving(true);
    setTimeout(() => {
      setInitialData(formData);
      setIsSaving(false);
      toast.success("Site Configuration Updated", {
        icon: '⚙️',
        style: {
          borderRadius: '100px',
          background: '#333',
          color: '#fff',
        },
      });
    }, 1000);
  };

  const handleTestApi = () => {
    setIsTestingApi(true);
    setTimeout(() => {
      setIsTestingApi(false);
      if (formData.newsletterApiKey) {
        toast.success("Connection Successful!", {
          icon: '🔗',
          style: {
            borderRadius: '100px',
            background: '#10B981',
            color: '#fff',
          },
        });
      } else {
        toast.error("API Key is missing.");
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F9F9F9]">
      {/* Sticky Sub-Header */}
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-crimson/10 flex items-center justify-between px-8 shrink-0 z-20 sticky top-0 shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900 tracking-wide">Settings</h1>
          <p className="text-sm font-medium text-slate-500">Manage your sanctuary's core configuration.</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-widest uppercase transition-all flex items-center ${
            isDirty 
              ? "bg-crimson text-white shadow-[0_0_20px_rgba(153,0,0,0.4)] hover:shadow-[0_0_30px_rgba(153,0,0,0.6)] hover:bg-crimson-light hover:-translate-y-0.5" 
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isSaving ? (
            <Loader2 size={16} className="mr-2 animate-spin" />
          ) : isDirty ? (
            <Save size={16} className="mr-2" />
          ) : (
            <CheckCircle2 size={16} className="mr-2" />
          )}
          {isSaving ? "Saving..." : isDirty ? "Save Changes" : "Up to Date"}
        </button>
      </header>

      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Vertical Tabs Sidebar */}
        <aside className="w-64 shrink-0 bg-transparent border-r border-crimson/5 overflow-y-auto py-8 px-6 hidden md:block">
          <nav className="space-y-2 relative">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-colors font-bold text-sm text-left relative z-10 ${
                    isActive ? "text-crimson" : "text-slate-500 hover:bg-white hover:text-slate-800"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-crimson" : "opacity-70"} />
                  <span>{tab.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-white shadow-sm border border-crimson/10 rounded-2xl -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-crimson rounded-r-md"></div>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Scrollable Form Content */}
        <main className="flex-1 overflow-y-auto p-8 md:p-12 scroll-smooth">
          <div className="max-w-2xl">
            <AnimatePresence mode="wait">
              {/* PROFILE SETTINGS */}
              {activeTab === "profile" && (
                <SettingsSection key="profile" title="Public Profile" description="This information is displayed publicly on your author page.">
                  <div className="flex items-center space-x-6 mb-8 group cursor-pointer">
                    <div className="w-24 h-24 bg-slate-100 rounded-full border-4 border-white shadow-md flex flex-col items-center justify-center text-slate-400 group-hover:bg-crimson/5 group-hover:text-crimson transition-colors relative overflow-hidden">
                      <Camera size={24} className="mb-1" />
                      <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Upload</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1">Author Avatar</h4>
                      <p className="text-sm text-slate-500">Recommended 500x500px SVG or PNG.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <InputField label="Author Name" value={formData.authorName} onChange={(v) => handleChange("authorName", v)} />
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Author Bio</label>
                      <textarea
                        rows={4}
                        value={formData.bio}
                        onChange={(e) => handleChange("bio", e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all resize-none"
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="font-bold text-slate-800 mb-4">Social Links</h4>
                      <div className="space-y-4">
                        <InputField label="Twitter URL" value={formData.twitter} onChange={(v) => handleChange("twitter", v)} placeholder="https://twitter.com/..." />
                        <InputField label="Instagram URL" value={formData.instagram} onChange={(v) => handleChange("instagram", v)} placeholder="https://instagram.com/..." />
                        <InputField label="Personal Portfolio" value={formData.portfolio} onChange={(v) => handleChange("portfolio", v)} placeholder="https://yourwebsite.com" />
                      </div>
                    </div>
                  </div>
                </SettingsSection>
              )}

              {/* GENERAL CONTROLS */}
              {activeTab === "general" && (
                <SettingsSection key="general" title="Site Controls" description="Configure global functionality and module states.">
                  <div className="space-y-6">
                    <ToggleField 
                      label="Enable Global Comments" 
                      description="Allow authenticated users to leave comments on published stories."
                      checked={formData.globalComments}
                      onChange={(v) => handleChange("globalComments", v)}
                    />
                    <ToggleField 
                      label="Newsletter Popup" 
                      description="Show a newsletter subscription prompt to first-time unauthenticated visitors."
                      checked={formData.newsletterPopup}
                      onChange={(v) => handleChange("newsletterPopup", v)}
                    />
                    <ToggleField 
                      label="Public Search" 
                      description="Enable the top navigation search bar for anonymous visitors."
                      checked={formData.publicSearch}
                      onChange={(v) => handleChange("publicSearch", v)}
                    />
                  </div>
                </SettingsSection>
              )}

              {/* APPEARANCE */}
              {activeTab === "appearance" && (
                <SettingsSection key="appearance" title="Branding Engine" description="Tailor the visual aesthetic of the reader-facing frontend.">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Primary Accent Color</label>
                      <div className="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div 
                          className="w-12 h-12 rounded-xl shadow-inner border border-black/10 shrink-0 relative overflow-hidden flex items-center justify-center cursor-pointer"
                          style={{ backgroundColor: formData.primaryColor }}
                        >
                          <input 
                            type="color" 
                            className="absolute inset-[-10px] w-20 h-20 opacity-0 cursor-pointer"
                            value={formData.primaryColor}
                            onChange={(e) => handleChange("primaryColor", e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <input 
                            type="text" 
                            value={formData.primaryColor}
                            onChange={(e) => handleChange("primaryColor", e.target.value)}
                            className="w-full uppercase font-mono font-bold text-slate-700 bg-transparent border-none focus:ring-0 p-0 mb-1"
                          />
                          <p className="text-xs font-medium text-slate-400">Hex code for buttons, links, and accents.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">Reader Typography</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => handleChange("typography", "serif")}
                          className={`p-6 rounded-2xl border-2 text-left transition-all ${formData.typography === "serif" ? "border-crimson bg-crimson/5" : "border-slate-200 bg-white hover:border-slate-300"}`}
                        >
                          <span className="font-serif text-3xl font-bold text-slate-800 block mb-2">Ag</span>
                          <h4 className="font-bold text-slate-800">Classic Serif</h4>
                          <p className="text-xs text-slate-500 mt-1">Cormorant Garamond. Elegant, traditional storytelling.</p>
                        </button>
                        <button
                          onClick={() => handleChange("typography", "sans")}
                          className={`p-6 rounded-2xl border-2 text-left transition-all ${formData.typography === "sans" ? "border-crimson bg-crimson/5" : "border-slate-200 bg-white hover:border-slate-300"}`}
                        >
                          <span className="font-sans text-3xl font-bold text-slate-800 block mb-2">Ag</span>
                          <h4 className="font-bold text-slate-800">Modern Sans</h4>
                          <p className="text-xs text-slate-500 mt-1">Inter. Clean, contemporary digital reading.</p>
                        </button>
                      </div>
                    </div>
                  </div>
                </SettingsSection>
              )}

              {/* INTEGRATIONS */}
              {activeTab === "integrations" && (
                <SettingsSection key="integrations" title="Newsletter & API" description="Connect third-party services like ConvertKit or Mailchimp.">
                  <div className="space-y-6">
                    <InputField label="Service API Key" type="password" value={formData.newsletterApiKey} onChange={(v) => handleChange("newsletterApiKey", v)} placeholder="sk_test_..." />
                    <InputField label="Audience / List ID" value={formData.newsletterListId} onChange={(v) => handleChange("newsletterListId", v)} placeholder="e.g. lst_1928392" />
                    
                    <div className="pt-6">
                      <button 
                        onClick={handleTestApi}
                        disabled={isTestingApi || !formData.newsletterApiKey}
                        className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl text-sm hover:bg-slate-800 transition-colors flex items-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isTestingApi ? <Loader2 size={16} className="mr-2 animate-spin" /> : <LinkIcon size={16} className="mr-2" />}
                        {isTestingApi ? "Testing Connection..." : "Test Connection"}
                      </button>
                    </div>
                  </div>
                </SettingsSection>
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

// Sub-components for UI cleanliness
function SettingsSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl pb-12"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-slate-500 font-medium">{description}</p>
      </div>
      <div>{children}</div>
    </motion.section>
  );
}

function InputField({ label, value, onChange, placeholder = "", type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="space-y-2 relative">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-crimson/20 focus:border-crimson transition-all placeholder:font-medium placeholder:text-slate-300"
      />
    </div>
  );
}

function ToggleField({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-start justify-between cursor-pointer group p-5 rounded-2xl bg-white border border-slate-200 hover:border-crimson/30 transition-colors shadow-sm">
      <div className="pr-6">
        <h4 className="font-bold text-slate-800 mb-1">{label}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
      </div>
      <div className={`relative inline-flex h-7 w-12 items-center rounded-full shrink-0 transition-colors ${checked ? 'bg-crimson' : 'bg-slate-200 group-hover:bg-slate-300'}`}>
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
    </label>
  );
}
