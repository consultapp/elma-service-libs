# ElmaReactLauncher

Класс содержит последовательность подключения UMD библиотеки c реакт приложением.

## 4 этапа подключения

- Ожидание переданных зависимостей `dependencies`. Осуществляется с помощью `ElmaUMDController`, запускаем метод `init()` в методе сценария Elma `onInit()`;
- Через флаг `isReady` в `contextData.templateData` подтверждаем разрешение на загрузку модуля в шаблоне Elma, создаем `ElmaUMDController` для нашего модуля;
- Ожидаем необходимые для маунта реакта события: загрузку CSS, событие onLoad плагина, событие загрузки UMD библиотеки;
- Рендерим реакт в `div` c `roodId`, находящимся в `contextData.templateData` c использованием объекта инициализации реакта, переданного при создании лаунчера - `reactInitObject`.

## Типы данных

```ts
type TEventName = (n: string) => string

type Props = {
  moduleName?: string
  fileName?: string
  styleName?: string
  contextData?: IContextData
  eventName?: TEventName
  dependencies?: string[]
  log?: boolean
  timeout?: number
  attempts?: number
  reactInitObject?: Object
}

type TReactModuleTemplateData = {
  isReady: boolean
  js: string
  rootId: string
  css?: string
  cssLoaded?: () => void
}

interface IContextData {
  templateData?: TReactModuleTemplateData
}
```

## Сценарий / Клиент

```js
/* Client scripts module */

import { ElmaReactLauncher } from 'ElmaReactLauncher.umd.js'

declare const window: any

const reactLauncher = new ElmaReactLauncher({
    moduleName: 'ReactLibName',
    fileName: 'ReactLib.js',
    contextData: Context.data,
    styleName: 'ReactLib.css',
    log: false,
    dependencies: ['React', 'ReactDOM'],
    reactInitObject: {
        data: getMock(),
        changeHandler: (d: any) => window.console.log('callback', d),
    },
})

async function onInit(): Promise<void> {
    window?.document.querySelector('html')?.setAttribute('data-mantine-color-scheme', 'light')
    reactLauncher.init()
}

async function onLoad(): Promise<void> {
    reactLauncher.pluginLoaded()
}
```

## Шаблон

```html
<% if (Context.data.templateData.css) { %>
<link
  rel="stylesheet"
  href="<%= UI.widget.filePath %>/<%= Context.data.templateData.css %>"
  onload="<%= Context.data.templateData.cssLoaded() %>"
/>
<% } %> <% if (Context.data.templateData.isReady) { %>
<script
  type="module"
  src="<%= UI.widget.filePath %>/<%= Context.data.templateData.js %>"
></script>
<% } %>

<div id="<%= Context.data.templateData.rootId %>"></div>
```
