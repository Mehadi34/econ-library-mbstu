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
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../LanguageContext';
import { Book, User, Donor, PreBookRequest } from '../types';

interface AdminDashboardProps {
  onBack: () => void;
  user: User | null;
  onLogout: () => void;
  books: Book[];
  onUpdateBooks: (books: Book[]) => void;
  donors: Donor[];
  onUpdateDonors: (donors: Donor[]) => void;
  news: import('../types').NewsItem[];
  onUpdateNews: (news: import('../types').NewsItem[]) => void;
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'books' | 'donors' | 'requests' | 'news' | 'users' | 'settings'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'book' | 'donor' | 'news'>('book');
  
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
    setEditingItem({ title: '', author: '', category: 'Economics', isbn: '', description: '', cover: '', totalCopies: 1, availableCopies: 1, location: '' });
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

  const handleEditNews = (n: import('../types').NewsItem) => {
    setModalType('news');
    setEditingItem(n);
    setIsModalOpen(true);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm('Delete this news item?')) {
      onUpdateNews(news.filter(n => n.id !== id));
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
    <div className="min-h-screen bg-[#F8FAFF] flex text-gray-900 font-sans">
      {/* Sidebar - WordPress Style */}
      <aside className="w-72 bg-[#1e2127] text-gray-300 flex flex-col hidden lg:flex">
        <div className="p-8 flex items-center gap-3 bg-[#191c21]">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
             <LayoutDashboard size={18} />
          </div>
          <span className="font-black text-lg tracking-tight text-white">{t.admin.branding}</span>
        </div>

        <div className="p-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mt-6">
          Main Menu
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'books', label: 'Book Library', icon: BookOpen },
            { id: 'donors', label: 'Donors & Charity', icon: Heart },
            { id: 'news', label: 'Blog & News', icon: Bell },
            { id: 'requests', label: 'Pre-book Orders', icon: Package },
            { id: 'users', label: 'Users & Roles', icon: Users },
            { id: 'settings', label: 'System Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-[13px] transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {item.id === 'requests' && requests.some(r => r.status === 'pending') && (
                <span className="ml-auto w-2 h-2 bg-orange-500 rounded-full"></span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-[#191c21]">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-[13px] text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-20 flex-shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={onBack} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
               <ArrowLeft size={18} />
             </button>
             <div className="h-4 w-px bg-gray-100 mx-2"></div>
             <div className="text-sm font-black text-gray-900 uppercase tracking-widest">
                {activeTab}
             </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="p-2 text-gray-400 hover:text-gray-900 relative">
               <Bell size={18} />
               <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-gray-100">
               <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-black text-xs">
                 {user?.name?.[0]}
               </div>
               <span className="text-xs font-black text-gray-900 hidden sm:block">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Content scroll area */}
        <div className="flex-1 overflow-y-auto bg-[#f0f2f5] p-8">
           <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div 
                  key="dash"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                         <div className="flex items-start justify-between mb-4">
                            <div className={`${s.bg} ${s.color} p-3 rounded-xl`}>
                               <s.icon size={20} />
                            </div>
                            <button className="text-gray-300 hover:text-gray-600"><MoreVertical size={16} /></button>
                         </div>
                         <div className="text-2xl font-black text-gray-900">{s.value}</div>
                         <div className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                           <div className="px-8 py-5 border-b border-gray-50 flex items-center justify-between">
                              <h3 className="font-black text-sm uppercase tracking-widest text-gray-900">Recent Pre-book Requests</h3>
                              <button className="text-xs font-black text-blue-600" onClick={() => setActiveTab('requests')}>View All</button>
                           </div>
                           <div className="divide-y divide-gray-50">
                              {requests.map(req => (
                                <div key={req.id} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                   <div className="flex items-center gap-4">
                                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                                         <BookOpen size={18} />
                                      </div>
                                      <div>
                                         <div className="text-[13px] font-black text-gray-900">{req.userName}</div>
                                         <div className="text-[11px] text-gray-400 font-bold">Requested: {req.bookTitle}</div>
                                      </div>
                                   </div>
                                   <div className="flex items-center gap-3">
                                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                        req.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                                        req.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'
                                      }`}>
                                        {req.status}
                                      </span>
                                      <span className="text-[10px] text-gray-300 font-bold">{req.requestDate}</span>
                                   </div>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <div className="bg-[#1e2127] text-white rounded-2xl p-8 shadow-xl relative overflow-hidden">
                           <div className="relative z-10">
                              <h3 className="text-lg font-black mb-2">Admin Notice</h3>
                              <p className="text-xs text-gray-400 leading-relaxed mb-6">
                                System maintenance scheduled for May 15. Please ensure all data is synced.
                              </p>
                              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-xs font-black hover:bg-blue-700 transition-all">
                                View Logs
                              </button>
                           </div>
                           <div className="absolute -right-4 -bottom-4 opacity-10">
                              <Settings size={120} />
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'books' && (
                <motion.div key="books" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:max-w-md">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                       <input 
                         type="text" 
                         placeholder="Search library catalog..." 
                         value={searchQuery}
                         onChange={e => setSearchQuery(e.target.value)}
                         className="w-full bg-gray-50 border border-transparent rounded-xl py-3 pl-12 pr-6 text-xs font-medium focus:bg-white focus:border-blue-100 transition-all outline-none"
                       />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                       <button className="flex-1 md:flex-none bg-gray-50 text-gray-500 border border-gray-100 px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                         <Filter size={16} /> Filters
                       </button>
                       <button 
                        onClick={handleCreateBook}
                        className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                       >
                         <Plus size={16} /> Add New Book
                       </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                           <tr>
                              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Book Information</th>
                              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Author & Category</th>
                              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Inventor/Copies</th>
                              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Settings</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                           {filteredBooks.map(book => (
                             <tr key={book.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-4">
                                      <div className="w-12 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 shadow-sm border border-gray-50">
                                         <img src={book.cover} className="w-full h-full object-cover" alt="" />
                                      </div>
                                      <div>
                                         <div className="text-[13px] font-black text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{book.title}</div>
                                         <div className="text-[10px] text-gray-400 font-bold mt-0.5">ISBN: {book.isbn || 'N/A'}</div>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-8 py-5">
                                   <div className="text-[12px] font-bold text-gray-700">{book.author}</div>
                                   <div className="text-[10px] font-black text-blue-500/60 uppercase mt-0.5">{book.category}</div>
                                </td>
                                <td className="px-8 py-5">
                                   <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${book.availableCopies > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                      <div className="text-[11px] font-black text-gray-900">{book.availableCopies} / {book.totalCopies}</div>
                                   </div>
                                   <div className="text-[10px] text-gray-400 font-bold mt-0.5">Shelf: {book.location || 'N/A'}</div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button 
                                        onClick={() => handleEditBook(book)}
                                        className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                      >
                                         <Edit2 size={14} />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteBook(book.id)}
                                        className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
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
                </motion.div>
              )}

              {activeTab === 'donors' && (
                <motion.div key="donors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                   <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-black text-gray-900">Donor Management</h3>
                      <button 
                        onClick={handleCreateDonor}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-xs font-black shadow-lg shadow-blue-600/20 flex items-center gap-2"
                      >
                        <Plus size={16} /> Add Donor Member
                      </button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {donors.map(donor => (
                        <div key={donor.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:border-blue-200 transition-all">
                           <div className="flex items-center gap-4 mb-6">
                              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-50 group-hover:border-blue-100 transition-colors">
                                 <img src={donor.img} className="w-full h-full object-cover" alt="" />
                              </div>
                              <div className="flex-1">
                                 <h4 className="text-sm font-black text-gray-900">{donor.name}</h4>
                                 <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{donor.role}</p>
                              </div>
                           </div>
                           <div className="space-y-3 mb-6">
                              <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                                 <Mail size={14} className="text-gray-300" /> {donor.email}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                                 <Smartphone size={14} className="text-gray-300" /> 01XXX-XXXXXX
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-gray-500 font-medium font-black text-blue-600">
                                 <Package size={14} className="text-blue-200" /> {donor.amount}
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleEditDonor(donor)}
                                className="flex-1 bg-gray-50 text-gray-600 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
                              >
                                Edit Profile
                              </button>
                              <button 
                                onClick={() => handleDeleteDonor(donor.id)}
                                className="p-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}

              {activeTab === 'news' && (
                <motion.div key="news" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                   <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-black text-gray-900">News & Notice Management</h3>
                      <button 
                        onClick={handleCreateNews}
                        className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-xs font-black shadow-lg shadow-blue-600/20 flex items-center gap-2"
                      >
                        <Plus size={16} /> Create Article
                      </button>
                   </div>

                   <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Priority</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {news.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 text-xs font-bold text-gray-500">{item.date}</td>
                              <td className="px-6 py-4">
                                <span className="text-sm font-black text-gray-900">{item.title}</span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase">{item.category}</span>
                              </td>
                              <td className="px-6 py-4">
                                {item.important ? (
                                  <span className="px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-black uppercase">Urgent</span>
                                ) : (
                                  <span className="text-[10px] font-bold text-gray-300">Normal</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  <button onClick={() => handleEditNews(item)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={14} /></button>
                                  <button onClick={() => handleDeleteNews(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </motion.div>
              )}

              {activeTab === 'requests' && (
                <motion.div key="requests" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="px-8 py-5 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                         <h3 className="font-black text-xs uppercase tracking-widest">Active Pre-book Orders</h3>
                         <div className="flex gap-2">
                            <span className="px-3 py-1 bg-white border border-gray-100 rounded-md text-[10px] font-black text-gray-400">Total: {requests.length}</span>
                         </div>
                      </div>
                      <div className="divide-y divide-gray-50">
                         {requests.map(req => (
                           <div key={req.id} className="px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50/50 transition-colors">
                              <div className="flex items-center gap-5">
                                 <div className={`p-4 rounded-2xl ${
                                   req.status === 'pending' ? 'bg-orange-50 text-orange-500' :
                                   req.status === 'approved' ? 'bg-green-50 text-green-500' :
                                   req.status === 'collected' ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-400'
                                 }`}>
                                    <Clock size={24} />
                                 </div>
                                 <div>
                                    <div className="text-sm font-black text-gray-900">{req.userName}</div>
                                    <div className="text-xs text-gray-400 font-bold mt-0.5">Order ID: #{req.id} • {req.requestDate}</div>
                                    <div className="flex items-center gap-2 mt-2">
                                       <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                                       <span className="text-[11px] font-black text-gray-700">{req.bookTitle}</span>
                                    </div>
                                 </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                 <select 
                                   value={req.status}
                                   onChange={e => handleStatusChange(req.id, e.target.value as any)}
                                   className={`px-4 py-2 rounded-xl text-xs font-black outline-none border transition-all ${
                                     req.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                     req.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                     req.status === 'collected' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-100 text-gray-500 border-gray-200'
                                   }`}
                                 >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="collected">Collected</option>
                                    <option value="rejected">Rejected</option>
                                 </select>
                                 <button className="p-3 bg-white border border-gray-100 text-gray-400 rounded-xl hover:border-blue-200 hover:text-blue-500 transition-all">
                                    <MoreVertical size={16} />
                                 </button>
                              </div>
                           </div>
                         ))}
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
                          <div className="bg-gray-50 rounded-[2rem] p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 cursor-pointer hover:border-blue-300 transition-all group">
                            {editingItem?.cover ? (
                              <img src={editingItem.cover} className="w-32 h-48 object-cover rounded-xl shadow-xl mb-4" alt="" />
                            ) : (
                              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-gray-300 group-hover:text-blue-400 transition-colors mb-4">
                                <ImageIcon size={32} />
                              </div>
                            )}
                            <span className="text-xs font-black text-gray-400 group-hover:text-blue-500 transition-colors">Cover Photo & Media Asset</span>
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
