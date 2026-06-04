import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BarChart3,
  Bot,
  CheckCircle2,
  FileText,
  Home,
  Loader2,
  MessageSquare,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Zap,
} from 'lucide-react';
import './styles.css';

const welcomeMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Сәлем! Я полноценный веб-чат с ИИ. Можешь задавать вопросы, просить составить текст, таблицу, план, код или объяснение.',
};

const suggestions = [
  'Составь план проекта для практики',
  'Напиши текст для презентации',
  'Объясни тему простыми словами',
  'Сделай таблицу плюсов и минусов',
];

const sidebarItems = [
  { id: 'overview', label: 'Обзор системы', icon: Home },
  { id: 'chat', label: 'Интерфейс чата', icon: MessageSquare },
  { id: 'search', label: 'Глобальный поиск', icon: Search },
  { id: 'help', label: 'Справка и команды', icon: FileText },
  { id: 'analytics', label: 'Аналитика и QA', icon: BarChart3 },
];

const pages = {
  overview: {
    eyebrow: 'MSP AI',
    title: 'Обзор системы',
    text: 'Здесь можно быстро посмотреть состояние веб-чата, API и основные возможности проекта.',
    cards: ['React + Vite frontend', 'Vercel Serverless API', 'Gemini AI модель'],
  },
  search: {
    eyebrow: 'Поиск',
    title: 'Глобальный поиск',
    text: 'Этот раздел заготовлен под поиск по материалам, заметкам и ответам. Сейчас можно использовать чат для поиска и объяснений.',
    cards: ['Поиск по вопросам', 'Поиск по темам', 'Быстрые подсказки'],
  },
  help: {
    eyebrow: 'Помощь',
    title: 'Справка и команды',
    text: 'Примеры команд: составить план, объяснить тему, написать текст, сделать таблицу, проверить идею или код.',
    cards: ['Попроси краткий ответ', 'Уточни формат', 'Добавь контекст задачи'],
  },
  analytics: {
    eyebrow: 'Контроль',
    title: 'Аналитика и QA',
    text: 'Раздел для проверки качества ответов, статуса API и будущей статистики использования.',
    cards: ['API подключен через Gemini', 'Ключ хранится в Vercel', 'Frontend не видит секреты'],
  },
};

function InfoPage({ page }) {
  return (
    <section className="page-panel">
      <span className="section-label">{page.eyebrow}</span>
      <h1>{page.title}</h1>
      <p>{page.text}</p>
      <div className="page-grid">
        {page.cards.map((card) => (
          <article className="info-card" key={card}>
            <CheckCircle2 size={18} />
            <span>{card}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [activePage, setActivePage] = useState('chat');
  const [messages, setMessages] = useState([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const apiReady = useMemo(() => !error.includes('GEMINI_API_KEY'), [error]);

  useEffect(() => {
    if (activePage === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, activePage]);

  async function sendMessage(text = input) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setActivePage('chat');

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'ИИ не смог ответить. Попробуй еще раз.');
      }

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.answer,
        },
      ]);
    } catch (err) {
      setError(err.message);
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'Сейчас я не могу получить ответ от ИИ. Проверь переменную GEMINI_API_KEY в Vercel и повтори запрос.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  function startNewChat() {
    setActivePage('chat');
    setMessages([welcomeMessage]);
    setInput('');
    setError('');
  }

  return (
    <main className="workspace">
      <aside className="sidebar" aria-label="Навигация">
        <div className="brand">
          <div className="brand__mark">
            <Bot size={22} />
          </div>
          <div>
            <strong>MSP AI</strong>
            <span>Web Assistant</span>
          </div>
        </div>

        <button className="new-chat" onClick={startNewChat}>
          <Plus size={18} />
          Жаңа сөйлесу
        </button>
<nav className="menu">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={activePage === item.id ? 'active' : ''}
                key={item.id}
                onClick={() => setActivePage(item.id)}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="sidebar__status">
          <span />
          Локальный веб-чат активен
        </div>
      </aside>

      <section className="chat">
        <header className="chat__header">
          <div>
            <span className="section-label">Контекстный помощник</span>
            <h1>MSP AI Chat</h1>
          </div>
          <div className="header-actions">
            <button aria-label="Статус API" title={apiReady ? 'API готов' : 'Нужен API-ключ'}>
              <CheckCircle2 size={18} />
              <span>{apiReady ? 'API' : 'Key'}</span>
            </button>
            <button aria-label="Настройки" title="Настройки">
              <Settings size={18} />
            </button>
          </div>
        </header>

        {activePage === 'chat' ? (
          <>
            <div className="messages" aria-live="polite">
              <section className="intro">
                <div className="intro__icon">
                  <Sparkles size={26} />
                </div>
                <h2>Добро пожаловать</h2>
                <p>
                  Этот интерфейс работает как ИИ-бот в браузере: отправляешь вопрос,
                  серверная функция Vercel обращается к модели и возвращает ответ.
                </p>
                <div className="suggestions">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      disabled={isLoading}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </section>

              {messages.map((message) => (
                <article className={`message message--${message.role}`} key={message.id}>
                  <div className="avatar">
                    {message.role === 'assistant' ? <Zap size={16} /> : 'Вы'}
                  </div>
                  <div className="bubble">
                    {message.content.split('\n').map((line, index) => (
                      <p key={`${message.id}-${index}`}>{line || '\u00A0'}</p>
                    ))}
                  </div>
                </article>
              ))}

              {isLoading && (
                <article className="message message--assistant">
                  <div className="avatar">
                    <Zap size={16} />
                  </div>
                  <div className="bubble bubble--loading">
                    <Loader2 size={18} />
                    ИИ думает...
                  </div>
                </article>
              )}
              <div ref={messagesEndRef} />
            </div>

            {error && <div className="error">{error}</div>}

            <form className="composer" onSubmit={handleSubmit}>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Отправить сообщение MSP AI..."
                rows="1"
              />
              <button type="submit" disabled={isLoading || !input.trim()} aria-label="Отправить">
                {isLoading ? <Loader2 size={20} /> : <Send size={20} />}
              </button>
            </form>
          </>
        ) : (
          <div className="messages">
            <InfoPage page={pages[activePage]} />
          </div>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
