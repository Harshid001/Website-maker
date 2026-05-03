import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  Bot,
  BookmarkPlus,
  Check,
  Copy,
  Loader2,
  Mic,
  Paperclip,
  RefreshCcw,
  Save,
  Send,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import {
  clearChatHistory,
  fetchChatHistory as fetchChatHistoryRequest,
  saveChatOutput,
  sendChatMessage,
} from '../../services/chatService';

const MODEL_OPTIONS = [
  { label: 'OpenAI GPT', value: 'openai' },
  { label: 'Gemini', value: 'gemini' },
  { label: 'Claude', value: 'claude' },
  { label: 'Local Model', value: 'local' },
];

const CATEGORY_OPTIONS = [
  'Website Builder',
  '2D Design',
  'Animation',
  '3D Design',
  'Business Strategy',
  'Marketing Content',
  'Project Planning',
  'UI/UX Improvement',
  'Code Help',
  'General Chat',
];

const PROMPT_CHIPS = [
  'Create a website plan for my shop',
  'Suggest a landing page for my business',
  'Generate 2D poster ideas',
  'Create animation ideas for my brand',
  'Help me improve my project',
  'Create content for my homepage',
];

const DEFAULT_PROJECT_CONTEXT = {
  projectName: '',
  businessType: '',
  targetAudience: '',
  designStyle: '',
  goal: '',
};

const CONTEXT_FIELDS = [
  { key: 'projectName', label: 'Project Name', placeholder: 'Radhe Jewellers' },
  { key: 'businessType', label: 'Business Type', placeholder: 'Jewellery Shop' },
  { key: 'targetAudience', label: 'Target Audience', placeholder: 'Local customers' },
  { key: 'designStyle', label: 'Design Style', placeholder: 'Black and white premium' },
  { key: 'goal', label: 'Goal', placeholder: 'Generate leads and build trust' },
];

const formatTimestamp = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getModelLabel = (value) => {
  return MODEL_OPTIONS.find((option) => option.value === value)?.label || 'ShopCraft AI';
};

function EmptyState({ onPromptClick }) {
  return (
    <div className="h-full flex items-center justify-center px-4 py-10">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-cyan-400 flex items-center justify-center shadow-2xl shadow-indigo-500/20">
          <Sparkles className="text-white" size={28} />
        </div>
        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-3">
          Start building with ShopCraft AI
        </h3>
        <p className="text-slate-400 font-medium leading-relaxed mb-8">
          Ask anything about your website, design, animation, 3D visuals, or business idea.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {PROMPT_CHIPS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onPromptClick(prompt)}
              className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs md:text-sm font-bold hover:text-white hover:border-indigo-400/50 hover:bg-indigo-500/10 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-2xl bg-slate-800 border border-white/[0.08] flex items-center justify-center">
        <Bot className="text-cyan-300" size={18} />
      </div>
      <div className="px-5 py-4 rounded-3xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-2">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse"
            style={{ animationDelay: `${dot * 140}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  index,
  selectedModel,
  onCopy,
  onRegenerate,
  onSave,
  onUseAsPrompt,
}) {
  const isUser = message.role === 'user';
  const modelLabel = getModelLabel(message.modelProvider || selectedModel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[92%] md:max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] ${isUser ? 'text-indigo-200' : 'text-slate-500'}`}>
          <span>{isUser ? 'You' : modelLabel}</span>
          <span>{formatTimestamp(message.createdAt)}</span>
        </div>
        <div
          className={`whitespace-pre-wrap leading-relaxed text-sm md:text-[15px] ${
            isUser
              ? 'bg-gradient-to-br from-violet-600 to-blue-600 text-white rounded-[1.5rem] rounded-tr-md px-5 py-4 shadow-lg shadow-indigo-600/20'
              : 'bg-white/[0.05] border border-white/[0.08] text-slate-200 rounded-[1.5rem] rounded-tl-md px-5 py-4'
          }`}
        >
          {message.content}
        </div>
        {!isUser && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onCopy(message.content)}
              className="chat-action-button"
              title="Copy"
            >
              <Copy size={13} />
              Copy
            </button>
            <button
              type="button"
              onClick={() => onRegenerate(index)}
              className="chat-action-button"
              title="Regenerate"
            >
              <RefreshCcw size={13} />
              Regenerate
            </button>
            <button
              type="button"
              onClick={() => onSave(message)}
              className="chat-action-button"
              title="Save to Project"
            >
              <BookmarkPlus size={13} />
              Save
            </button>
            <button
              type="button"
              onClick={() => onUseAsPrompt(message.content)}
              className="chat-action-button"
              title="Use as Prompt"
            >
              <Sparkles size={13} />
              Use
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ProjectContextPanel({ projectContext, onChange, onSaveProject }) {
  return (
    <aside className="bg-slate-950/70 border border-white/[0.08] rounded-[1.5rem] p-5 xl:p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-white font-black uppercase tracking-tight text-lg">Project Context</h3>
          <p className="text-slate-500 text-xs font-bold mt-1">Sharper inputs for better answers</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-400/20 flex items-center justify-center">
          <Sparkles className="text-indigo-300" size={18} />
        </div>
      </div>

      <div className="space-y-4">
        {CONTEXT_FIELDS.map((field) => (
          <label key={field.key} className="block">
            <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 mb-2">
              {field.label}
            </span>
            <input
              value={projectContext[field.key]}
              onChange={(event) => onChange(field.key, event.target.value)}
              placeholder={field.placeholder}
              className="w-full bg-slate-900/80 border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white outline-none placeholder:text-slate-700 focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </label>
        ))}
      </div>

      <button
        type="button"
        onClick={onSaveProject}
        className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white text-slate-950 font-black uppercase tracking-[0.18em] text-[10px] hover:bg-cyan-100 transition-all active:scale-[0.98]"
      >
        <Save size={15} />
        Save Project
      </button>
    </aside>
  );
}

export default function ShopCraftAIChat() {
  const { user } = useContext(AuthContext);
  const userId = user?._id || user?.id || 'demo-user-id';
  const projectId = useMemo(() => `dashboard-ai-${userId}`, [userId]);
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('openai');
  const [selectedCategory, setSelectedCategory] = useState('Website Builder');
  const [projectContext, setProjectContext] = useState(DEFAULT_PROJECT_CONTEXT);
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const fetchChatHistory = useCallback(async () => {
    setHistoryLoading(true);
    setError('');
    try {
      const data = await fetchChatHistoryRequest(projectId, userId);
      const fetchedMessages = data.messages || [];
      setMessages(fetchedMessages);
      setChatHistory(fetchedMessages);
      if (data.projectContext) {
        setProjectContext((current) => ({ ...current, ...data.projectContext }));
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'AI is currently unavailable.');
    } finally {
      setHistoryLoading(false);
    }
  }, [projectId, userId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchChatHistory();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [fetchChatHistory]);

  const updateProjectContext = (field, value) => {
    setProjectContext((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const sendMessage = async (messageOverride) => {
    const messageText = (messageOverride || input).trim();
    if (!messageText || isLoading) return;

    const userMessage = {
      role: 'user',
      content: messageText,
      modelProvider: selectedModel,
      category: selectedCategory,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, userMessage]);
    setChatHistory((current) => [...current, userMessage]);
    setInput('');
    setError('');
    setNotice('');
    setIsLoading(true);

    try {
      const data = await sendChatMessage({
        userId,
        projectId,
        message: messageText,
        modelProvider: selectedModel,
        category: selectedCategory,
        projectContext,
      });

      const assistantMessage = {
        role: 'assistant',
        content: data.reply,
        modelProvider: data.modelProvider,
        category: data.category,
        createdAt: new Date().toISOString(),
      };

      setMessages((current) => [...current, assistantMessage]);
      setChatHistory((current) => [...current, assistantMessage]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'AI is currently unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    setError('');
    setNotice('');
    try {
      await clearChatHistory(projectId, userId);
      setMessages([]);
      setChatHistory([]);
      setNotice('Chat cleared.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not clear chat.');
    }
  };

  const copyMessage = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      setNotice('Copied.');
    } catch {
      setError('Could not copy this response.');
    }
  };

  const regenerateResponse = (assistantIndex) => {
    const previousUserMessage = [...messages]
      .slice(0, assistantIndex)
      .reverse()
      .find((message) => message.role === 'user');

    if (previousUserMessage) {
      sendMessage(previousUserMessage.content);
    }
  };

  const saveOutput = async (message, override = {}) => {
    setError('');
    setNotice('');
    try {
      await saveChatOutput({
        userId,
        projectId,
        title: override.title || `${selectedCategory} AI Output`,
        content: override.content || message.content,
        category: override.category || message.category || selectedCategory,
        type: override.type || 'ai-output',
      });
      setNotice('Saved to project.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save AI output.');
    }
  };

  const saveProjectContext = () => {
    const content = CONTEXT_FIELDS
      .map((field) => `${field.label}: ${projectContext[field.key] || 'Not provided'}`)
      .join('\n');

    saveOutput(
      { content, category: selectedCategory },
      {
        title: projectContext.projectName || 'Project Context',
        content,
        type: 'project-context',
      }
    );
  };

  const useAsPrompt = (content) => {
    setInput(content);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-indigo-950/40">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
      <div className="absolute -top-32 right-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative p-4 md:p-5 xl:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-5">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 via-violet-600 to-cyan-400 flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Bot className="text-white" size={27} />
              <span className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-emerald-400 border-4 border-slate-900 shadow-lg shadow-emerald-400/40" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  ShopCraft AI Assistant
                </h3>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-[0.18em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  Online
                </span>
              </div>
              <p className="text-slate-400 text-sm md:text-base font-medium mt-1">
                Discuss your project, generate ideas, and build faster with AI
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:min-w-[420px]">
            <label className="block">
              <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 mb-2">
                AI Model
              </span>
              <select
                value={selectedModel}
                onChange={(event) => setSelectedModel(event.target.value)}
                className="w-full bg-slate-950/80 border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                {MODEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-slate-500 mb-2">
                Category
              </span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="w-full bg-slate-950/80 border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-400/70 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                {CATEGORY_OPTIONS.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {CATEGORY_OPTIONS.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.16em] border transition-all ${
                selectedCategory === category
                  ? 'bg-indigo-500 text-white border-indigo-300/50 shadow-lg shadow-indigo-500/20'
                  : 'bg-white/[0.03] text-slate-500 border-white/[0.07] hover:text-white hover:border-indigo-400/40'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid xl:grid-cols-[minmax(0,1fr)_340px] gap-5">
          <div className="min-h-[620px] h-[68vh] max-h-[720px] flex flex-col rounded-[1.5rem] border border-white/[0.08] bg-slate-950/70 overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
              {historyLoading ? (
                <div className="h-full flex items-center justify-center text-slate-500">
                  <Loader2 className="animate-spin mr-3" size={20} />
                  <span className="text-xs font-black uppercase tracking-[0.18em]">Loading Chat</span>
                </div>
              ) : messages.length === 0 ? (
                <EmptyState onPromptClick={sendMessage} />
              ) : (
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <MessageBubble
                      key={`${message.role}-${message.createdAt}-${index}`}
                      message={message}
                      index={index}
                      selectedModel={selectedModel}
                      onCopy={copyMessage}
                      onRegenerate={regenerateResponse}
                      onSave={saveOutput}
                      onUseAsPrompt={useAsPrompt}
                    />
                  ))}
                  {isLoading && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <AnimatePresence>
              {(error || notice) && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className={`mx-4 md:mx-6 mb-3 px-4 py-3 rounded-2xl border flex items-center gap-3 text-xs font-bold ${
                    error
                      ? 'bg-red-500/10 border-red-400/20 text-red-200'
                      : 'bg-emerald-400/10 border-emerald-400/20 text-emerald-200'
                  }`}
                >
                  {error ? <AlertCircle size={16} /> : <Check size={16} />}
                  {error || notice}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="border-t border-white/[0.08] bg-slate-950/95 p-4 md:p-5">
              <div className="flex items-end gap-3 rounded-[1.5rem] bg-white/[0.04] border border-white/[0.08] p-3 focus-within:border-indigo-400/60 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <button
                  type="button"
                  onClick={() => setNotice('File attachments are prepared as a placeholder for the media upload endpoint.')}
                  className="input-icon-button"
                  title="Attach file"
                >
                  <Paperclip size={18} />
                </button>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  maxLength={4000}
                  placeholder="Ask ShopCraft AI about your project..."
                  className="min-h-[52px] max-h-36 flex-1 resize-none bg-transparent outline-none text-white placeholder:text-slate-600 text-sm md:text-base leading-relaxed py-2"
                />
                <button
                  type="button"
                  onClick={() => setNotice('Voice input is prepared as a placeholder for speech-to-text integration.')}
                  className="input-icon-button"
                  title="Voice input"
                >
                  <Mic size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/25 hover:scale-105 transition-all active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
                  title="Send"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={19} /> : <Send size={19} />}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                  {input.length}/4000 - {chatHistory.length} Messages
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={clearChat}
                    className="footer-action-button"
                  >
                    <Trash2 size={14} />
                    Clear Chat
                  </button>
                  <button
                    type="button"
                    onClick={saveProjectContext}
                    className="footer-action-button"
                  >
                    <Save size={14} />
                    Save Project
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ProjectContextPanel
            projectContext={projectContext}
            onChange={updateProjectContext}
            onSaveProject={saveProjectContext}
          />
        </div>
      </div>
    </div>
  );
}
