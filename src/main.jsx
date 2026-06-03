          content:
            'I cannot get an AI answer right now. Check OPENAI_API_KEY in Vercel and try again.',
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
      <aside className="sidebar" aria-label="Navigation">
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
          New chat
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
          Web chat is active
        </div>
      </aside>

      <section className="chat">
        <header className="chat__header">
          <div>
            <span className="section-label">Context assistant</span>
            <h1>MSP AI Chat</h1>
          </div>
          <div className="header-actions">
            <button aria-label="API status" title={apiReady ? 'API ready' : 'API key required'}>
              <CheckCircle2 size={18} />
              <span>{apiReady ? 'API' : 'Key'}</span>
            </button>
            <button aria-label="Settings" title="Settings">
              <Settings size={18} />
            </button>
          </div>
        </header>

        <div className="messages" aria-live="polite">
          <section className="intro">
            <div className="intro__icon">
              <Sparkles size={26} />
            </div>
            <h2>Welcome</h2>
            <p>
              This interface works like an AI bot in the browser: you send a question,
              the Vercel server function calls the model and returns an answer.
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
                {message.role === 'assistant' ? <Zap size={16} /> : 'You'}
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
                AI is thinking...
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
            placeholder="Send a message to MSP AI..."
            rows="1"
          />
          <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send">
            {isLoading ? <Loader2 size={20} /> : <Send size={20} />}
          </button>
        </form>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
