import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { MessageCircle, X, Send, User, Bot } from 'lucide-react';
import { sendMessageToGemini } from '@/services/geminiService';
import { ChatMessage } from '@/types';
import { analytics } from '@/utils/analytics';
import { useLanguage } from '@/contexts/LanguageContext';
import { logger } from '@/utils/logger';
import { TIMEOUTS } from '@/constants';

const ChatWidget: React.FC = () => {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Memoized welcome message (always show normal message - demo mode handled server-side)
  const welcomeMessage = useMemo(() => {
    return language === 'ar' 
      ? "مرحبا! 👋 أنا ODMSYNC من دعم ODM. بدك مساعدة مع الباقات، التغطية، أو إصلاح الواي فاي؟"
      : "Hi! 👋 I'm ODMSYNC from ODM Support. Need help with plans, coverage, or fixing Wi-Fi?";
  }, [language]);

  // State initialization with memoized welcome message
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 'init-1', role: 'model', text: welcomeMessage, timestamp: Date.now() }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Optimized scroll function with animation frame
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, []);

  // Throttled scroll effect
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages.length, isOpen, scrollToBottom]);

  // Local Storage operations with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('odm_chat_history', JSON.stringify(messages));
    }, TIMEOUTS.CHAT_HISTORY_DEBOUNCE);
    return () => clearTimeout(timer);
  }, [messages]);

  // Initial load with error boundary
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('odm_chat_history');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Batch update to prevent multiple renders
          setMessages(prev => {
            const existingIds = new Set(prev.map(m => m.id));
            const newMessages = parsed.filter(
              (m): m is ChatMessage => 
                m && 
                typeof m === 'object' && 
                'id' in m && 
                'text' in m &&
                !existingIds.has(m.id)
            );
            return newMessages.length > 0 ? [...prev, ...newMessages] : prev;
          });
        }
      }
    } catch (e) {
      logger.error('Failed to parse chat history', e);
      // Silently fail in production - history will be empty, which is fine
    }
  }, []);

  // Memoized toggle function
  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev;
      if (newState) {
        analytics.track('chat_opened');
      }
      return newState;
    });
  }, []);

  // Keyboard event listener with optimized cleanup
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Focus management with raf
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isOpen]);

  // Optimized message handler with batched updates
  const handleSend = useCallback(async (textOverride?: string) => {
    const messageText = textOverride || input;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: messageText,
      timestamp: Date.now()
    };
    
    analytics.track('chat_message_sent', { 
      length: messageText.length, 
      role: 'user' 
    });

    // Batch user message and loading state
    setIsLoading(true);
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const responseText = await sendMessageToGemini(
        userMsg.text, 
        [...messages, userMsg] // Use most recent messages
      );
      
      const modelMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'model',
        text: language === 'ar' 
          ? "⚠️ عذرًا، يوجد مشكلة في الاتصال بالسيرفر حاليًا. يرجى المحاولة مرة أخرى لاحقًا."
          : "⚠️ Sorry, I'm having trouble connecting to the server right now. Please try again in a moment.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
      
      analytics.track('chat_error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, language]);

  // Memoized quick actions
  const quickActions = useMemo(() => [
    { label: '📶 Coverage', text: language === 'ar' ? 'هل تغطي منطقتي؟' : 'Do you cover my area?' },
    { label: '💡 Plans', text: language === 'ar' ? 'ما هي الباقات المتوفرة؟' : 'What plans do you offer?' },
    { label: '⚙️ Slow WiFi', text: language === 'ar' ? 'الإنترنت بطيء، ساعدني!' : 'My internet is slow, help!' },
    { label: '📅 Install', text: language === 'ar' ? 'أريد حجز موعد للتركيب' : 'I want to book an installation.' }
  ], [language]);

  // Memoized chat header to prevent unnecessary re-renders
  const chatHeader = useMemo(() => (
    <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-4 text-white flex justify-between items-center shadow-md flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 id="chat-header" className="font-bold text-lg">ODMSYNC</h3>
          <p className="text-xs text-blue-100 flex items-center opacity-90">
            <>
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-1 animate-pulse"></span> 
              {language === 'ar' ? 'متصل 24/7' : 'Online 24/7'}
            </>
          </p>
        </div>
      </div>
      <button 
        onClick={() => setIsOpen(false)} 
        className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
        aria-label="Close chat window"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  ), [language]);

  return (
    <>
      {/* Trigger Button - Memoized component could be extracted */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
        <button
          onClick={toggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-xl transition-all transform hover:scale-105 flex items-center justify-center relative"
          aria-label={isOpen ? "Close chat" : "Open chat"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-24 right-6 z-50 w-[90%] md:w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[600px] h-[80vh] animate-fade-in-up"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-header"
        >
          {chatHeader}
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                role={msg.role} 
                language={language}
              />
            ))}
            
            {isLoading && <LoadingIndicator language={language} />}
            
            <div ref={messagesEndRef} />
          </div>

          {!isLoading && (
            <QuickActions 
              actions={quickActions} 
              onAction={handleSend} 
              language={language}
            />
          )}

          <InputArea
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            isLoading={isLoading}
            inputRef={inputRef}
            language={language}
          />
        </div>
      )}
    </>
  );
};

// Extracted component for message bubble
const MessageBubble = React.memo(({ 
  message,
  role,
  language
}: {
  message: ChatMessage,
  role: 'user' | 'model',
  language: string
}) => (
  <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
    {role === 'model' && (
      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mb-1">
        <Bot className="w-4 h-4 text-blue-600" />
      </div>
    )}
    <div
      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm whitespace-pre-wrap ${
        role === 'user'
          ? 'bg-blue-600 text-white rounded-br-none'
          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
      }`}
    >
      {message.text}
    </div>
    {role === 'user' && (
      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mb-1">
        <User className="w-4 h-4 text-gray-500" />
      </div>
    )}
  </div>
));

MessageBubble.displayName = 'MessageBubble';

// Extracted component for loading indicator
const LoadingIndicator = React.memo(({ language }: { language: string }) => (
  <div className="flex justify-start items-end gap-2">
    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mb-1">
      <Bot className="w-4 h-4 text-blue-600" />
    </div>
    <div className="bg-white text-gray-500 px-4 py-3 rounded-2xl text-sm border border-gray-200 rounded-bl-none italic flex items-center gap-1">
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
      {language === 'ar' ? 'جاري الرد...' : 'Typing...'}
    </div>
  </div>
));

LoadingIndicator.displayName = 'LoadingIndicator';

// Extracted component for quick actions
const QuickActions = React.memo(({ 
  actions, 
  onAction,
  language
}: {
  actions: { label: string; text: string }[],
  onAction: (text: string) => void,
  language: string
}) => (
  <div className="px-4 py-2 bg-gray-50 overflow-x-auto flex gap-2 no-scrollbar flex-shrink-0 border-t border-gray-100">
    {actions.map((action, idx) => (
      <button 
        key={idx}
        onClick={() => onAction(action.text)}
        className="whitespace-nowrap px-3 py-1.5 bg-white border border-blue-200 rounded-full text-xs font-medium text-blue-700 hover:bg-blue-50 transition-colors flex-shrink-0 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {action.label}
      </button>
    ))}
  </div>
));

QuickActions.displayName = 'QuickActions';

// Extracted component for input area
const InputArea = React.memo(({ 
  input, 
  setInput, 
  handleSend, 
  isLoading, 
  inputRef,
  language
}: {
  input: string,
  setInput: (value: string) => void,
  handleSend: () => void,
  isLoading: boolean,
  inputRef: React.RefObject<HTMLInputElement | null>,
  language: string
}) => (
  <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-2 flex-shrink-0">
    <input
      ref={inputRef}
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
      }}
      placeholder={language === 'ar' ? "كيف يمكننا مساعدتك؟ اكتب هنا..." : "How can we help? Type here..."}
      aria-label="Message input"
      className="flex-1 bg-gray-100 border-0 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
    />
    <button 
      onClick={handleSend}
      disabled={isLoading || !input.trim()}
      aria-label={language === 'ar' ? "إرسال الرسالة" : "Send message"}
      className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <Send className="w-5 h-5 ml-0.5" />
    </button>
  </div>
));

InputArea.displayName = 'InputArea';

ChatWidget.displayName = 'ChatWidget';

export default React.memo(ChatWidget);
