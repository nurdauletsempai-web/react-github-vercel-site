import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Code2,
  Github,
  Globe,
  LayoutDashboard,
  Rocket,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Zap,
} from 'lucide-react';
import './styles.css';

const stats = [
  { label: 'Компонентов', value: '12', icon: LayoutDashboard },
  { label: 'Готовность', value: '98%', icon: CheckCircle2 },
  { label: 'Деплой', value: '< 1 мин', icon: Rocket },
];

const steps = [
  {
    title: 'React frontend',
    text: 'Компонентная структура, адаптивная сетка и быстрый Vite-билд.',
    icon: Code2,
    status: 'Готово',
  },
  {
    title: 'GitHub repo',
    text: 'Проект подготовлен для загрузки в репозиторий без лишних файлов.',
    icon: Github,
    status: 'Следующий шаг',
  },
  {
    title: 'Vercel deploy',
    text: 'Конфиг Vercel уже добавлен: build command и output directory настроены.',
    icon: UploadCloud,
    status: 'Настроено',
  },
];

const features = [
  'Адаптивная верстка для телефона, планшета и десктопа',
  'Готовые секции для описания проекта, статуса и деплоя',
  'Чистый UI без тяжёлых библиотек и сложной настройки',
  'Поддержка SPA-роутинга через Vercel rewrites',
];

function App() {
  return (
    <main className="app">
      <section className="hero" aria-labelledby="page-title">
        <div className="hero__image" aria-hidden="true" />
        <nav className="nav" aria-label="Главная навигация">
          <a className="brand" href="#top" aria-label="React GitHub Vercel">
            <span className="brand__mark">
              <Zap size={18} />
            </span>
            <span>React GitHub Vercel</span>
          </a>
          <div className="nav__links">
            <a href="#workflow">Процесс</a>
            <a href="#deploy">Деплой</a>
            <a href="#ready">Готовность</a>
          </div>
        </nav>

        <div className="hero__content" id="top">
          <div className="eyebrow">
            <Sparkles size={16} />
            Frontend ready for production
          </div>
          <h1 id="page-title">Сайт на React для GitHub и Vercel</h1>
          <p>
            Аккуратный адаптивный фронтенд с готовой структурой проекта,
            настройками сборки и страницей, которую можно сразу разворачивать.
          </p>
          <div className="hero__actions">
            <a className="button button--primary" href="#deploy">
              <Rocket size={18} />
              Деплой
            </a>
            <a className="button button--ghost" href="#workflow">
              <ArrowUpRight size={18} />
              Структура
            </a>
          </div>
        </div>
      </section>

      <section className="stats" aria-label="Ключевые показатели">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <article className="stat" key={item.label}>
              <Icon size={22} />
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          );
        })}
      </section>

      <section className="section section--split" id="workflow">
        <div className="section__intro">
          <span className="section__label">Workflow</span>
          <h2>От кода до опубликованного сайта</h2>
          <p>
            Страница собрана как практичный интерфейс проекта: заметный первый
            экран, блок статусов, понятный сценарий публикации и аккуратные
            состояния для будущего расширения.
          </p>
        </div>
        <div className="timeline">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article className="timeline__item" key={step.title}>
                <div className="timeline__icon">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="timeline__top">
                    <h3>{step.title}</h3>
                    <span>{step.status}</span>
                  </div>
                  <p>{step.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section deploy" id="deploy">
        <div className="deploy__panel">
          <div>
            <span className="section__label">Vercel</span>
            <h2>Настройки уже внутри проекта</h2>
          </div>
          <div className="deploy__grid">
            <div>
              <span>Framework</span>
              <strong>Vite</strong>
            </div>
            <div>
              <span>Build</span>
              <strong>npm run build</strong>
            </div>
            <div>
              <span>Output</span>
              <strong>dist</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section ready" id="ready">
        <div className="ready__visual" aria-hidden="true">
          <Globe size={48} />
        </div>
        <div>
          <span className="section__label">Checklist</span>
          <h2>Готово к публикации</h2>
          <ul>
            {features.map((feature) => (
              <li key={feature}>
                <ShieldCheck size={18} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="ready__note">
          <Clock3 size={20} />
          <p>
            После загрузки на GitHub Vercel сможет собрать сайт автоматически.
          </p>
        </aside>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
