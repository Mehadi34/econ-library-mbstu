import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Library, 
  BookOpen, 
  Users, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  TrendingUp,
  Bookmark,
  Menu,
  X,
  Book as BookIcon,
  Info,
  Calendar,
  ShoppingBag,
  Heart,
  MessageSquare,
  Sparkles,
  Send,
  ChevronDown,
  Globe,
  ArrowLeft,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Book, LibraryStats, User, Donor, NewsItem } from './types';
import { useLanguage, LanguageProvider } from './LanguageContext';
import { AdminDashboard } from './components/AdminDashboard';

type Page = 'home' | 'books' | 'events' | 'shop' | 'donors' | 'incomeExpense';

// --- Components ---

const BookDetailModal = ({ 
  isOpen, 
  onClose, 
  book,
  onAddToCart,
  isInCart,
  user
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  book: Book | null;
  onAddToCart: (book: Book) => void;
  isInCart: boolean;
  user: User | null;
}) => {
  const { t } = useLanguage();
  if (!book) return null;

  const hasAccess = user?.email && /^ECO\d{5}@mbstu\.ac\.bd$/i.test(user.email);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 text-gray-900">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden relative z-10 shadow-2xl flex flex-col md:flex-row"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/80 backdrop-blur-md text-gray-400 hover:text-gray-900 rounded-full flex items-center justify-center transition-colors shadow-sm"
            >
              <X size={20} />
            </button>

            {/* Left side: Book Cover */}
            <div className="w-full md:w-2/5 bg-gray-50 flex items-center justify-center p-12 relative overflow-hidden">
               <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full translate-x-12 translate-y-12"></div>
               <motion.div 
                 layoutId={`book-img-${book.id}`}
                 className="relative z-10 w-full aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden"
               >
                 <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
               </motion.div>
            </div>

            {/* Right side: Info */}
            <div className="flex-1 p-8 md:p-14 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  {book.category}
                </span>
                <span className="bg-green-50 text-[#00BA88] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00BA88]"></div>
                  {t.book.available}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">{book.title}</h2>
              <div className="flex items-center gap-2 text-gray-500 mb-10">
                <Users size={18} className="text-gray-300" />
                <span className="font-bold">{t.book.by}</span>
                <span className="text-gray-900 font-extrabold">{book.author}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{t.book.bookCode}</span>
                  <span className="text-sm font-black text-gray-900">GEN-{7618 + parseInt(book.id)}</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{t.book.shelf}</span>
                  <span className="text-sm font-black text-gray-900">{book.location || 'N/A'}</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{t.book.category}</span>
                  <span className="text-sm font-black text-gray-900 leading-tight">{book.category}</span>
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-black text-gray-900 mb-3">{t.book.summary}</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-4">
                  {book.description || 'This book provides a deep dive into the subject matter, offering valuable insights and comprehensive knowledge for both students and researchers alike.'}
                </p>
              </div>

              <div className="mt-10 flex gap-4">
                {book.ebookUrl && (
                  <button 
                    onClick={() => window.open(book.ebookUrl, '_blank')}
                    disabled={!hasAccess}
                    className={`flex-1 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${
                      hasAccess 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <BookOpen size={20} /> {hasAccess ? 'Read Online' : 'E-book Restricted'}
                  </button>
                )}
                <button 
                  onClick={() => onAddToCart(book)}
                  disabled={isInCart}
                  className={`flex-1 py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-xl ${
                    isInCart 
                    ? 'bg-green-500 text-white cursor-default shadow-green-500/20' 
                    : 'bg-[#101828] text-white hover:bg-gray-800 shadow-gray-900/10'
                  }`}
                >
                  {isInCart ? (
                    <><CheckCircle2 size={20} /> {t.book.addedToCart}</>
                  ) : (
                    <><Clock size={20} /> {t.book.prebook}</>
                  )}
                </button>
              </div>
              {!hasAccess && book.ebookUrl && (
                <p className="mt-4 text-[10px] text-center font-bold text-gray-400 bg-gray-50 p-3 rounded-xl">
                  University students with <span className="text-blue-500">ECOxxxxx@mbstu.ac.bd</span> get free e-book access.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const LoginModal = ({ 
  isOpen, 
  onClose, 
  onLogin,
  onJoinClick
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onLogin: (user: User) => void;
  onJoinClick: () => void;
}) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // For demo purposes, we'll use a hardcoded check for the provided admin credentials
      if (email === 'economics@1902' && password === 'economics@1902') {
        onLogin({ id: 'admin-0', name: 'Dept. Admin', email: 'economics@1902', role: 'admin' });
        onClose();
        return;
      }
      
      if (email === 'admin' || email === 'admin@mbstu.ac.bd') {
        onLogin({ id: '0', name: 'Super Admin', email: 'admin@mbstu.ac.bd', role: 'admin' });
        onClose();
        return;
      }
      if (email === 'student' || email === 'student@mbstu.ac.bd') {
        onLogin({ id: '1', name: 'Demo Student', email: 'student@mbstu.ac.bd', role: 'student' });
        onClose();
        return;
      }

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      if (res.ok) {
        onLogin(data);
        onClose();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-gray-900">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-md rounded-[2.5rem] p-10 md:p-12 relative z-10 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#F8FAFF] rounded-full flex items-center justify-center mb-6 overflow-hidden">
                <img src="https://upload.wikimedia.org/wikipedia/en/2/2e/Mawlana_Bhashani_Science_and_Technology_University_logo.png" alt="Logo" className="w-12 h-12 object-contain" />
              </div>
              
              <h2 className="text-xl font-black text-gray-900 mb-2 text-center uppercase tracking-tight">{t.auth.welcome}</h2>
              <p className="text-[13px] text-gray-400 mb-10 text-center font-medium">{t.auth.desc}</p>

              {error && (
                <div className="w-full bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-6 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="w-full space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">{t.auth.email}</label>
                  <input 
                    type="text" 
                    placeholder={t.auth.usernamePlaceholder}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-[#5D5FEF]/10 focus:border-[#5D5FEF] transition-all font-medium"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2 ml-1">
                    <label className="block text-xs font-bold text-gray-600">{t.auth.password}</label>
                    <button type="button" className="text-[11px] font-bold text-[#5D5FEF] hover:underline underline-offset-4">
                      {t.auth.forgotPassword}
                    </button>
                  </div>
                  <input 
                    type="password" 
                    placeholder={t.auth.passwordPlaceholder}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-[#5D5FEF]/10 focus:border-[#5D5FEF] transition-all font-medium"
                  />
                </div>
                
                <button 
                  disabled={isLoading}
                  className="w-full bg-[#5D5FEF] text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#4D4FDB] transition-all shadow-lg shadow-[#5D5FEF]/20 disabled:opacity-50 mt-4"
                >
                  {isLoading ? t.auth.processing : (
                    <>
                      {t.auth.signIn} <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="w-full flex items-center gap-4 my-8">
                <div className="flex-1 h-px bg-gray-100"></div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.auth.orContinue}</span>
                <div className="flex-1 h-px bg-gray-100"></div>
              </div>

              <button type="button" className="w-full flex items-center justify-center gap-3 border border-gray-100 py-4 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-all mb-8 shadow-sm">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" alt="Google" className="w-5 h-5" />
                {t.auth.googleSignIn}
              </button>

              <p className="text-[11px] font-bold text-gray-400 text-center">
                {t.auth.noAccount} <button onClick={() => { onClose(); onJoinClick(); }} className="text-[#5D5FEF] hover:underline underline-offset-4 font-black">{t.auth.becomeMember}</button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const MembershipModal = ({ 
  isOpen, 
  onClose,
  onLoginClick
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onLoginClick: () => void;
}) => {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'library'>('online');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    username: '',
    password: '',
    senderNumber: '',
    trxId: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 text-gray-900">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 md:p-12 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={40} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">{t.membership.title}</h2>
                <p className="text-lg text-gray-500 font-medium mb-10">{t.membership.success}</p>
                <button 
                  onClick={onClose}
                  className="bg-[#5D5FEF] text-white px-10 py-4 rounded-xl font-black text-lg hover:bg-[#4D4FDB] transition-all shadow-lg"
                >
                  {t.membership.close}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 overflow-hidden">
                   <img src="https://upload.wikimedia.org/wikipedia/en/2/2e/Mawlana_Bhashani_Science_and_Technology_University_logo.png" alt="Logo" className="w-12 h-12 object-contain" />
                </div>
                
                <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">{t.membership.title}</h2>
                <p className="text-sm text-gray-400 mb-10 text-center font-medium max-w-sm">{t.membership.subtitle}</p>

                <form onSubmit={handleSubmit} className="w-full space-y-6">
                  {/* Fee Information Box */}
                  <div className="bg-[#F8FAFF] border border-[#EDF2FF] rounded-3xl p-6 relative overflow-hidden">
                    <div className="flex items-start gap-4">
                      <div className="bg-white p-2 rounded-xl text-blue-600 shadow-sm">
                        <Bookmark size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-black text-gray-900">{t.membership.feeLabel}</h4>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                          {t.membership.feeDesc}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('online')}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black transition-all ${
                          paymentMethod === 'online' 
                            ? 'bg-[#EDF2FF] text-[#5D5FEF] border border-[#DCE4FF]' 
                            : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <Send size={14} /> {t.membership.onlinePayment}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPaymentMethod('library')}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-[11px] font-black transition-all ${
                          paymentMethod === 'library' 
                            ? 'bg-[#EDF2FF] text-[#5D5FEF] border border-[#DCE4FF]' 
                            : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <Users size={14} /> {t.membership.payAtLibrary}
                      </button>
                    </div>

                    {paymentMethod === 'online' && (
                      <div className="mt-6 space-y-4">
                        <div className="bg-white border border-[#EDF2FF] rounded-2xl p-4 text-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">{t.membership.paymentTo}</span>
                          <span className="text-lg font-black text-gray-900">{t.membership.paymentInfo}</span>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                              {t.membership.senderNumber} <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text" 
                              placeholder="01XXXXXXXXX"
                              required
                              value={formData.senderNumber}
                              onChange={(e) => setFormData({...formData, senderNumber: e.target.value})}
                              className="w-full bg-white border border-[#EDF2FF] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#5D5FEF]/10 focus:border-[#5D5FEF] transition-all font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                              {t.membership.trxFee} <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text" 
                              placeholder="8NXXXXXX..."
                              required
                              value={formData.trxId}
                              onChange={(e) => setFormData({...formData, trxId: e.target.value})}
                              className="w-full bg-white border border-[#EDF2FF] rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#5D5FEF]/10 focus:border-[#5D5FEF] transition-all font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">{t.membership.fullName}</label>
                      <input 
                        type="text" 
                        placeholder={t.membership.fullNamePlaceholder}
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#5D5FEF]/10 focus:border-[#5D5FEF] transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">{t.membership.phone}</label>
                      <input 
                        type="tel" 
                        placeholder={t.membership.phonePlaceholder}
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#5D5FEF]/10 focus:border-[#5D5FEF] transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">{t.membership.address}</label>
                      <textarea 
                        placeholder={t.membership.addressPlaceholder}
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        rows={3}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#5D5FEF]/10 focus:border-[#5D5FEF] transition-all font-medium resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">{t.membership.username}</label>
                      <input 
                        type="text" 
                        placeholder={t.membership.usernamePlaceholder}
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#5D5FEF]/10 focus:border-[#5D5FEF] transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">{t.membership.password}</label>
                      <input 
                        type="password" 
                        placeholder={t.membership.passwordPlaceholder}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-sm focus:ring-2 focus:ring-[#5D5FEF]/10 focus:border-[#5D5FEF] transition-all font-medium"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={isLoading}
                    className="w-full bg-[#5D5FEF] text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#4D4FDB] transition-all shadow-xl shadow-[#5D5FEF]/20 disabled:opacity-50 mt-8"
                  >
                    {isLoading ? t.auth.processing : (
                      <>
                        {t.membership.register} <ArrowRight size={18} />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-4">
                    <button 
                      type="button" 
                      onClick={() => { onClose(); onLoginClick(); }}
                      className="text-[11px] font-bold text-gray-400 hover:text-[#5D5FEF] transition-colors"
                    >
                      Already a member? <span className="text-[#5D5FEF]">Log in instead</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const BookPaymentModal = ({ 
  isOpen, 
  onClose,
  items
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  items: Book[];
}) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ senderNumber: '', trxId: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 text-gray-900">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 md:p-12 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
              <X size={24} />
            </button>

            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">{t.book.success}</h2>
                <p className="text-lg text-gray-500 font-medium mb-10">{t.book.successMsg}</p>
                <button 
                  onClick={onClose}
                  className="bg-[#5D5FEF] text-white px-10 py-4 rounded-xl font-black text-lg hover:bg-[#4D4FDB] transition-all shadow-lg"
                >
                  {t.membership.close}
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-50 text-[#5D5FEF] rounded-2xl flex items-center justify-center">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">{t.book.checkout}</h2>
                    <p className="text-sm text-gray-400 font-bold">{items.length} {t.book.total}</p>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                   {items.map(item => (
                     <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                        <img src={item.cover} className="w-10 h-14 object-cover rounded-md shadow-sm" alt="" />
                        <div>
                           <p className="text-xs font-black line-clamp-1">{item.title}</p>
                           <p className="text-[10px] text-gray-400 font-bold">{item.author}</p>
                        </div>
                     </div>
                   ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                   <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{t.membership.paymentTo}</p>
                      <p className="text-lg font-black text-gray-900">{t.membership.paymentInfo}</p>
                   </div>
                   
                   <div className="grid grid-cols-3 gap-3">
                      {['Bkash', 'Nagad', 'Rocket'].map(m => (
                        <button key={m} type="button" className="bg-white border border-gray-100 py-4 rounded-xl flex flex-col items-center gap-2 hover:border-[#5D5FEF]/30 hover:bg-blue-50 transition-all group">
                           <div className="w-8 h-8 bg-gray-100 rounded-lg group-hover:scale-110 transition-transform flex items-center justify-center text-[8px] font-black">{m}</div>
                           <span className="text-[10px] font-black text-gray-500">{m}</span>
                        </button>
                      ))}
                   </div>

                   <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.membership.senderNumber}</label>
                        <input 
                          type="text" 
                          placeholder="01XXXXXXXXX"
                          required
                          value={formData.senderNumber}
                          onChange={(e) => setFormData({...formData, senderNumber: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#5D5FEF]/10 focus:border-[#5D5FEF] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">{t.membership.trxFee}</label>
                        <input 
                          type="text" 
                          placeholder="TRXID..."
                          required
                          value={formData.trxId}
                          onChange={(e) => setFormData({...formData, trxId: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#5D5FEF]/10 focus:border-[#5D5FEF] outline-none transition-all"
                        />
                      </div>
                   </div>

                   <button 
                     disabled={isLoading}
                     type="submit"
                     className="w-full bg-[#5D5FEF] text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#4D4FDB] transition-all shadow-xl shadow-[#5D5FEF]/20 disabled:opacity-50"
                   >
                     {isLoading ? t.auth.processing : t.book.checkout}
                   </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const DonorWallPage = ({ donors }: { donors: Donor[] }) => {
  const { t } = useLanguage();

  return (
    <section className="pt-44 pb-32 max-w-7xl mx-auto px-6">
      <div className="flex flex-col items-center text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
          {t.donors.badge}
        </div>
        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">{t.donors.title}</h2>
        <p className="text-lg text-gray-500 max-w-2xl font-medium leading-relaxed">{t.donors.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {donors.map((donor, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 flex flex-col items-center text-center group hover:border-blue-100 transition-all">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
                <img src={donor.img} alt={donor.name} className="w-full h-full object-cover" />
              </div>
              {donor.verified && (
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 border-4 border-white rounded-full flex items-center justify-center text-white font-black text-[10px]">
                  {t.donors.verified}
                </div>
              )}
            </div>
            <h4 className="text-xl font-black text-gray-900 mb-1">{donor.name}</h4>
            <p className="text-xs font-black text-[#5D5FEF] uppercase tracking-widest mb-4">{donor.role}</p>
            <div className="bg-gray-50 px-6 py-2 rounded-xl text-sm font-black text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              {donor.amount}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const EventsPage = () => {
  const { t } = useLanguage();
  return (
    <section className="pt-44 pb-32 max-w-7xl mx-auto px-6">
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center bg-gray-50 rounded-[3rem] p-12 border-2 border-dashed border-gray-200">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gray-300 mb-8 shadow-xl">
          <Calendar size={48} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-4">{t.eventsPage.empty}</h2>
        <p className="text-gray-500 font-medium max-w-md">{t.eventsPage.subtitle}</p>
      </div>
    </section>
  );
};

const ShopPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'catalog' | 'tracking'>('catalog');
  
  return (
    <section className="pt-44 pb-32 max-w-7xl mx-auto px-6">
      <div className="flex flex-col items-center text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">{t.shopPage.title}</h2>
        <p className="text-lg text-gray-500 max-w-2xl font-medium leading-relaxed">{t.shopPage.subtitle}</p>
      </div>

      <div className="flex justify-center gap-4 mb-16">
        <button 
          onClick={() => setActiveTab('catalog')}
          className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${
            activeTab === 'catalog' ? 'bg-[#5D5FEF] text-white shadow-xl shadow-[#5D5FEF]/20' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
          }`}
        >
          {t.shopPage.title}
        </button>
        <button 
          onClick={() => setActiveTab('tracking')}
          className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${
            activeTab === 'tracking' ? 'bg-[#5D5FEF] text-white shadow-xl shadow-[#5D5FEF]/20' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
          }`}
        >
          {t.shopPage.tracking}
        </button>
      </div>

      {activeTab === 'catalog' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* Mock book products */}
           {[1, 2, 3, 4, 5, 6].map(i => (
             <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 flex gap-6 group hover:border-[#5D5FEF]/30 transition-all">
                <div className="w-24 h-36 bg-gray-100 rounded-xl overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  <img src={`https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200`} alt="Book" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-2">
                   <div>
                     <h4 className="text-lg font-black text-gray-900 line-clamp-1 mb-1">প্রমিত বাংলা ব্যাকরণ</h4>
                     <p className="text-xs text-gray-400 font-bold mb-3">{t.book.by} ড. মহিত উল আলম</p>
                     <span className="text-xl font-black text-[#00BA88]">৳ ২২০</span>
                   </div>
                   <button className="bg-gray-900 text-white py-3 px-6 rounded-xl text-[11px] font-black hover:bg-black transition-all flex items-center justify-center gap-2">
                     <ShoppingBag size={14} /> {t.shopPage.addToCart}
                   </button>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white p-10 md:p-14 rounded-[3rem] border border-gray-100 shadow-2xl text-gray-900">
           <div className="text-center mb-10">
             <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} />
             </div>
             <h3 className="text-2xl font-black mb-2">{t.shopPage.trackTitle}</h3>
             <p className="text-sm text-gray-500 font-medium">{t.shopPage.trackSubtitle}</p>
           </div>
           
           <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">{t.shopPage.trackPlaceholder}</label>
                <input 
                  type="text" 
                  placeholder="EX: 123456"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all outline-none"
                />
              </div>
              <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
                {t.shopPage.trackButton}
              </button>
           </div>
        </div>
      )}
    </section>
  );
};

const IncomeExpensePage = () => {
  const { t, lang } = useLanguage();
  const stats = [
    { label: t.incomeExpense.totalIncome, value: '১২,৪৫০', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: t.incomeExpense.totalExpense, value: '৪,২০০', icon: ShoppingBag, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: t.incomeExpense.balance, value: '৮,২৫০', icon: Heart, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  const records = [
    { date: '১২ মে, ২০২৬', desc: 'নতুন বই ক্রয় (৫টি)', amount: '-১৫০০', type: 'expense' },
    { date: '১০ মে, ২০২৬', desc: 'দাতা সদস্য অনুদান - মিনহাজ হাফিজ', amount: '+২০০০', type: 'income' },
    { date: '০৫ মে, ২০২৬', desc: 'সদস্য ফি সংগ্রহ', amount: '+৫০০', type: 'income' },
    { date: '০১ মে, ২০২৬', desc: 'বিদ্যুৎ বিল (এপ্রিল)', amount: '-৩০০', type: 'expense' },
  ];

  return (
    <section className="pt-44 pb-32 max-w-7xl mx-auto px-6 text-gray-900">
      <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
        <div>
          <h2 className="text-5xl font-black tracking-tight mb-2">{t.incomeExpense.title}</h2>
          <p className="text-gray-500 font-medium">Econ-Library (MBSTU) Financial Dashboard</p>
        </div>
        <div className="flex gap-3">
           <button className="bg-white border border-gray-100 px-6 py-3 rounded-xl font-black text-xs hover:bg-gray-50 transition-all shadow-sm">
             {t.incomeExpense.filter} <ChevronDown size={14} className="inline ml-1" />
           </button>
           <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-black text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
             {t.incomeExpense.print}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 flex items-center gap-6">
            <div className={`w-16 h-16 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center shrink-0`}>
              <item.icon size={32} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</p>
              <h4 className="text-3xl font-black">৳ {item.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black">{t.incomeExpense.records}</h3>
             <button className="text-blue-600 text-xs font-black hover:underline uppercase tracking-widest">{t.nav.more}</button>
           </div>
           <div className="space-y-4">
              {records.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex gap-4 items-center">
                    <div className={`w-1.5 h-8 rounded-full ${r.type === 'income' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    <div>
                      <p className="text-sm font-black text-gray-900 mb-0.5">{r.desc}</p>
                      <p className="text-[10px] font-bold text-gray-400">{r.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-black ${r.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {r.amount}
                  </span>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-2xl flex flex-col">
           <h3 className="text-xl font-black mb-8">{t.incomeExpense.chart}</h3>
           <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-48 h-48 rounded-full border-[1.5rem] border-emerald-500 border-r-rose-500 flex items-center justify-center mb-8 transform -rotate-45">
                 <div className="rotate-45 text-center">
                    <p className="text-sm font-black text-gray-900">৭৪.৫%</p>
                    <p className="text-[10px] font-bold text-gray-400">Income Share</p>
                 </div>
              </div>
              <div className="flex gap-8 justify-center">
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                   <span className="text-[11px] font-black text-gray-600">{t.incomeExpense.totalIncome}</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                   <span className="text-[11px] font-black text-gray-600">{t.incomeExpense.totalExpense}</span>
                </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

const Navbar = ({ 
  user, 
  onLogout, 
  onLoginClick, 
  onJoinClick, 
  onDashboardClick,
  cartCount,
  onCartClick,
  currentPage,
  onPageChange
}: { 
  user: User | null;
  onLogout: () => void;
  onLoginClick: () => void;
  onJoinClick: () => void;
  onDashboardClick: () => void;
  cartCount: number;
  onCartClick: () => void;
  currentPage: Page;
  onPageChange: (page: Page) => void;
}) => {
  const { t, lang, setLang } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: Page; label: string }[] = [
    { id: 'home', label: t.nav.home },
    { id: 'books', label: t.nav.books },
    { id: 'events', label: t.nav.events },
    { id: 'shop', label: t.nav.buyBook },
    { id: 'donors', label: t.nav.donors },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-white py-5'
    }`}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
             {currentPage !== 'home' && (
               <button 
                 onClick={() => onPageChange('home')}
                 className="text-gray-400 hover:text-gray-900 transition-colors hidden md:block"
               >
                 <ArrowLeft size={20} />
               </button>
             )}
             {currentPage !== 'home' && <div className="w-[1px] h-8 bg-gray-100 hidden md:block"></div>}
             <div 
               onClick={() => onPageChange('home')}
               className="flex items-center gap-3 cursor-pointer group"
             >
               <div className="w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center overflow-hidden border border-gray-50 transform group-hover:scale-105 transition-transform">
                 <img src="https://upload.wikimedia.org/wikipedia/en/2/2e/Mawlana_Bhashani_Science_and_Technology_University_logo.png" alt="Logo" className="w-8 h-8 object-contain" />
               </div>
               <span className="font-black text-lg text-gray-900 tracking-tight whitespace-nowrap">
                 {t.nav.brand}
               </span>
             </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 ml-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-4 py-2 text-sm font-black transition-all rounded-xl ${
                  currentPage === item.id 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-black text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all rounded-xl">
                {t.nav.more} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              {/* Dropdown would go here if needed */}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-1 mr-2">
            <button 
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 text-[10px] font-black tracking-widest rounded-xl transition-all ${
                lang === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('bn')}
              className={`px-3 py-1.5 text-[10px] font-black tracking-widest rounded-xl transition-all ${
                lang === 'bn' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              BN
            </button>
          </div>

          <button 
            onClick={onCartClick}
            className={`relative p-3 transition-colors rounded-2xl ${
              currentPage === 'shop' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 w-5 h-5 bg-[#5D5FEF] border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-black">
                {cartCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => onPageChange('incomeExpense')}
            className={`hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-md ${
              currentPage === 'incomeExpense'
              ? 'bg-[#00BA88] text-white shadow-emerald-500/20'
              : 'bg-[#00BA88]/10 text-[#00BA88] hover:bg-[#00BA88] hover:text-white shadow-emerald-500/5'
            }`}
          >
            {t.nav.incomeExpense}
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
               {user.role === 'admin' && (
                 <button 
                  onClick={onDashboardClick}
                  className="bg-[#5D5FEF] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#4D4FDB] transition-all shadow-md shadow-[#5D5FEF]/10 mr-2"
                 >
                  {t.admin.dashboard}
                 </button>
               )}
               <span className="text-xs font-black text-gray-900 hidden sm:block">{user.name}</span>
               <button 
                onClick={onLogout}
                className="p-3 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 rounded-xl"
               >
                <X size={20} />
               </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-2">
              <button 
                onClick={onLoginClick}
                className="text-sm font-black text-gray-500 hover:text-gray-900 transition-colors px-4 py-2.5 rounded-xl hover:bg-gray-50"
              >
                {t.nav.login}
              </button>
              <button 
                onClick={onJoinClick}
                className="bg-[#5D5FEF] text-white px-8 py-2.5 rounded-xl text-sm font-black hover:bg-[#4D4FDB] transition-all shadow-lg shadow-[#5D5FEF]/20"
              >
                {t.nav.joinNow}
              </button>
            </div>
          )}
          
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className={`lg:hidden p-3 rounded-xl transition-all ${
              isOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-500'
            }`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-2xl overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { onPageChange(item.id); setIsOpen(false); }}
                  className={`w-full text-left p-4 rounded-2xl text-lg font-black transition-all ${
                    currentPage === item.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="h-px bg-gray-100 my-2"></div>
              <button 
                onClick={() => { onPageChange('incomeExpense'); setIsOpen(false); }}
                className="w-full text-left p-4 rounded-2xl text-lg font-black text-[#00BA88] hover:bg-emerald-50 transition-all"
              >
                {t.nav.incomeExpense}
              </button>
              {user ? (
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full text-left p-4 rounded-2xl text-lg font-black text-red-500 hover:bg-red-50 transition-all">{t.nav.logout}</button>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <button onClick={() => { onLoginClick(); setIsOpen(false); }} className="p-4 rounded-2xl text-center font-black bg-gray-100 text-gray-900">{t.nav.login}</button>
                  <button onClick={() => { onJoinClick(); setIsOpen(false); }} className="p-4 rounded-2xl text-center font-black bg-[#5D5FEF] text-white shadow-lg shadow-[#5D5FEF]/20">{t.nav.joinNow}</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ 
  onSearch,
  onApplyClick,
  onLoginClick,
  onBrowseClick
}: { 
  onSearch: (q: string) => void;
  onApplyClick: () => void;
  onLoginClick: () => void;
  onBrowseClick: () => void;
}) => {
  const { t } = useLanguage();
  return (
    <section className="relative pt-44 pb-32 overflow-hidden bg-white">
      {/* Background accents matching the screenshot */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-blue-50/40 via-transparent to-transparent rounded-full -translate-y-1/2 blur-[120px] opacity-60"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-emerald-600 rounded-full text-xs font-bold tracking-tight mb-12 shadow-sm border border-green-100/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {t.hero.badge}
          </div>
          
          <h1 className="text-[3.5rem] md:text-[6.5rem] font-black text-gray-900 leading-[1] mb-10 tracking-tighter drop-shadow-sm">
            {t.hero.title}
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-14 font-medium leading-relaxed px-4">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-20">
            <button 
              onClick={onApplyClick}
              className="bg-[#101828] text-white px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-gray-800 transition-all group shadow-xl shadow-gray-900/10"
            >
              {t.hero.applyMember} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={onLoginClick}
              className="bg-[#5D5FEF] text-white px-10 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-[#4D4FDB] transition-all shadow-xl shadow-[#5D5FEF]/20"
            >
              {t.hero.login}
            </button>
            <button 
              onClick={onBrowseClick}
              className="bg-white text-gray-700 border border-gray-100 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-all shadow-md"
            >
              {t.hero.browse}
            </button>
          </div>

          <div className="inline-flex mb-24">
             <button className="bg-pink-50 text-pink-500 border border-pink-100 px-8 py-3 rounded-full font-black text-sm flex items-center gap-2 hover:bg-pink-100 transition-all shadow-sm">
               <ShoppingBag size={18} /> {t.hero.buyBook}
             </button>
          </div>

          {/* Search Bar - styled more like the screenshot */}
          <div className="w-full max-w-2xl relative">
            <div className="absolute inset-0 bg-blue-500/5 blur-3xl -z-10 rounded-full"></div>
            <input 
              type="text" 
              placeholder={t.hero.searchPlaceholder}
              className="w-full bg-white pl-14 pr-24 py-6 rounded-3xl shadow-2xl shadow-blue-900/5 border border-gray-100 focus:ring-2 focus:ring-[#5D5FEF]/20 focus:border-[#5D5FEF] transition-all text-lg font-medium"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Features = ({ 
  onCatalogClick, 
  onEventsClick, 
  onShopClick 
}: { 
  onCatalogClick: () => void; 
  onEventsClick: () => void; 
  onShopClick: () => void; 
}) => {
  const { t } = useLanguage();
  const features = [
    { 
      title: t.features.catalog.title, 
      desc: t.features.catalog.desc, 
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600',
      onClick: onCatalogClick
    },
    { 
      title: t.features.events.title, 
      desc: t.features.events.desc, 
      icon: Calendar,
      color: 'bg-emerald-50 text-emerald-600',
      onClick: onEventsClick
    },
    { 
      title: t.features.shop.title, 
      desc: t.features.shop.desc, 
      icon: ShoppingBag,
      color: 'bg-pink-50 text-pink-600',
      onClick: onShopClick
    }
  ];

  return (
    <section id="features" className="py-24 max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((f, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -12 }}
            onClick={f.onClick}
            className="bg-white p-12 rounded-[4rem] shadow-2xl shadow-blue-900/5 border border-gray-100 flex flex-col items-center text-center group transition-all duration-500 cursor-pointer"
          >
            <div className={`w-20 h-20 ${f.color} rounded-full flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
              <f.icon size={36} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-5 leading-tight">{f.title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed text-base">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const DonorWall = () => {
  const { t } = useLanguage();
  const donors = [
    { name: 'প্রফেসর ড. সৈয়দ কামরুল আহসান টিটু', title: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়', id: 'd1', color: 'bg-orange-50 text-orange-500' },
    { name: 'আব্দুল হাই মোঃ তারু', title: 'পানধোয়া', id: 'd2', color: 'bg-blue-50 text-blue-500' },
    { name: 'মোঃ লুৎফর রহমান', title: 'পানধোয়া', id: 'd3', color: 'bg-emerald-50 text-emerald-500' },
    { name: 'আবু বকর মোহাম্মদ তাহের', title: 'পানধোয়া গ্রীন সিটি', id: 'd4', color: 'bg-purple-50 text-purple-500' },
    { name: 'প্রফেসর আব্দুস সালাম', title: 'পানধোয়া', id: 'd5', color: 'bg-pink-50 text-pink-500' },
    { name: 'সার্জেন্ট শহিদুল্লাহ (অব)', title: 'পানধোয়া', id: 'd6', color: 'bg-amber-50 text-amber-500' }
  ];

  return (
    <section id="donors" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-50 text-pink-500 rounded-full text-xs font-black tracking-widest mb-8 border border-pink-100">
           {t.donors.badge}
        </div>
        <h2 className="text-5xl font-black text-gray-900 mb-8 tracking-tight">
          {t.donors.title}
        </h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-20 font-medium leading-relaxed">
          {t.donors.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-900">
          {donors.map(d => (
            <motion.div 
              key={d.id} 
              whileHover={{ scale: 1.02 }}
              className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center hover:shadow-xl hover:shadow-gray-900/5 transition-all duration-500"
            >
              <div className={`w-20 h-20 ${d.color} rounded-full flex items-center justify-center mb-6 relative shadow-inner`}>
                <Users size={36} strokeWidth={1.5} />
                <div className="absolute -top-1 -right-1 bg-white shadow-md p-1.5 rounded-full">
                  <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] text-white font-black uppercase">
                    {t.donors.verified}
                  </div>
                </div>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">{d.name}</h4>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">{d.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = ({ 
  onApplyClick, 
  onListClick 
}: { 
  onApplyClick: () => void; 
  onListClick: () => void; 
}) => {
  const { t } = useLanguage();
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="bg-gray-900 rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full -mr-48 -mt-48 blur-[100px] opacity-20"></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1]">
            {t.cta.title}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-medium">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={onApplyClick}
              className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all"
            >
              {t.cta.apply}
            </button>
            <button 
              onClick={onListClick}
              className="bg-gray-800 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-700 transition-all"
            >
              {t.cta.list}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const AIAssistant = () => {
  const { t, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const history = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history,
          { role: 'user', parts: [{ text: userMsg }] }
        ],
        config: {
          systemInstruction: `You are the Library Assistant AI for Econ Library MBSTU (Economics Department at Mawlana Bhashani Science and Technology University). 
          Answer in ${lang === 'bn' ? 'Bengali' : 'English'} as the primary language. Be helpful, polite, and technical about economics resources.
          Location: Department of Economics, 6th floor, Academic building-3, Mawlana Bhasani Science and Technology University (MBSTU), Santosh, Tangail, 1902.
          Contact: 01880412129, Email: Eco24034@mbstu.com.
          The library has over 10,000 resources.`
        }
      });
      
      const aiText = response.text;
      setMessages(prev => [...prev, { role: 'ai', content: aiText || t.ai.sorry }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: t.ai.error }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] text-gray-900">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 right-0 w-[400px] bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/20 border border-gray-100 overflow-hidden flex flex-col h-[600px]"
          >
            <div className="bg-blue-600 p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h4 className="font-black text-lg leading-none">{t.ai.name}</h4>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> {t.ai.status}
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
              <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl text-sm font-medium leading-relaxed max-w-[85%]">
                {t.ai.greeting}
              </div>
              
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed max-w-[85%] ${
                    m.role === 'user' ? 'bg-gray-100 text-gray-900' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-blue-50 p-4 rounded-2xl flex gap-1 items-center">
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t.ai.placeholder}
                className="flex-1 bg-gray-50 border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 relative"
      >
        <MessageSquare size={32} />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce"></div>
      </motion.button>
    </div>
  );
};

// --- Main App ---

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const { t } = useLanguage();
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      title: "কুফর তাকফির বিদআত-প্রান্তিকতা ও ভারসাম্যহীনতা",
      author: "মূল: শায়খ সালিহ আল ফাওযান",
      category: "Islam",
      isbn: "978-0133836790",
      description: "Islamic study on various aspects.",
      cover: "https://www.rokomari.com/static/200/products/n/357908_1701323385.jpg",
      totalCopies: 10,
      availableCopies: 8,
      location: "Shelf A1"
    },
    {
      id: "2",
      title: "নিদৃত শুভকামনা",
      author: "কামরুল আহসান",
      category: "General",
      isbn: "978-1305971493",
      description: "General literature.",
      cover: "https://www.rokomari.com/static/200/products/n/357909_1701323385.jpg",
      totalCopies: 15,
      availableCopies: 12,
      location: "Shelf A2"
    },
    {
      id: "3",
      title: "ফেরারি সময়",
      author: "সৈয়দ রানা",
      category: "Poetry",
      isbn: "978-1107146525",
      description: "A collection of poems.",
      cover: "https://www.rokomari.com/static/200/products/n/357910_1701323385.jpg",
      totalCopies: 5,
      availableCopies: 5,
      location: "Shelf A3"
    },
    {
      id: "4",
      title: "দাস হয়েও মহা মনীষী যারা",
      author: "মাওলানা সাঈদ আহমদ",
      category: "Islam",
      isbn: "978-0691235899",
      description: "Biographies of great personalities.",
      cover: "https://www.rokomari.com/static/200/products/n/357911_1701323385.jpg",
      totalCopies: 8,
      availableCopies: 3,
      location: "Shelf B1"
    },
    {
      id: "5",
      title: "বিশ্বায়নের যুগে ইসলাম উৎসাহ এবং সত্যতা",
      author: "প্রফেসর ড. সৈয়দ কামরুল",
      category: "Islam",
      isbn: "978-0070108134",
      description: "Islam in the era of globalization.",
      cover: "https://www.rokomari.com/static/200/products/n/357912_1701323385.jpg",
      totalCopies: 12,
      availableCopies: 10,
      location: "Shelf B2"
    }
  ]);
  const [donors, setDonors] = useState<Donor[]>([
    { id: '1', name: 'Dr. Md. Shahjahan', role: 'Chief Advisor', amount: '৳৫০০০/মাস', verified: true, img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', email: 'shajahan@mbstu.ac.bd' },
    { id: '2', name: 'Tahmid Ahmed', role: 'Gold Member', amount: '৳২০০০/মাস', verified: true, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', email: 'tahmid@gmail.com' },
    { id: '3', name: 'Sabrina Akter', role: 'Silver Member', amount: '৳১০০০/মাস', verified: true, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: '4', name: 'Mehedi Hasan', role: 'Donor', amount: '৳৫০০/মাস', verified: false, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  ]);
  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [news, setNews] = useState<NewsItem[]>([
    { id: '1', title: 'Library Hours Extended', content: 'We are now open until 8 PM on weekdays.', date: '2026-05-10', category: 'Update', important: true },
    { id: '2', title: 'New Economics Journals Arrived', content: 'The latest issues of Econometrica are now available.', date: '2026-05-09', category: 'Notice', important: false },
  ]);
  const [loading, setLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedBooks = localStorage.getItem('econ_library_books');
    if (savedBooks) setBooks(JSON.parse(savedBooks));
    
    const savedDonors = localStorage.getItem('econ_library_donors');
    if (savedDonors) setDonors(JSON.parse(savedDonors));
    
    const savedNews = localStorage.getItem('econ_library_news');
    if (savedNews) setNews(JSON.parse(savedNews));
  }, []);

  // Save to localStorage when states change
  useEffect(() => {
    localStorage.setItem('econ_library_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('econ_library_donors', JSON.stringify(donors));
  }, [donors]);

  useEffect(() => {
    localStorage.setItem('econ_library_news', JSON.stringify(news));
  }, [news]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeAuthor, setActiveAuthor] = useState('All');
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [cart, setCart] = useState<Book[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookPaymentModalOpen, setIsBookPaymentModalOpen] = useState(false);

  const handleAddToCart = (book: Book) => {
    if (!cart.find(item => item.id === book.id)) {
      setCart([...cart, book]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error('Not logged in');
    }
  };

  const fetchBooks = async (query = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/books${query ? `?query=${query}` : ''}`);
      if (!res.ok) throw new Error('API not available');
      const data = await res.json();
      if (Array.isArray(data)) setBooks(data);
    } catch (err) {
      console.warn('API error, using local data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('API not available');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.warn('API error, using default stats:', err);
      setStats({
        totalBooks: 4500,
        activeMembers: 1200,
        dailyVisitors: 85,
        newArrivals: 12
      });
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchStats();
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const handleSearch = (q: string) => fetchBooks(q);

  const categories = ['All', 'Economics', 'Microeconomics', 'Macroeconomics', 'Econometrics', 'Islam', 'Science Fiction', 'Poetry'];

  const filteredBooks = books.filter(b => {
    const categoryMatch = activeCategory === 'All' || b.category === activeCategory;
    const authorMatch = activeAuthor === 'All' || b.author === activeAuthor;
    return categoryMatch && authorMatch;
  });

  const authors = ['All', ...Array.from(new Set(books.map(b => b.author)))].slice(0, 10);

  const titleMap: Record<Page, string> = {
    home: t.nav.home,
    books: t.nav.books,
    events: t.nav.events,
    shop: t.nav.buyBook,
    donors: t.nav.donors,
    incomeExpense: t.nav.incomeExpense
  };

  if (isAdminDashboardOpen && user?.role === 'admin') {
    return (
      <AdminDashboard 
        onBack={() => setIsAdminDashboardOpen(false)}
        user={user}
        onLogout={() => {
          handleLogout();
          setIsAdminDashboardOpen(false);
        }}
        books={books}
        onUpdateBooks={setBooks}
        donors={donors}
        onUpdateDonors={setDonors}
        news={news}
        onUpdateNews={setNews}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-700">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onLoginClick={() => setIsLoginModalOpen(true)} 
        onJoinClick={() => setIsMembershipModalOpen(true)}
        onDashboardClick={() => setIsAdminDashboardOpen(true)}
        cartCount={cart.length}
        onCartClick={() => setIsCartOpen(true)}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[110] flex justify-end">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsCartOpen(false)}
               className="absolute inset-0 bg-gray-900/20 backdrop-blur-[2px]"
             />
             <motion.div 
               initial={{ x: '100%' }}
               animate={{ x: 0 }}
               exit={{ x: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
             >
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#5D5FEF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#5D5FEF]/20">
                       <ShoppingBag size={20} />
                     </div>
                     <h2 className="text-xl font-black text-gray-900">{t.book.cartTitle}</h2>
                   </div>
                   <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                   {cart.length === 0 ? (
                     <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
                           <ShoppingBag size={40} />
                        </div>
                        <p className="text-gray-400 font-bold">{t.book.emptyCart}</p>
                     </div>
                   ) : (
                     cart.map(item => (
                       <div key={item.id} className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl group">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-20 bg-white rounded-lg overflow-hidden shadow-sm shrink-0">
                               <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                               <h4 className="text-sm font-black text-gray-900 line-clamp-1">{item.title}</h4>
                               <p className="text-xs text-gray-400 font-bold mb-2">{item.author}</p>
                               <span className="text-[9px] font-black uppercase tracking-widest text-[#5D5FEF] bg-[#5D5FEF]/5 px-2 py-0.5 rounded-md">
                                 {item.category}
                               </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                     ))
                   )}
                </div>

                {cart.length > 0 && (
                  <div className="p-8 border-t border-gray-100">
                     <button 
                       onClick={() => {
                         setIsCartOpen(false);
                         setIsBookPaymentModalOpen(true);
                       }}
                       className="w-full bg-[#5D5FEF] text-white py-5 rounded-2xl font-black text-sm hover:bg-[#4D4FDB] transition-all shadow-xl shadow-[#5D5FEF]/20 flex items-center justify-center gap-2"
                     >
                        {t.book.checkout} <ArrowRight size={18} />
                     </button>
                  </div>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BookDetailModal 
        isOpen={!!selectedBook} 
        onClose={() => setSelectedBook(null)} 
        book={selectedBook}
        onAddToCart={handleAddToCart}
        isInCart={!!selectedBook && !!cart.find(item => item.id === selectedBook.id)}
        user={user}
      />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={(u) => {
          setUser(u);
          if (u.role === 'admin') setIsAdminDashboardOpen(true);
        }} 
        onJoinClick={() => setIsMembershipModalOpen(true)}
      />

      <MembershipModal
        isOpen={isMembershipModalOpen}
        onClose={() => setIsMembershipModalOpen(false)}
        onLoginClick={() => setIsLoginModalOpen(true)}
      />

      <BookPaymentModal
        isOpen={isBookPaymentModalOpen}
        onClose={() => setIsBookPaymentModalOpen(false)}
        items={cart}
      />
      
      <AnimatePresence mode="wait">
        <motion.div
           key={currentPage}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.3 }}
        >
          {currentPage === 'home' && (
            <>
              <Hero 
                onSearch={(q) => {
                  handleSearch(q);
                  setCurrentPage('books');
                }} 
                onApplyClick={() => setIsMembershipModalOpen(true)}
                onLoginClick={() => setIsLoginModalOpen(true)}
                onBrowseClick={() => setCurrentPage('books')}
              />
              
              <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10 text-gray-900">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 bg-white p-10 md:p-14 rounded-[3.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100">
                  {[
                    { label: t.stats.totalBooks, value: stats?.totalBooks || 4500, icon: BookIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: t.stats.activeMembers, value: stats?.activeMembers || 1200, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: t.stats.dailyVisitors, value: stats?.dailyVisitors || 85, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: t.stats.newArrivals, value: stats?.newArrivals || 12, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center md:items-start group transition-all duration-300">
                      <div className={`${item.bg} ${item.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <item.icon size={28} strokeWidth={2} />
                      </div>
                      <h3 className="text-4xl font-black text-gray-900 tracking-tight mb-1">{item.value.toLocaleString()}</h3>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Features onShopClick={() => setCurrentPage('shop')} onEventsClick={() => setCurrentPage('events')} onCatalogClick={() => setCurrentPage('books')} />
              <CTASection onApplyClick={() => setIsMembershipModalOpen(true)} onListClick={() => setCurrentPage('donors')} />
            </>
          )}

          {currentPage === 'books' && (
            <section className="pt-44 pb-32 max-w-7xl mx-auto px-6">
              <div className="flex flex-col items-center text-center mb-20">
                <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">{t.book.collections}</h2>
                <p className="text-lg text-gray-500 max-w-2xl font-medium leading-relaxed">{t.book.collectionsDesc}</p>
              </div>
              
              {/* Search & Filter Controls */}
              <div className="flex flex-col gap-10 mb-20">
                <div className="max-w-2xl mx-auto w-full relative group">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5D5FEF] transition-colors" size={24} />
                   <input 
                     type="text" 
                     placeholder={t.hero.searchPlaceholder}
                     onChange={(e) => handleSearch(e.target.value)}
                     className="w-full bg-white border border-gray-100 rounded-[2.5rem] py-6 pl-16 pr-8 text-lg font-medium focus:ring-4 focus:ring-[#5D5FEF]/5 focus:border-[#5D5FEF] transition-all outline-none shadow-2xl shadow-gray-200/30"
                   />
                </div>
                
                <div className="space-y-8">
                  {/* Category Filter */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                          activeCategory === cat 
                            ? 'bg-[#5D5FEF] text-white shadow-lg shadow-[#5D5FEF]/20 scale-105' 
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {cat === 'All' ? t.book.all : 
                         cat === 'Economics' ? t.book.economics : 
                         cat === 'Microeconomics' ? t.book.microeconomics : 
                         cat === 'Macroeconomics' ? t.book.macroeconomics : 
                         cat === 'Econometrics' ? t.book.econometrics : cat}
                      </button>
                    ))}
                  </div>

                  {/* Author Filter */}
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t.book.by}</span>
                    <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
                      {authors.map(author => (
                        <button
                          key={author}
                          onClick={() => setActiveAuthor(author)}
                          className={`px-5 py-2.5 rounded-xl text-[11px] font-bold border transition-all ${
                            activeAuthor === author
                              ? 'bg-gray-900 text-white border-gray-900 shadow-lg'
                              : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300'
                          }`}
                        >
                          {author}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-900 mb-20">
                  {Array.from({ length: 8 }).map((_, i) => <div key={i} className="animate-pulse bg-gray-100 aspect-[2/3] rounded-[2.5rem]"></div>)}
                </div>
              ) : (
                <div className="space-y-32">
                   {/* Categorized Sliders */}
                   {['Economics', 'Microeconomics', 'Macroeconomics', 'Econometrics', 'Islam', 'Science Fiction', 'Poetry']
                     .filter(cat => activeCategory === 'All' || activeCategory === cat)
                     .map(cat => {
                       const catBooks = books.filter(b => b.category === cat);
                       if (catBooks.length === 0) return null;
                       
                       return (
                         <div key={cat} className="group/section">
                           <div className="flex items-center justify-between mb-10">
                             <div className="flex items-center gap-4">
                                <div className="w-2 h-10 bg-[#5D5FEF] rounded-full"></div>
                                <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                                  {cat === 'Economics' ? t.book.economics : 
                                   cat === 'Microeconomics' ? t.book.microeconomics : 
                                   cat === 'Macroeconomics' ? t.book.macroeconomics : 
                                   cat === 'Econometrics' ? t.book.econometrics : cat}
                                </h3>
                             </div>
                             <button className="text-sm font-black text-gray-400 hover:text-[#5D5FEF] uppercase tracking-widest transition-colors flex items-center gap-2 group">
                               {t.nav.more} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                             </button>
                           </div>
                           
                           <div className="relative">
                             <div className="flex overflow-x-auto gap-8 pb-10 scrollbar-hide snap-x -mx-4 px-4">
                               {catBooks.map((book) => (
                                 <motion.div 
                                   key={book.id}
                                   layoutId={`book-card-${book.id}`}
                                   whileHover={{ y: -8 }}
                                   className="min-w-[280px] md:min-w-[calc(25%-1.5rem)] snap-start group bg-white rounded-[2.5rem] p-5 shadow-xl shadow-gray-200/30 hover:shadow-2xl hover:shadow-gray-200/50 transition-all border border-gray-50 flex flex-col h-full"
                                 >
                                   <div 
                                     onClick={() => handleAddToCart(book)}
                                     className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-gray-50 cursor-pointer group/img"
                                   >
                                     <motion.img 
                                       layoutId={`book-img-${book.id}`}
                                       src={book.cover} 
                                       alt={book.title} 
                                       className="w-full h-full object-cover transform group-hover/img:scale-105 transition-transform duration-700" 
                                     />
                                     <div className="absolute inset-0 bg-blue-600/0 group-hover/img:bg-blue-600/10 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                                        <div className="bg-white p-4 rounded-2xl shadow-2xl text-[#5D5FEF] font-black text-xs flex items-center gap-2">
                                          <ShoppingBag size={16} /> {t.book.addedToCart}
                                        </div>
                                     </div>
                                     <div className="absolute top-4 right-4 bg-[#00BA88] text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">
                                       {t.book.available}
                                     </div>
                                   </div>
                                   
                                   <div className="flex-1 px-2 pb-2">
                                     <div className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-widest mb-2 opacity-80">{book.category}</div>
                                     <h3 className="text-[17px] font-black text-gray-900 mb-1.5 leading-tight line-clamp-2">{book.title}</h3>
                                     <p className="text-[12px] text-gray-400 font-bold mb-6">{book.author}</p>
                                   </div>
                                   
                                   <button 
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setSelectedBook(book);
                                     }}
                                     className="w-full py-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg bg-[#101828] text-white hover:bg-gray-800 shadow-gray-900/10"
                                   >
                                     <Clock size={16} /> {t.book.prebook}
                                   </button>
                                 </motion.div>
                               ))}
                             </div>
                           </div>
                         </div>
                       );
                   })}
                   
                   {/* Lazy Load Experience - show more items in grid after sliders */}
                   <div className="pt-10">
                      <div className="flex items-center gap-4 mb-16">
                        <div className="w-2 h-10 bg-gray-200 rounded-full"></div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">Other Collections</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                         {books.slice(0, 8).map(book => (
                           <motion.div 
                             key={`other-${book.id}`}
                             whileHover={{ y: -8 }}
                             className="group bg-white rounded-[2.5rem] p-5 shadow-xl shadow-gray-200/30 hover:shadow-2xl hover:shadow-gray-200/50 transition-all border border-gray-50 flex flex-col h-full"
                           >
                             <div 
                               onClick={() => handleAddToCart(book)}
                               className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-gray-50 cursor-pointer group/img"
                             >
                                <img src={book.cover} alt={book.title} className="w-full h-full object-cover transform group-hover/img:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-blue-600/0 group-hover/img:bg-blue-600/10 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                                    <div className="bg-white p-4 rounded-2xl shadow-2xl text-[#5D5FEF] font-black text-xs flex items-center gap-2">
                                      <ShoppingBag size={16} /> {t.book.addedToCart}
                                    </div>
                                 </div>
                             </div>
                             <div className="flex-1 px-2 pb-2">
                               <div className="text-[10px] font-black text-[#5D5FEF] uppercase tracking-widest mb-2 opacity-80">{book.category}</div>
                               <h3 className="text-[17px] font-black text-gray-900 mb-1.5 leading-tight line-clamp-2">{book.title}</h3>
                               <p className="text-[12px] text-gray-400 font-bold mb-6">{book.author}</p>
                             </div>
                             <button 
                               onClick={() => setSelectedBook(book)}
                               className="w-full py-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg bg-[#101828] text-white hover:bg-gray-800 shadow-gray-900/10"
                             >
                               <Clock size={16} /> {t.book.prebook}
                             </button>
                           </motion.div>
                         ))}
                      </div>
                      
                      <div className="mt-20 flex justify-center">
                         <button className="bg-gray-50 text-gray-500 border border-gray-100 px-10 py-4 rounded-2xl font-black text-sm hover:bg-white hover:border-[#5D5FEF]/30 hover:text-[#5D5FEF] transition-all shadow-sm">
                           Load More Resources
                         </button>
                      </div>
                   </div>
                </div>
              )}
            </section>
          )}

          {currentPage === 'events' && <EventsPage />}
          {currentPage === 'shop' && <ShopPage />}
          {currentPage === 'donors' && <DonorWallPage donors={donors} />}
          {currentPage === 'incomeExpense' && <IncomeExpensePage />}
        </motion.div>
      </AnimatePresence>

      <footer id="contact" className="bg-white border-t border-gray-100 pt-24 pb-12 text-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <Library size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-lg leading-none">ECON LIBRARY</span>
                  <span className="text-[10px] font-black tracking-[0.2em] text-gray-400">MBSTU</span>
                </div>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed">
                {t.footer.desc}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8">{t.footer.quickLinks}</h4>
              <ul className="space-y-4 font-bold text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">{t.footer.archive}</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">{t.footer.research}</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors uppercase tracking-widest">{t.footer.registry}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8">{t.footer.contact}</h4>
              <ul className="space-y-4 text-gray-500 font-medium">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-600 shrink-0 mt-1" /> 
                  <span className="text-xs leading-relaxed">Economic Department, 6th Floor, Academic Building-3, MBSTU, Santosh, Tangail, 1902</span>
                </li>
                <li className="flex items-center gap-3"><Phone size={18} className="text-blue-600 shrink-0" /> 01880412129</li>
                <li className="flex items-center gap-3"><Mail size={18} className="text-blue-600 shrink-0" /> Eco24034@mbstu.com</li>
                  <li>
                    <button 
                      onClick={() => {
                        if (user?.role === 'admin') {
                          setIsAdminDashboardOpen(true);
                        } else {
                          setIsLoginModalOpen(true);
                        }
                      }}
                      className="text-[10px] text-gray-300 hover:text-gray-400 font-bold transition-colors cursor-pointer"
                    >
                      Error Report
                    </button>
                  </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-8">{t.footer.newsletter}</h4>
              <div className="flex gap-2">
                <input type="email" placeholder={t.footer.emailPlaceholder} className="bg-gray-50 border-none rounded-2xl px-5 py-4 w-full font-medium focus:ring-1 focus:ring-blue-500" />
                <button className="bg-blue-600 p-4 rounded-2xl text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="text-center text-xs font-black text-gray-400 uppercase tracking-widest pt-12 border-t border-gray-50">
            {t.footer.copyright}
          </div>
        </div>
      </footer>

      <AIAssistant />
    </div>
  );
}
