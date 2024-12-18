# ElmaReactLauncher

## Сценарий / Клиент

```js
/* Client scripts module */

import { ElmaReactLauncher } from 'ElmaReactLauncher.umd.js'

declare const window: any

const reactLauncher = new ElmaReactLauncher({
    moduleName: 'surveyLib',
    fileName: 'surveyLib3333333.js',
    contextData: Context.data,
    styleName: 'surveyLib-Dj89JgUH_.css',
    log: true,
    dependencies: ['React', 'ReactDOM'],
    reactInitObject: {
        data: getMock(),
        changeHandler: (d: any) => window.console.log('callback', d),
    },
})

async function onInit(): Promise<void> {
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
