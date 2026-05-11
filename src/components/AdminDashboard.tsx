import React, { useState } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ChevronRight,
  ArrowLeft,
  LayoutDashboard,
  LogOut,
  Bell,
  CheckCircle2,
  Clock,
  Filter,
  MoreVertical,
  X,
  Package,
  Heart,
  Mail,
  Smartphone,
  MapPin,
  Save,
  Moon,
  Sun,
  User as UserIcon,
  ShoppingBag,
  History,
  QrCode,
  Scan,
  Ticket,
  ClipboardList,
  Wallet,
  Settings as SettingsIcon,
  Image as ImageIcon,
  Newspaper
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useLanguage } from '../LanguageContext';
import { Book, User, Donor, PreBookRequest, NewsItem } from '../types';

interface AdminDashboardProps {
  onBack: () => void;
  user: User | null;
  onLogout: () => void;
  books: Book[];
  onUpdateBooks: (books: Book[]) => void;
  donors: Donor[];
  onUpdateDonors: (donors: Donor[]) => void;
  news: NewsItem[];
  onUpdateNews: (news: NewsItem[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onBack, 
  user, 
  onLogout,
  books,
  onUpdateBooks,
  donors,
  onUpdateDonors,
  news,
  onUpdateNews
}) => {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'dashboard' | 'users' | 'inventory' | 'stickers' | 'scanner' | 'issues' | 'shop' | 'orders' | 'dues' | 'donors' | 'finances' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'book' | 'donor' | 'news'>('book');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Mock Requests
  const [requests, setRequests] = useState<PreBookRequest[]>([
    { id: 'req1', userId: 'u1', userName: 'Rahat Islam', bookId: '1', bookTitle: 'Microeconomics', status: 'pending', requestDate: '2026-05-11' },
    { id: 'req2', userId: 'u2', userName: 'Samiya Khan', bookId: '2', bookTitle: 'Macroeconomics', status: 'approved', requestDate: '2026-05-10' },
  ]);

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: t.stats.totalBooks, value: books.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Members', value: 124, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Requests', value: requests.filter(r => r.status === 'pending').length, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Total Donors', value: donors.length, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const handleCreateBook = () => {
    setModalType('book');
    setEditingItem({ title: '', author: '', category: 'Economics', isbn: '', description: '', cover: '', totalCopies: 1, availableCopies: 1, location: '', ebookUrl: '' });
    setIsModalOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setModalType('book');
    setEditingItem(book);
    setIsModalOpen(true);
  };

  const handleDeleteBook = (id: string) => {
    if (confirm('Are you sure you want to delete this book?')) {
      onUpdateBooks(books.filter(b => b.id !== id));
    }
  };

  const handleCreateDonor = () => {
    setModalType('donor');
    setEditingItem({ name: '', role: 'Donor', amount: '', verified: false, img: '', email: '' });
    setIsModalOpen(true);
  };

  const handleEditDonor = (donor: Donor) => {
    setModalType('donor');
    setEditingItem(donor);
    setIsModalOpen(true);
  };

  const handleDeleteDonor = (id: string) => {
    if (confirm('Are you sure you want to delete this donor?')) {
      onUpdateDonors(donors.filter(d => d.id !== id));
    }
  };

  const handleCreateNews = () => {
    setModalType('news');
    setEditingItem({ title: '', content: '', date: new Date().toISOString().split('T')[0], category: 'Notice', important: false });
    setIsModalOpen(true);
  };

  const handleEditNews = (n: NewsItem) => {
    setModalType('news');
    setEditingItem(n);
    setIsModalOpen(true);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Delete this news item?')) {
      onUpdateNews(news.filter(n => n.id !== id));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large! Please select an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem({ ...editingItem, cover: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === 'book') {
      if (editingItem.id) {
        onUpdateBooks(books.map(b => b.id === editingItem.id ? editingItem : b));
      } else {
        onUpdateBooks([{ ...editingItem, id: Date.now().toString() }, ...books]);
      }
    } else if (modalType === 'donor') {
      if (editingItem.id) {
        onUpdateDonors(donors.map(d => d.id === editingItem.id ? editingItem : d));
      } else {
        onUpdateDonors([{ ...editingItem, id: Date.now().toString() }, ...donors]);
      }
    } else if (modalType === 'news') {
      if (editingItem.id) {
        onUpdateNews(news.map(n => n.id === editingItem.id ? editingItem : n));
      } else {
        onUpdateNews([{ ...editingItem, id: Date.now().toString() }, ...news]);
      }
    }
    setIsModalOpen(false);
  };

  const handleStatusChange = (reqId: string, newStatus: PreBookRequest['status']) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: newStatus } : r));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-950 text-white' : 'bg-[#F4F7FE] text-gray-900'} flex font-sans transition-colors duration-300`}>
      {/* Sidebar - Pro Design */}
      <aside className={`w-72 ${isDarkMode ? 'bg-[#0F1115]' : 'bg-[#0B1120]'} text-gray-400 flex flex-col hidden lg:flex sticky top-0 h-screen z-50`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
             <BookOpen size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="font-black text-sm tracking-tight text-white block leading-tight">পানধোয়া উন্মুক্ত পাঠাগার</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ADMIN GATEWAY</span>
          </div>
        </div>

        <div className="px-6 py-4">
           <div className="bg-[#151C2C] rounded-2xl p-4 flex items-center gap-3 border border-white/5">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center relative">
                 <img src={user?.img || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} className="w-full h-full rounded-full object-cover" alt="" />
                 <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[#151C2C] rounded-full"></div>
              </div>
              <div>
                 <div className="text-xs font-black text-white">{user?.name || "System Admin"}</div>
                 <div className="text-[10px] font-bold text-gray-500">@admin • 01570206953</div>
              </div>
           </div>
        </div>

        <div className="px-6 mt-4 relative">
           <Search className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
           <input 
             type="text" 
             placeholder="Search..." 
             className="w-full bg-[#151C2C] border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-600"
           />
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-1 overflow-y-auto scrollbar-hide pb-10">
          {[
            { id: 'profile', label: 'আমার প্রোফাইল', icon: UserIcon },
            { id: 'dashboard', label: 'ওভারভিউ (Overview)', icon: LayoutDashboard },
            { id: 'users', label: 'সদস্য ব্যবস্থাপনা (Users)', icon: Users },
            { id: 'inventory', label: 'বইয়ের তালিকা (Inventory)', icon: BookOpen },
            { id: 'stickers', label: 'স্টিকার ও QR (Stickers)', icon: QrCode },
            { id: 'scanner', label: 'বারকোড স্ক্যানার', icon: Scan },
            { id: 'issues', label: 'ইস্যু ও ফেরত (Issues)', icon: Ticket },
            { id: 'shop', label: 'শপ বই ব্যবস্থাপনা', icon: ShoppingBag },
            { id: 'orders', label: 'বই বিক্রয় অর্ডার', icon: ClipboardList },
            { id: 'dues', label: 'সদস্যদের বকেয়া (Dues)', icon: History },
            { id: 'donors', label: 'দাতা সদস্য (Donors)', icon: Heart },
            { id: 'news', label: 'নোটিশ ও নিউজ', icon: Newspaper },
            { id: 'finances', label: 'হিসাব-নিকাশ (Finances)', icon: Wallet },
            { id: 'settings', label: 'ওয়েবসাইট সেটিংস', icon: SettingsIcon },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-[13px] transition-all group ${
                activeTab === item.id 
                  ? 'bg-blue-600/10 text-blue-500 shadow-sm border border-blue-500/20' 
                  : 'hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <item.icon size={18} className={`${activeTab === item.id ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-400'}`} />
              {item.label}
              {item.id === 'issues' && requests.some(r => r.status === 'pending') && (
                <span className="ml-auto w-1.5 h-1.5 bg-red-500 rounded-full shadow-lg shadow-red-500/50"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-3">
          <button 
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[13px] text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <ChevronRight size={18} className="rotate-180" />
            Back to Site
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[13px] text-red-500/70 hover:text-red-500 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header bar */}
        <header className={`${isDarkMode ? 'bg-[#0F1115] border-white/5' : 'bg-white border-gray-100'} h-20 border-b flex items-center justify-between px-8 z-30 sticky top-0 flex-shrink-0`}>
          <div className="flex items-center gap-4">
             <button onClick={onBack} className={`p-2.5 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
               <ChevronRight size={18} className="rotate-180" />
             </button>
             <div>
                <h1 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {activeTab === 'dashboard' ? 'ওভারভিউ (Overview)' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </h1>
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{activeTab} panel</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center bg-blue-500/5 rounded-2xl px-4 py-2 border border-blue-500/10">
                <Search className="text-blue-500/50" size={14} />
                <input 
                  type="text" 
                  placeholder="বই ব্রাউজ করুন" 
                  className="bg-transparent border-none text-xs font-bold px-3 outline-none w-48 placeholder:text-blue-500/30"
                />
             </div>

             <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-3 rounded-xl transition-all ${isDarkMode ? 'bg-white/5 text-yellow-400 hover:bg-white/10' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
             >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
             </button>

             <button className={`p-3 rounded-xl relative transition-all ${isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-[#0F1115] rounded-full"></span>
             </button>

             <div className="h-8 w-px bg-gray-100 dark:bg-white/10 mx-1"></div>

             <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                   <div className={`text-xs font-black leading-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>System Admin</div>
                   <div className="text-[10px] font-bold text-gray-400 mt-1">Admin</div>
                </div>
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/20">
                  S
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Content scroll area */}
        <div className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-[#0F1115]' : 'bg-[#F4F7FE]'} p-4 md:p-8 space-y-8`}>
           <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8 max-w-4xl mx-auto pb-20"
                >
                  <div className="flex items-center justify-between">
                     <div>
                        <h2 className="text-2xl font-black tracking-tight">আমার প্রোফাইল</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">আপনার প্রোফাইল পরিচালনা করুন এবং আপডেট দেখুন</p>
                     </div>
                     <div className="flex gap-3">
                        <button className="bg-red-500 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-red-500/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                           <ShoppingBag size={14} /> বই কিনুন
                        </button>
                        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
                           <Search size={14} /> বই খুঁজুন (Browse)
                        </button>
                     </div>
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 shadow-xl shadow-blue-500/5 relative overflow-hidden border border-gray-100 dark:border-white/5">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                     
                     <div className="relative z-10 flex flex-col items-center">
                        <div className="relative group">
                           <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden mb-6">
                              <img src={user?.img || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} className="w-full h-full object-cover" alt="" />
                           </div>
                           <button className="absolute bottom-6 right-2 w-8 h-8 bg-[#1e2127] rounded-full border-2 border-white flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                              <ImageIcon size={14} />
                           </button>
                        </div>
                        
                        <h3 className="text-xl font-black tracking-tight">System Admin</h3>
                        <p className="text-xs font-bold text-gray-400 mt-1">@admin</p>

                        <div className="mt-8 flex flex-col w-full gap-4">
                           <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20">
                              <ImageIcon size={18} /> বুক রিভিউ পোস্ট করুন
                           </button>
                           <button className="w-full bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 border border-gray-100 dark:border-white/5">
                              <Edit2 size={18} /> এডিট প্রোফাইল
                           </button>
                        </div>

                        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                           {[
                             { label: 'Member ID', value: '#002', icon: Ticket, sub: null },
                             { label: 'স্ট্যাটাস', value: 'সক্রিয়', icon: CheckCircle2, sub: 'bg-green-100 text-green-600' },
                             { label: 'Phone', value: '01570206953', icon: Smartphone, sub: null },
                             { label: 'Address', value: 'পানধোয়া উন্মুক্ত পাঠাগার পানধোয়া, আশুলিয়া, সাভার, ঢাকা।', icon: MapPin, sub: null },
                             { label: 'সদস্য ধরণ', value: 'অ্যাডমিন', icon: SettingsIcon, sub: null },
                           ].map((item, i) => (
                             <div key={i} className={`bg-gray-50 dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 flex items-start gap-4 ${i === 3 ? 'md:col-span-2' : ''}`}>
                                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                                   <item.icon size={18} className="text-blue-500" />
                                </div>
                                <div>
                                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{item.label}</div>
                                   <div className="flex items-center gap-2">
                                      <span className="text-sm font-black tracking-tight">{item.value}</span>
                                      {item.sub && <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${item.sub}`}>• সক্রিয়</span>}
                                   </div>
                                </div>
                             </div>
                           ))}
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 w-full">
                           <div className="bg-blue-50 dark:bg-blue-500/5 p-6 rounded-2xl border border-blue-100 dark:border-blue-500/10">
                              <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">TOTAL PAID</div>
                              <div className="text-2xl font-black text-blue-600">৳০</div>
                           </div>
                           <div className="bg-red-50 dark:bg-red-500/5 p-6 rounded-2xl border border-red-100 dark:border-red-500/10">
                              <div className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">UNPAID DUES</div>
                              <div className="text-2xl font-black text-red-600">৳০</div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                     {[
                       { title: 'ম্যাসেজসমূহ', sub: 'আপনার ২টি নতুন ম্যাসেজ আছে।', action: 'সবগুলো ম্যাসেজ দেখুন', icon: Mail, color: 'bg-blue-500', bg: 'bg-blue-50' },
                       { title: 'নোটিশ বোর্ড', sub: 'সর্বশেষ আপডেট ও নোটিশগুলো দেখে নিন।', action: 'নোটিশবোর্ড দেখুন', icon: Bell, color: 'bg-emerald-500', bg: 'bg-emerald-50' },
                     ].map((item, i) => (
                       <div key={i} className={`${item.bg} dark:bg-white/5 p-8 rounded-[2rem] border border-transparent shadow-lg shadow-blue-500/5 relative overflow-hidden group`}>
                          <div className={`p-4 ${item.color} text-white rounded-2xl w-fit mb-6 shadow-lg shadow-blue-500/20`}>
                             <item.icon size={22} />
                          </div>
                          <h4 className="text-lg font-black tracking-tight mb-2">{item.title}</h4>
                          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-6">{item.sub}</p>
                          <button className="flex items-center gap-2 text-xs font-black text-blue-600 hover:gap-3 transition-all underline decoration-2 underline-offset-4">
                             {item.action} <ChevronRight size={16} />
                          </button>
                       </div>
                     ))}
                  </div>

                  <div className="space-y-6">
                     {[
                       { title: 'বর্তমান পঠিত বইসমূহ', empty: 'বর্তমানে কোন ইস্যু করা বই নেই।' },
                       { title: 'পঠিত বইয়ের পূর্বের রেকর্ড', empty: 'কোন পঠিত বইয়ের রেকর্ড নেই।' },
                       { title: 'আমার প্রি-বুকিং ও রিজার্ভেশন', empty: 'আপনার কোন পেন্ডিং রিকোয়েস্ট নেই।' },
                       { title: 'পেমেন্ট হিস্ট্রি', empty: 'কোন পেমেন্ট হিস্ট্রি নেই।' },
                       { title: 'কেনার অনুরোধ করা বই', empty: 'কোন কেনার ইতিহাস নেই।' },
                     ].map((section, i) => (
                       <div key={i} className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm">
                          <div className="flex items-center gap-3 mb-8">
                             <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                             <h4 className="font-black tracking-tight">{section.title}</h4>
                          </div>
                          <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-10 border-2 border-dashed border-gray-100 dark:border-white/10 flex items-center justify-center">
                             <p className="text-xs font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">{section.empty}</p>
                          </div>
                       </div>
                     ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'dashboard' && (
                <motion.div 
                  key="dash"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="relative bg-[#0B1120] rounded-[2.5rem] p-10 md:p-14 overflow-hidden shadow-2xl">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
                     <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full -ml-32 -mb-32 blur-[80px]"></div>
                     
                     <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="max-w-md">
                           <div className="mb-6 w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10 backdrop-blur-md">
                              <History size={28} />
                           </div>
                           <h2 className="text-4xl font-black text-white tracking-tight leading-tight mb-4">হালনাগাদ <br/>ও পরিচালনা</h2>
                           <p className="text-gray-400 text-sm font-bold leading-relaxed mb-8">আপনার দৈনন্দিন পাঠাগারের কার্যক্রম পরিচালনা করুন। সদস্যদের ব্যবস্থাপনা এবং বই ইস্যু/রিটার্ন করুন।</p>
                           
                           <div className="flex flex-wrap gap-4">
                              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-2xl text-[13px] font-black transition-all flex items-center gap-3 border border-white/10 backdrop-blur-md">
                                 <Users size={18} /> সদস্যগণ
                              </button>
                              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl text-[13px] font-black transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20">
                                 <Plus size={18} /> বই প্রদান
                              </button>
                              <button className={`w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all`}>
                                 <ChevronRight size={20} />
                              </button>
                           </div>
                        </div>

                        <div className="hidden lg:block w-72 h-72 opacity-20">
                           <BookOpen size={288} strokeWidth={1} className="text-blue-400" />
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'নিবন্ধিত সদস্য', value: '30', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/5', sub: 'সদস্য' },
                      { label: 'ক্যাটালগে বই', value: books.length, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/5', sub: 'বই' },
                      { label: 'সক্রিয় ইস্যু', value: '1', icon: History, color: 'text-orange-500', bg: 'bg-orange-500/5', sub: 'ইস্যু' },
                      { label: 'বর্তমান ব্যালেন্স', value: '৳-6460', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/5', sub: 'ফান্ড' },
                    ].map((s, i) => (
                      <div key={i} className="bg-white dark:bg-gray-900 px-8 py-10 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-blue-500/5 transition-transform hover:-translate-y-1 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                         <div className="flex flex-col items-center sm:items-start">
                            <div className={`p-4 rounded-2xl ${s.bg} ${s.color} mb-6 shadow-sm`}>
                               <s.icon size={28} className="stroke-[2.5]" />
                            </div>
                            <div className="flex flex-col items-center sm:items-start">
                               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{s.label}</div>
                               <div className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{s.value}</div>
                               <div className="absolute top-10 right-10 text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em]">{s.sub}</div>
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-blue-500/5 overflow-hidden">
                           <div className="p-10 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                              <div>
                                 <h3 className="font-black text-lg tracking-tight">দ্রুত পদক্ষেপ</h3>
                                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">QUICK ACTIONS</p>
                              </div>
                           </div>
                           <div className="p-10 space-y-6">
                              <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-8 border border-gray-100 dark:border-white/5">
                                 <div className="flex items-center gap-3 mb-8 text-gray-500">
                                    <BookOpen size={18} />
                                    <span className="text-[11px] font-black uppercase tracking-widest">বই ব্যবস্থাপনা</span>
                                 </div>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4 hover:shadow-md transition-all">
                                       <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center">
                                          <Plus size={24} />
                                       </div>
                                       <span className="font-black text-sm text-gray-700 dark:text-gray-300">নতুন বই যোগ করুন</span>
                                    </button>
                                    <button className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-4 hover:shadow-md transition-all">
                                       <div className="w-12 h-12 bg-pink-100 dark:bg-pink-500/10 text-pink-500 rounded-xl flex items-center justify-center">
                                          <ShoppingBag size={24} />
                                       </div>
                                       <span className="font-black text-sm text-gray-700 dark:text-gray-300">বই ক্রয়ের অনুরোধ</span>
                                    </button>
                                 </div>
                              </div>

                              <button className="w-full bg-blue-600/5 hover:bg-blue-600/10 text-blue-600 p-6 rounded-[2rem] font-black text-sm flex items-center justify-center gap-4 transition-all border border-blue-500/20">
                                 <Mail size={20} /> ম্যাসেঞ্জার খুলুন
                              </button>
                           </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-blue-500/5 overflow-hidden">
                           <div className="p-10 flex items-center justify-between">
                              <h3 className="font-black text-lg tracking-tight">সাম্প্রতিক কার্যকলাপ</h3>
                           </div>
                           <div className="px-10 pb-10">
                              <div className="bg-gray-50 dark:bg-white/5 rounded-[2rem] p-16 border-2 border-dashed border-gray-200 dark:border-white/5 text-center">
                                 <p className="text-xs font-black text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] leading-relaxed">রিয়েলটাইম আপডেট বন্ধ আছে (কোটা সংরক্ষণের জন্য)। <br/> ড্যাশবোর্ড রিফ্রেশ করুন।</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="bg-[#1e2127] text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden border border-white/5 transition-transform hover:scale-[1.02]">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl"></div>
                           <div className="relative z-10">
                              <div className="p-4 bg-white/5 rounded-2xl w-fit mb-8 border border-white/10">
                                 <Bell size={24} className="text-blue-400" />
                              </div>
                              <h3 className="text-2xl font-black mb-4 tracking-tight">Admin Notice</h3>
                              <p className="text-sm text-gray-400 font-bold leading-relaxed mb-8">
                                সিস্টেম মেইনটেন্যান্স ১৫ই মে নির্ধারিত হয়েছে। আপনার সব ডেটা সিঙ্ক করা আছে কিনা নিশ্চিত করুন।
                              </p>
                              <button className="bg-blue-600 text-white w-full py-4 rounded-2xl text-xs font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30">
                                View Activity Logs
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'inventory' && (
                <motion.div 
                  key="inventory"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div>
                        <h2 className="text-2xl font-black tracking-tight">বইয়ের তালিকা (Inventory)</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">সবগুলো বই পরিচালনা ও স্টক আপডেট করুন</p>
                     </div>
                     <div className="flex gap-3">
                        <button 
                          onClick={() => { setModalType('book'); setEditingItem({}); setIsModalOpen(true); }}
                          className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-[13px] font-black shadow-xl shadow-blue-600/20 flex items-center gap-3 transition-transform hover:scale-105"
                        >
                           <Plus size={18} /> নতুন বই যোগ করুন
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {[
                       { label: 'মোট বই', count: books.length, color: 'text-blue-500', bg: 'bg-blue-500/5' },
                       { label: 'ইস্যু করা', count: '1', color: 'text-orange-500', bg: 'bg-orange-500/5' },
                       { label: 'উপলব্ধ', count: books.length - 1, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                       { label: 'হারানো', count: '0', color: 'text-red-500', bg: 'bg-red-500/5' },
                     ].map((stat, i) => (
                       <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm text-center transition-all hover:border-blue-500/20">
                          <div className={`text-[9px] font-black uppercase tracking-widest leading-none mb-3 ${stat.color}`}>{stat.label}</div>
                          <div className="text-2xl font-black tracking-tight">{stat.count}</div>
                       </div>
                     ))}
                  </div>

                  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-blue-500/5 overflow-hidden">
                     <div className="p-8 border-b border-gray-50 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                           <input 
                             type="text" 
                             placeholder="বইয়ের নাম বা লেখকের নাম দিয়ে খুঁজুন..." 
                             className="w-full bg-gray-50 dark:bg-white/5 border border-transparent rounded-2xl py-3.5 pl-12 pr-4 text-xs font-bold focus:bg-white dark:focus:bg-gray-800 transition-all outline-none"
                             value={searchQuery}
                             onChange={(e) => setSearchQuery(e.target.value)}
                           />
                        </div>
                        <div className="flex gap-2">
                           <button className="p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                              <Filter size={18} />
                           </button>
                        </div>
                     </div>

                     <div className="p-8 overflow-x-auto">
                        <table className="w-full text-left">
                           <thead>
                              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                 <th className="pb-6 px-4">বই ও কভার</th>
                                 <th className="pb-6 px-4">ক্যাটেগরি</th>
                                 <th className="pb-6 px-4">অবস্থান</th>
                                 <th className="pb-6 px-4">স্ট্যাটাস</th>
                                 <th className="pb-6 px-4 text-right">ম্যানেজ</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                              {books.filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase())).map((book) => (
                                <tr key={book.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all">
                                   <td className="py-6 px-4">
                                      <div className="flex items-center gap-4">
                                         <div className="w-12 h-16 bg-gray-100 dark:bg-white/5 rounded-xl flex-shrink-0 overflow-hidden shadow-sm">
                                            {book.cover ? <img src={book.cover} className="w-full h-full object-cover" /> : <BookOpen className="w-full h-full p-3 text-gray-300" />}
                                         </div>
                                         <div className="max-w-[200px]">
                                            <div className="text-[13px] font-black text-gray-900 dark:text-white truncate">{book.title}</div>
                                            <div className="text-[11px] font-bold text-gray-400 truncate">{book.author}</div>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="py-6 px-4">
                                      <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 px-3 py-1.2 rounded-lg text-[10px] font-black tracking-tight">{book.category}</span>
                                   </td>
                                   <td className="py-6 px-4 text-xs font-black text-gray-500 dark:text-gray-400">র‍্যাক: {book.location || 'N/A'}</td>
                                   <td className="py-6 px-4">
                                      <div className="flex items-center gap-2">
                                         <div className={`w-2 h-2 rounded-full ${book.availableCopies > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                         <span className={`text-[10px] font-black uppercase tracking-widest ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {book.availableCopies > 0 ? 'উপলব্ধ' : 'ইস্যু করা'}
                                         </span>
                                      </div>
                                   </td>
                                   <td className="py-6 px-4 text-right">
                                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                         <button 
                                           onClick={() => { setEditingItem(book); setModalType('book'); setIsModalOpen(true); }}
                                           className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                                         >
                                            <Edit2 size={14} />
                                         </button>
                                         <button 
                                           onClick={() => onUpdateBooks(books.filter(b => b.id !== book.id))}
                                           className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all"
                                         >
                                            <Trash2 size={14} />
                                         </button>
                                      </div>
                                   </td>
                                </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'users' && (
                <motion.div 
                  key="users"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div>
                        <h2 className="text-2xl font-black tracking-tight">সদস্য ব্যবস্থাপনা (Users)</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">লাইব্রেরির নিবন্ধিত সদস্যদের তালিকা ও অ্যাক্সেস</p>
                     </div>
                     <div className="flex gap-3">
                        <button className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl text-[13px] font-black shadow-xl shadow-black/10 flex items-center gap-3">
                           <Save size={18} /> এক্সপোর্ট লিস্ট
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {[
                       { name: 'System Admin', role: 'অ্যাডমিন', id: '#001', phone: '01570206953', status: 'Active' },
                       { name: 'Rafiqul Islam', role: 'জেনারেল', id: '#042', phone: '01712xxxxxx', status: 'Active' },
                       { name: 'Sumon Khan', role: 'জেনারেল', id: '#105', phone: '01890xxxxxx', status: 'Pending' },
                     ].map((userItem, i) => (
                       <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-blue-500/5 relative overflow-hidden group hover:border-blue-500/20 transition-all">
                          <div className="flex items-start justify-between mb-8">
                             <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 font-black text-xl">
                                {userItem.name[0]}
                             </div>
                             <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${userItem.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                {userItem.status}
                             </div>
                          </div>
                          
                          <div className="space-y-1">
                             <h3 className="text-lg font-black tracking-tight leading-none truncate">{userItem.name}</h3>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{userItem.role}</p>
                          </div>

                          <div className="mt-8 grid grid-cols-2 gap-4">
                             <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                                <div className="text-[9px] font-black text-gray-400 uppercase mb-1">MEMBER ID</div>
                                <div className="text-xs font-black text-gray-700 dark:text-gray-300">{userItem.id}</div>
                             </div>
                             <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                                <div className="text-[9px] font-black text-gray-400 uppercase mb-1">PHONE</div>
                                <div className="text-xs font-black text-gray-700 dark:text-gray-300 truncate">{userItem.phone}</div>
                             </div>
                          </div>

                          <div className="mt-8 flex gap-2">
                             <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-[11px] font-black shadow-lg shadow-blue-600/10">Manage Access</button>
                             <button className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all">
                                <MoreVertical size={16} />
                             </button>
                          </div>
                       </div>
                     ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'finances' && (
                <motion.div 
                  key="finances"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                     <div>
                        <h2 className="text-2xl font-black tracking-tight">হিসাব-নিকাশ (Finances)</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">পুরো লাইব্রেরির আয় ও ব্যয়ের তথ্য</p>
                     </div>
                     <div className="flex gap-3">
                        <button className="bg-emerald-600 text-white px-8 py-3.5 rounded-2xl text-[13px] font-black shadow-xl shadow-emerald-600/20 flex items-center gap-3">
                           <Plus size={18} /> নতুন এন্ট্রি দিন
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                           {[
                             { label: 'মোট আয় (Current)', value: '৳২,৪৫০', icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-500/5' },
                             { label: 'মোট ব্যয় (Current)', value: '৳৮,৯১০', icon: ShoppingBag, color: 'text-red-500', bg: 'bg-red-500/5' },
                             { label: 'ফান্ড ব্যালেন্স', value: '৳-৬,৪৬০', icon: History, color: 'text-blue-500', bg: 'bg-blue-500/5' },
                           ].map((item, i) => (
                             <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-blue-500/5">
                                <div className={`p-4 rounded-2xl ${item.bg} ${item.color} w-fit mb-6 shadow-sm`}>
                                   <item.icon size={22} className="stroke-[2.5]" />
                                </div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</div>
                                <div className={`text-2xl font-black tracking-tight ${item.color}`}>{item.value}</div>
                             </div>
                           ))}
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-blue-500/5 overflow-hidden">
                           <div className="p-10 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                              <h3 className="font-black text-lg tracking-tight">আয়-ব্যয়ের ইতিহাস</h3>
                              <select className="bg-gray-50 dark:bg-white/5 border border-transparent rounded-xl px-4 py-2 text-xs font-black shadow-inner outline-none">
                                 <option>মে ২০২৪ (চলতি মাস)</option>
                                 <option>এপ্রিল ২০২৪</option>
                              </select>
                           </div>
                           <div className="p-10">
                              <div className="space-y-6">
                                 {[
                                   { title: 'বই ক্রয় (Inventory Update)', date: '০৫ মে, ২০২৪', amount: '-৳৫,৬০০', category: 'Expense' },
                                   { title: 'বই অনুদান (Donor Member)', date: '০৪ মে, ২০২৪', amount: '+৳২,০০০', category: 'Income' },
                                   { title: 'স্টিকার ও ড্রাইভ খরচ', date: '০২ মে, ২০২৪', amount: '-৳৩১০', category: 'Expense' },
                                   { title: 'সদস্য মাসিক ফি', date: '০১ মে, ২০২৪', amount: '+৳৪৫০', category: 'Income' },
                                 ].map((row, i) => (
                                   <div key={i} className="flex items-center justify-between group">
                                      <div className="flex items-center gap-6">
                                         <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all ${row.category === 'Income' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-red-50 dark:bg-red-500/10 text-red-600'}`}>
                                            {row.category === 'Income' ? '+' : '-'}
                                         </div>
                                         <div>
                                            <div className="text-sm font-black text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{row.title}</div>
                                            <div className="text-[10px] font-bold text-gray-400">{row.date} • {row.category}</div>
                                         </div>
                                      </div>
                                      <div className={`text-sm font-black tracking-tight ${row.category === 'Income' ? 'text-emerald-600' : 'text-red-600'}`}>{row.amount}</div>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-blue-500/5 p-10 flex flex-col items-center">
                        <h3 className="font-black text-lg tracking-tight mb-8 self-start">ব্যয়ের ভাগসমূহ</h3>
                        <div className="w-full h-64 relative">
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie
                                    data={[
                                      { name: 'বই ক্রয়', value: 70, color: '#2563eb' },
                                      { name: 'লাইব্রেরি মেইনটেন্যান্স', value: 15, color: '#8b5cf6' },
                                      { name: 'ইভেন্টস', value: 10, color: '#ec4899' },
                                      { name: 'অন্যান্য', value: 5, color: '#6366f1' },
                                    ]}
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                 >
                                    {[
                                      { name: 'বই ক্রয়', value: 70, color: '#2563eb' },
                                      { name: 'লাইব্রেরি মেইনটেন্যান্স', value: 15, color: '#8b5cf6' },
                                      { name: 'ইভেন্টস', value: 10, color: '#ec4899' },
                                      { name: 'অন্যান্য', value: 5, color: '#6366f1' },
                                    ].map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                 </Pie>
                                 <Tooltip />
                              </PieChart>
                           </ResponsiveContainer>
                           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                              <div className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">TOTAL</div>
                              <div className="text-xl font-black text-gray-900 dark:text-white">৳৮.৯k</div>
                           </div>
                        </div>
                        <div className="w-full mt-8 space-y-4">
                           {[
                             { name: 'বই ক্রয়', percentage: '৭০%', color: 'bg-blue-600' },
                             { name: 'লাইব্রেরি মেইনটেন্যান্স', percentage: '১৫%', color: 'bg-purple-600' },
                             { name: 'ইভেন্টস', percentage: '১০%', color: 'bg-pink-600' },
                             { name: 'অন্যান্য', percentage: '৫%', color: 'bg-indigo-600' },
                           ].map((legend, i) => (
                             <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                   <div className={`w-2 h-2 rounded-full ${legend.color}`}></div>
                                   <span className="text-[11px] font-black text-gray-500 dark:text-gray-400">{legend.name}</span>
                                </div>
                                <span className="text-[11px] font-black text-gray-900 dark:text-white">{legend.percentage}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'stickers' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-black tracking-tight">স্টিকার ও QR (Stickers)</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {books.slice(0, 8).map(book => (
                      <div key={book.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center">
                        <div className="w-32 h-32 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
                           <QrCode size={84} strokeWidth={1.5} className="text-gray-300" />
                        </div>
                        <div className="text-[11px] font-black text-gray-900 dark:text-white truncate w-full text-center">{book.title}</div>
                        <div className="text-[9px] font-bold text-gray-400 mt-1">ID: {book.id.slice(0, 8)}</div>
                        <button className="mt-4 w-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 py-2 rounded-xl text-[10px] font-black">Download Sticker</button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'scanner' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center p-20 min-h-[60vh]">
                  <div className="w-64 h-64 border-2 border-blue-500 rounded-3xl flex flex-col items-center justify-center bg-blue-500/5 relative overflow-hidden group">
                     <div className="absolute inset-x-8 top-0 h-0.5 bg-blue-500 opacity-50 group-hover:top-full transition-all duration-2000 ease-linear infinite"></div>
                     <Scan size={64} className="text-blue-500 opacity-20" />
                     <p className="mt-4 text-xs font-black text-blue-400 uppercase tracking-widest text-center px-6">ক্যামেরা অনুমতির জন্য অপেক্ষা করা হচ্ছে...</p>
                  </div>
                  <button className="mt-12 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-600/20">স্ক্যানার চালু করুন</button>
                </motion.div>
              )}

              {activeTab === 'issues' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-black tracking-tight">ইস্যু ও ফেরত (Issues)</h2>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 dark:border-white/5 bg-gray-50/30">
                       <h3 className="font-black text-xs uppercase tracking-widest text-gray-400">অর্ডার ও রিকোয়েস্ট লিস্ট</h3>
                    </div>
                    <div className="divide-y divide-gray-50 dark:divide-white/5">
                       {requests.map(req => (
                         <div key={req.id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-all">
                            <div className="flex items-center gap-5">
                               <div className="w-14 h-14 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400">
                                  <Clock size={28} />
                               </div>
                               <div>
                                  <div className="text-sm font-black tracking-tight">{req.userName}</div>
                                  <div className="text-[10px] font-bold text-gray-400 mt-1">ID: #{req.id} • {req.requestDate}</div>
                                  <div className="text-xs font-black text-blue-600 mt-2">{req.bookTitle}</div>
                               </div>
                            </div>
                            <div className="flex items-center gap-4">
                               <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                 req.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                                 req.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                               }`}>
                                 {req.status}
                               </span>
                               <button className="p-3 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-xl hover:text-blue-500 transition-all">
                                  <CheckCircle2 size={18} />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'shop' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-black tracking-tight">ম্যাগাজিন শপ (Shop)</h2>
                     <button className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-[13px] font-black shadow-xl shadow-blue-600/20 flex items-center gap-3">
                        <Plus size={18} /> নতুন ম্যাগাজিন যোগ করুন
                     </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm group">
                          <div className="aspect-[3/4] bg-gray-100 dark:bg-white/5 relative">
                             <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-[10px] font-black shadow-sm">৳১২০</div>
                          </div>
                          <div className="p-6">
                             <div className="text-sm font-black mb-1 truncate">উন্মুক্ত ম্যাগাজিন - ভলিউম {i}</div>
                             <div className="text-[10px] font-bold text-gray-400 uppercase">IN STOCK: {10 + i}</div>
                          </div>
                       </div>
                     ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-black tracking-tight">সবগুলো অর্ডার (Orders)</h2>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 dark:border-white/5 text-gray-400 font-black text-xs uppercase tracking-widest">ম্যাগাজিন অর্ডার তথ্য</div>
                    <div className="p-20 text-center">
                       <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300">
                          <Package size={40} />
                       </div>
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest">এখন পর্যন্ত কোনো অর্ডার নেই</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'dues' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-black tracking-tight">বকেয়া তালিকা (Dues)</h2>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden">
                    <div className="p-20 text-center">
                       <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">অভিনন্দন! কারো কোনো বকেয়া নেই।</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'news' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-black tracking-tight">নোটিশ ও নিউজ (News)</h2>
                     <button 
                        onClick={handleCreateNews}
                        className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-[13px] font-black shadow-xl shadow-blue-600/20 flex items-center gap-3"
                     >
                        <Plus size={18} /> ক্রিয়েট আর্টিকেল
                     </button>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-white/5 overflow-hidden">
                     <table className="w-full text-left">
                        <thead>
                           <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-white/5">
                              <th className="p-8">তারিখ ও টাইটেল</th>
                              <th className="p-8">ক্যাটেগরি</th>
                              <th className="p-8">স্ট্যাটাস</th>
                              <th className="p-8 text-right">অ্যাকশন</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                           {news.map(item => (
                             <tr key={item.id} className="group hover:bg-gray-50/50 dark:hover:bg-white/5">
                                <td className="p-8">
                                   <div className="text-xs font-bold text-gray-400 mb-1">{item.date}</div>
                                   <div className="text-sm font-black text-gray-900 dark:text-white line-clamp-1">{item.title}</div>
                                </td>
                                <td className="p-8">
                                   <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-lg text-[10px] font-black uppercase">{item.category}</span>
                                </td>
                                <td className="p-8">
                                   {item.important && <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-[10px] font-black uppercase">Urgent</span>}
                                </td>
                                <td className="p-8 text-right">
                                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                      <button onClick={() => handleEditNews(item)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Edit2 size={14} /></button>
                                      <button onClick={() => handleDeleteNews(item.id)} className="p-2.5 bg-red-50 text-red-600 rounded-xl"><Trash2 size={14} /></button>
                                   </div>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
                </motion.div>
              )}
 
              {activeTab === 'donors' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-black tracking-tight">দাতা সদস্য (Donors)</h2>
                     <button 
                        onClick={() => { setModalType('donor'); setEditingItem({}); setIsModalOpen(true); }}
                        className="bg-pink-600 text-white px-8 py-3.5 rounded-2xl text-[13px] font-black shadow-xl shadow-pink-600/20 flex items-center gap-3 transition-transform hover:scale-105"
                     >
                        <Heart size={18} /> নতুন দাতা সদস্য
                     </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {donors.map(donor => (
                      <div key={donor.id} className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
                         <div className="flex items-center gap-5 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-600 font-black text-xl">
                               {donor.name[0]}
                            </div>
                            <div>
                               <h3 className="text-lg font-black tracking-tight leading-none">{donor.name}</h3>
                               <p className="text-[10px] font-black text-pink-500 uppercase tracking-widest mt-2">{donor.role}</p>
                            </div>
                         </div>
                         <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 mb-8">
                            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">TOTAL DONATION</div>
                            <div className="text-xl font-black text-blue-600">{donor.amount}</div>
                         </div>
                         <div className="flex gap-2">
                            <button className="flex-1 bg-gray-50 dark:bg-white/10 text-gray-500 dark:text-gray-400 py-3 rounded-xl text-[11px] font-black hover:bg-gray-100 transition-all">View Details</button>
                            <button 
                              onClick={() => { setEditingItem(donor); setModalType('donor'); setIsModalOpen(true); }}
                              className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl hover:bg-blue-100"
                            >
                              <Edit2 size={16} />
                            </button>
                         </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl">
                   <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-black tracking-tight">ওয়েবসাইট সেটিংস</h2>
                     <button className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-[13px] font-black shadow-xl shadow-blue-600/20">Save Everything</button>
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-white/5 space-y-10">
                     <div className="space-y-6">
                        <h3 className="font-black tracking-tight flex items-center gap-3">
                           <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                           জেনারেল ইনফরমেশন
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">পাঠাগারের নাম</label>
                              <input type="text" defaultValue="পানধোয়া উন্মুক্ত পাঠাগার" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3.5 text-sm font-black outline-none" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">কন্ট্যাক্ট নম্বর</label>
                              <input type="text" defaultValue="01570206953" className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl px-4 py-3.5 text-sm font-black outline-none" />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6 pt-10 border-t border-gray-50 dark:border-white/5">
                        <h3 className="font-black tracking-tight flex items-center gap-3">
                           <div className="w-1.5 h-6 bg-purple-500 rounded-full"></div>
                           অ্যাডভান্সড সেটিংস
                        </h3>
                        <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                           <div>
                              <div className="font-black text-sm mb-1">ডার্ক মোড এনেবল রাখুন</div>
                              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">DARK MODE ACTIVE BY DEFAULT</div>
                           </div>
                           <div className="w-12 h-6 bg-blue-600 rounded-full relative shadow-inner">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </main>

      {/* Editor Modal - WordPress Style */}
      <AnimatePresence>
         {isModalOpen && (
           <div className="fixed inset-0 z-[100] flex items-center justify-end">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-white w-full max-w-2xl h-screen shadow-2xl relative z-10 flex flex-col"
              >
                 <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                       <h2 className="text-xl font-black text-gray-900">{editingItem?.id ? 'Edit Content' : 'Post New Resource'}</h2>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Publisher & Content Management</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 text-gray-400 hover:text-gray-900 transition-colors">
                       <X size={24} />
                    </button>
                 </div>

                  <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide">
                    <div className="space-y-6">
                       {modalType === 'book' ? (
                        <>
                          <div 
                            onClick={() => document.getElementById('book-cover-upload')?.click()}
                            className="bg-gray-50 rounded-[2rem] p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer hover:border-blue-300 transition-all group"
                          >
                            <input 
                              type="file" 
                              id="book-cover-upload" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleFileUpload}
                            />
                            {editingItem?.cover ? (
                              <img src={editingItem.cover} className="w-32 h-48 object-cover rounded-xl shadow-xl mb-4" alt="" />
                            ) : (
                              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-blue-400 transition-colors mb-4">
                                <ImageIcon size={32} />
                              </div>
                            )}
                            <div className="text-center">
                              <span className="text-xs font-black text-gray-400 group-hover:text-blue-500 transition-colors block">
                                {editingItem?.cover ? 'Change Book Cover' : 'Upload Book Cover'}
                              </span>
                              <span className="text-[9px] font-bold text-gray-300 mt-1 block">Maximum size: 2MB</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-6">
                            <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Universal ID / ISBN</label>
                              <input 
                                  type="text"
                                  value={editingItem?.isbn || ''}
                                  onChange={e => setEditingItem({...editingItem, isbn: e.target.value})}
                                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                                  placeholder="ISBN-1234..."
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Title Description</label>
                              <input 
                                  type="text"
                                  required
                                  value={editingItem?.title || ''}
                                  onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm font-black focus:bg-white focus:ring-2 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
                                  placeholder="Full Resource Title..."
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Author / Publisher</label>
                                  <input 
                                    type="text"
                                    required
                                    value={editingItem?.author || ''}
                                    onChange={e => setEditingItem({...editingItem, author: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-medium focus:bg-white transition-all outline-none"
                                  />
                              </div>
                              <div>
                                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Taxonomy / Category</label>
                                  <select 
                                    value={editingItem?.category || 'Economics'}
                                    onChange={e => setEditingItem({...editingItem, category: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold outline-none"
                                  >
                                    <option>Economics</option>
                                    <option>Microeconomics</option>
                                    <option>Macroeconomics</option>
                                    <option>Econometrics</option>
                                    <option>Islam</option>
                                    <option>Science Fiction</option>
                                    <option>Poetry</option>
                                  </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                              <div>
                                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Total Stock</label>
                                  <input 
                                    type="number"
                                    value={editingItem?.totalCopies || 0}
                                    onChange={e => setEditingItem({...editingItem, totalCopies: parseInt(e.target.value)})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-medium outline-none"
                                  />
                              </div>
                              <div>
                                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Available</label>
                                  <input 
                                    type="number"
                                    value={editingItem?.availableCopies || 0}
                                    onChange={e => setEditingItem({...editingItem, availableCopies: parseInt(e.target.value)})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-medium outline-none"
                                  />
                              </div>
                              <div>
                                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Location Code</label>
                                  <input 
                                    type="text"
                                    placeholder="e.g. A-12"
                                    value={editingItem?.location || ''}
                                    onChange={e => setEditingItem({...editingItem, location: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-medium outline-none"
                                  />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Meta Description / Summary</label>
                              <textarea 
                                  rows={6}
                                  value={editingItem?.description || ''}
                                  onChange={e => setEditingItem({...editingItem, description: e.target.value})}
                                  className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-5 py-4 text-sm font-medium focus:bg-white transition-all outline-none resize-none"
                                  placeholder="Summary of the book..."
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Asset URL (Cover Image)</label>
                              <input 
                                  type="text"
                                  value={editingItem?.cover || ''}
                                  onChange={e => setEditingItem({...editingItem, cover: e.target.value})}
                                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-medium outline-none"
                                  placeholder="https://..."
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-book Access URL (Optional)</label>
                              <input 
                                  type="text"
                                  value={editingItem?.ebookUrl || ''}
                                  onChange={e => setEditingItem({...editingItem, ebookUrl: e.target.value})}
                                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-medium outline-none"
                                  placeholder="https://drive.google.com/..."
                              />
                            </div>
                          </div>
                        </>
                       ) : modalType === 'donor' ? (
                        <div className="grid grid-cols-1 gap-6">
                           <div className="flex flex-col items-center mb-8">
                              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-xl mb-4">
                                <img src={editingItem?.img || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&q=80&w=200'} className="w-full h-full object-cover" alt="" />
                              </div>
                              <input 
                                type="text"
                                value={editingItem?.img || ''}
                                onChange={e => setEditingItem({...editingItem, img: e.target.value})}
                                className="w-full max-w-xs bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-[10px] text-center font-medium"
                                placeholder="Avatar Image URL..."
                              />
                           </div>

                           <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                              <input 
                                  type="text"
                                  required
                                  value={editingItem?.name || ''}
                                  onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm font-black focus:bg-white outline-none transition-all"
                              />
                           </div>

                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Role / Tier</label>
                                  <select 
                                    value={editingItem?.role || 'Donor'}
                                    onChange={e => setEditingItem({...editingItem, role: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold outline-none"
                                  >
                                    <option>Chief Advisor</option>
                                    <option>Gold Member</option>
                                    <option>Silver Member</option>
                                    <option>Donor</option>
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Donation Amount</label>
                                  <input 
                                    type="text"
                                    required
                                    value={editingItem?.amount || ''}
                                    placeholder="৳৫০০/মাস"
                                    onChange={e => setEditingItem({...editingItem, amount: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-black text-blue-600 focus:bg-white outline-none transition-all"
                                  />
                              </div>
                           </div>

                           <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Contact Email</label>
                              <input 
                                  type="email"
                                  value={editingItem?.email || ''}
                                  onChange={e => setEditingItem({...editingItem, email: e.target.value})}
                                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm font-medium focus:bg-white outline-none"
                              />
                           </div>

                           <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
                              <input 
                                type="checkbox"
                                id="verified"
                                checked={editingItem?.verified || false}
                                onChange={e => setEditingItem({...editingItem, verified: e.target.checked})}
                                className="w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label htmlFor="verified" className="text-xs font-black text-blue-700 uppercase tracking-widest cursor-pointer">Official Verified Account</label>
                           </div>
                        </div>
                       ) : (
                        <div className="grid grid-cols-1 gap-6">
                           <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Article Title</label>
                              <input 
                                  type="text"
                                  required
                                  value={editingItem?.title || ''}
                                  onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm font-black focus:bg-white outline-none transition-all"
                              />
                           </div>

                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Category</label>
                                  <select 
                                    value={editingItem?.category || 'Notice'}
                                    onChange={e => setEditingItem({...editingItem, category: e.target.value as any})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-sm font-bold outline-none"
                                  >
                                    <option>Notice</option>
                                    <option>Event</option>
                                    <option>Update</option>
                                  </select>
                              </div>
                              <div>
                                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Publish Date</label>
                                  <input 
                                    type="date"
                                    required
                                    value={editingItem?.date || ''}
                                    onChange={e => setEditingItem({...editingItem, date: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm font-medium focus:bg-white outline-none"
                                  />
                              </div>
                           </div>

                           <div>
                              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Content / Body</label>
                              <textarea 
                                  rows={10}
                                  value={editingItem?.content || ''}
                                  onChange={e => setEditingItem({...editingItem, content: e.target.value})}
                                  className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-5 py-4 text-sm font-medium focus:bg-white outline-none resize-none"
                                  placeholder="Write article content here..."
                              />
                           </div>

                           <div className="flex items-center gap-3 bg-red-50 p-4 rounded-xl">
                              <input 
                                type="checkbox"
                                id="important"
                                checked={editingItem?.important || false}
                                onChange={e => setEditingItem({...editingItem, important: e.target.checked})}
                                className="w-5 h-5 rounded-md border-red-300 text-red-600 focus:ring-red-500"
                              />
                              <label htmlFor="important" className="text-xs font-black text-red-700 uppercase tracking-widest cursor-pointer">Mark as Important Notice</label>
                           </div>
                        </div>
                       )}
                    </div>
                 </form>

                 <div className="p-8 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-8 py-3.5 rounded-xl text-gray-500 font-bold text-xs hover:bg-gray-100 transition-colors"
                    >
                       Cancel Changes
                    </button>
                    <button 
                      onClick={handleSave}
                      className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black text-xs shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                       <Save size={16} /> Publish Updates
                    </button>
                 </div>
              </motion.div>
           </div>
         )}
      </AnimatePresence>
    </div>
  );
};
