# MSP AI Web Chat

Полноценный веб-интерфейс ИИ-чата на React + Vite + Vercel Serverless Function.
Пользователь пишет сообщение на сайте, `/api/chat` обращается к OpenAI API и возвращает ответ.

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
4. В настройках проекта Vercel открой **Settings -> Environment Variables**.
5. Добавь переменную:
   - Name: `OPENAI_API_KEY`
   - Value: твой OpenAI API key
6. При желании добавь модель:
   - Name: `OPENAI_MODEL`
   - Value: `gpt-4.1-mini`
7. Vercel сам определит Vite. Если нужно вручную:
   - Build Command: `npm run build`
   - Output Directory: `dist`

После добавления переменных сделай **Redeploy**.

Важно: не добавляй API-ключ в GitHub и не вставляй его в frontend-код.
