          content:
            'Сейчас я не могу получить ответ от ИИ. Проверь переменную OPENAI_API_KEY в Vercel и повтори запрос.',
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
              <button className={item.active ? 'active' : ''} key={item.label}>
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
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
