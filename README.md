# React GitHub Vercel Site

Готовый фронтенд на React + Vite для публикации на GitHub и деплоя в Vercel.

## Запуск локально

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Деплой на Vercel

1. Создай репозиторий на GitHub.
2. Загрузи файлы проекта в репозиторий.
3. В Vercel выбери **Add New Project** и импортируй этот репозиторий.
4. Vercel сам определит Vite. Если нужно вручную:
   - Build Command: `npm run build`
   - Output Directory: `dist`

Файл `vercel.json` уже добавлен.
