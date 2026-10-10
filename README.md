<div align="center">
  <img src="assets/promptshield-logo.jpg" alt="PromptShield logo" width="180" />
  <h1>PromptShield</h1>
  <p><strong>Catch possible secrets before you paste them into AI chats.</strong></p>
  <p>A local-first Chrome extension that scans text for common secret patterns and helps you redact matches before sharing.</p>
  <p>
    <a href="#english">🇬🇧 English</a> · <a href="#русский">🇷🇺 Русский</a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/version-0.2.0-9BEA4A?style=for-the-badge&labelColor=11151A" alt="Version 0.2.0" />
    <img src="https://img.shields.io/badge/Chrome-Manifest%20V3-9BEA4A?style=for-the-badge&labelColor=11151A" alt="Chrome Manifest V3" />
    <img src="https://img.shields.io/badge/license-MIT-9BEA4A?style=for-the-badge&labelColor=11151A" alt="MIT License" />
    <img src="https://img.shields.io/badge/scanning-local--first-9BEA4A?style=for-the-badge&labelColor=11151A" alt="Local-first scanning" />
  </p>
</div>

---

<div align="center">
  <img src="assets/promptshield-banner.jpg" alt="PromptShield promotional banner" width="100%" />
  <sub>Concept artwork for the project — not a Chrome Web Store listing or a screenshot of a verified production release.</sub>
</div>

> **Quick summary / Коротко:** PromptShield checks prompts for patterns that may be secrets, lets you review and redact matches, and runs its scanner locally in your browser. It is an experimental privacy helper, not a guarantee that a prompt is safe.

---

<a id="english"></a>

## 🇬🇧 English

### What is PromptShield?

It is easy to paste code, logs, or a stack trace into an AI chat and accidentally include an API key, token, password, or database credential. **PromptShield adds a checkpoint before sharing:** scan the text, review possible matches, and redact them first.

The project is open source and local-first. Prompt text is scanned by the extension in your browser; PromptShield does not need an account, a remote AI API, or its own backend server.

### Features

- **Local secret-pattern scanner** for common API-key and token formats, private keys, credential assignments, and database connection strings.
- **Masked findings** so detected values are not shown in full in the results list.
- **One-click redaction** that replaces matching spans with labels such as `[REDACTED_GITHUB_TOKEN]`.
- **Safer copying** that scans and redacts the current text before copying.
- **Experimental send warnings** on selected AI chat websites. Website interception is not guaranteed and may break when a site's interface changes.
- **No build step** for the current MVP — load the extension directly from the source folder.

### Install in Chrome

> The current version is installed manually from source. It is **not** published on the Chrome Web Store.

1. Download this repository as a ZIP and extract it, or clone it:

   ```bash
   git clone https://github.com/YOUR-USERNAME/promptshield.git
   ```

2. Open `chrome://extensions` in Chrome or a Chromium-based browser.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the project folder that contains `manifest.json`.
6. Open the PromptShield extension popup, paste **synthetic test text**, and click **Scan prompt**.
7. To try the experimental website warning, reload a supported AI chat tab after installing the extension.

Replace `YOUR-USERNAME` with the GitHub username that owns the repository.

### Try it safely

Use fake example data only. For example:

```text
api_key = "sk-proj-abcdefghijklmnopqrstuvwxyz123456"
```

The scanner should flag the pattern and offer to redact it. This is a deliberately synthetic example; **never put real credentials in screenshots, issues, pull requests, or tests**.

### Run the scanner tests

Requires Node.js. No package installation is needed:

```bash
node tests/scanner.test.js
```

The test script checks detection, ordinary text, overlapping matches, and redaction. Passing these tests validates the scanner test cases only; it does **not** verify the browser integration or prove that a prompt is safe.

### Supported AI chat websites

The extension currently targets these domains:

- ChatGPT — `chatgpt.com` and `chat.openai.com`
- Claude — `claude.ai`
- Gemini — `gemini.google.com`

The popup scanner can also be used independently of those websites. Website interfaces and sending methods change frequently, so treat the send-warning feature as experimental.

### Privacy and limitations

- Scanning and redaction run locally in the extension.
- PromptShield does not transmit prompt text to a PromptShield server.
- Pattern matching can **miss secrets** and can **produce false positives**.
- “No known patterns found” does not mean the text contains no sensitive information.
- Always review text yourself before sharing it. If a real credential was exposed, revoke or rotate it.
- Inspect source code and browser permissions before installing any extension.

See [SECURITY.md](SECURITY.md) for responsible security reporting.

### Project structure

```text
promptshield/
├── assets/                 # Logo and banner artwork
├── icons/                  # Extension icons
├── tests/                  # Scanner tests
├── .github/ISSUE_TEMPLATE/ # Issue templates
├── manifest.json           # Chrome Extension Manifest V3
├── scanner.js              # Local detection and redaction rules
├── popup.html              # Extension popup
├── popup.css               # Popup styling
├── popup.js                # Popup behavior
├── content.js              # Experimental AI-site warnings
├── content.css             # Warning panel styling
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
└── README.md
```

### Roadmap

- [x] Local scanning and redaction MVP
- [x] Chrome Manifest V3 project scaffold
- [x] Initial scanner tests and project documentation
- [ ] Manually verify send-warning behavior on every supported website
- [ ] Add editable detection rules and sensitivity controls
- [ ] Expand regression tests with synthetic examples
- [ ] Publish a verified demo GIF and real screenshots
- [ ] Evaluate Firefox support

### Contributing

Issues, ideas, and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first, include clear reproduction steps, and use synthetic data in tests. Never publish real credentials in an issue or pull request.

### License

PromptShield is released under the [MIT License](LICENSE).

---

<a id="русский"></a>

## 🇷🇺 Русский

### Что такое PromptShield?

Когда мы отправляем ИИ код, логи или текст ошибки, случайно можно передать API-ключ, токен, пароль или данные для подключения к базе. **PromptShield добавляет проверку перед отправкой:** сканирует текст, показывает возможные совпадения и помогает замаскировать их.

Это open-source расширение с подходом *local-first*: проверка текста выполняется локально в браузере. Для работы не нужны аккаунт, платный API нейросети или собственный сервер PromptShield.

### Возможности

- **Локальный поиск потенциальных секретов:** распространённые форматы API-ключей и токенов, приватные ключи, присваивания паролей и секретов, строки подключения к базам данных.
- **Скрытые значения в результатах:** найденные фрагменты не показываются целиком в списке совпадений.
- **Маскировка в один клик:** найденный текст заменяется метками, например `[REDACTED_GITHUB_TOKEN]`.
- **Более безопасное копирование:** текущий текст повторно проверяется, а известные совпадения маскируются перед копированием.
- **Экспериментальные предупреждения перед отправкой** на некоторых сайтах с ИИ. Перехват отправки не гарантирован и может перестать работать после изменения интерфейса сайта.
- **Без сборки для текущего MVP:** расширение можно загрузить прямо из папки с исходным кодом.

### Установка в Chrome

> Сейчас расширение устанавливается вручную из исходников. В **Chrome Web Store оно не опубликовано**.

1. Скачай ZIP-архив репозитория и распакуй его либо клонируй репозиторий:

   ```bash
   git clone https://github.com/YOUR-USERNAME/promptshield.git
   ```

2. Открой `chrome://extensions` в Chrome или другом браузере на Chromium.
3. Включи **Режим разработчика**.
4. Нажми **Загрузить распакованное расширение** (*Load unpacked*).
5. Выбери папку проекта, внутри которой находится `manifest.json`.
6. Открой всплывающее окно PromptShield, вставь **тестовый выдуманный текст** и нажми **Scan prompt**.
7. Чтобы попробовать экспериментальное предупреждение на сайте ИИ, перезагрузи открытую вкладку после установки расширения.

Замени `YOUR-USERNAME` на имя пользователя GitHub, которому принадлежит репозиторий.

### Безопасная проверка

Используй только выдуманные тестовые данные. Например:

```text
api_key = "sk-proj-abcdefghijklmnopqrstuvwxyz123456"
```

Сканер должен отметить похожую на ключ строку и предложить её замаскировать. Это искусственный пример. **Не добавляй настоящие ключи и пароли в скриншоты, issues, pull requests или тесты.**

### Запуск тестов сканера

Понадобится Node.js. Устанавливать дополнительные пакеты не нужно:

```bash
node tests/scanner.test.js
```

Тесты проверяют обнаружение известных шаблонов, обычный текст, пересекающиеся совпадения и маскировку. Успешные тесты проверяют только сценарии сканера — они **не подтверждают надёжность интеграции с браузером и не гарантируют безопасность текста**.

### Поддерживаемые сайты ИИ

Скрипт расширения настроен на следующие домены:

- ChatGPT — `chatgpt.com` и `chat.openai.com`
- Claude — `claude.ai`
- Gemini — `gemini.google.com`

Сканер во всплывающем окне можно использовать и без этих сайтов. Интерфейсы и способы отправки на сайтах часто меняются, поэтому предупреждения перед отправкой пока считаются экспериментальной функцией.

### Приватность и ограничения

- Сканирование и маскировка выполняются локально в расширении.
- PromptShield не передаёт текст промпта на собственный сервер.
- Поиск по шаблонам может **не обнаружить некоторые секреты** и может **ошибочно помечать обычный текст**.
- Сообщение «Известные шаблоны не найдены» не означает, что в тексте точно нет конфиденциальных данных.
- Всегда проверяй текст сам перед отправкой. Если настоящий ключ уже оказался раскрыт, отзови его или создай новый.
- Перед установкой любого расширения проверяй исходный код и разрешения браузера.

Правила ответственного сообщения об уязвимостях описаны в [SECURITY.md](SECURITY.md).

### Структура проекта

```text
promptshield/
├── assets/                 # Логотип и баннер
├── icons/                  # Иконки расширения
├── tests/                  # Тесты сканера
├── .github/ISSUE_TEMPLATE/ # Шаблоны issues
├── manifest.json           # Chrome Extension Manifest V3
├── scanner.js              # Локальное обнаружение и маскировка
├── popup.html              # Окно расширения
├── popup.css               # Стили окна
├── popup.js                # Логика окна
├── content.js              # Экспериментальные предупреждения на сайтах ИИ
├── content.css             # Стили предупреждения
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
└── README.md
```

### План развития

- [x] MVP с локальным сканированием и маскировкой
- [x] Основа расширения Chrome Manifest V3
- [x] Первые тесты сканера и документация проекта
- [ ] Вручную проверить предупреждения перед отправкой на каждом поддерживаемом сайте
- [ ] Добавить пользовательские правила обнаружения и настройку чувствительности
- [ ] Расширить регрессионные тесты выдуманными примерами
- [ ] Опубликовать проверенную GIF-демонстрацию и настоящие скриншоты
- [ ] Оценить поддержку Firefox

### Как помочь проекту

Идеи, сообщения об ошибках и pull requests приветствуются. Сначала прочитай [CONTRIBUTING.md](CONTRIBUTING.md), опиши шаги воспроизведения и используй только искусственные данные. Не публикуй настоящие ключи или пароли в issues и pull requests.

### Лицензия

PromptShield распространяется по лицензии [MIT](LICENSE).

---

<div align="center">
  <strong>Think before you share. Scan before you send. 🛡️</strong><br />
  <strong>Думай, прежде чем делиться. Проверь, прежде чем отправлять. 🛡️</strong><br />
  <sub>Built in the open for safer AI workflows · Open-source эксперимент для более безопасной работы с ИИ</sub>
</div>
