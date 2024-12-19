# ElmaUMDController

Класс, контролирующий загрузку или наличие уже загруженного UMD модуля. Принимает имя модуля и некоторые дополнительные свойства.

```ts
type TEventName = (n?: string) => string
type Props = {
  listen?: boolean // true
  wait?: boolean // true
  timeout?: number // 50
  attempts?: number // 50
  log?: boolean // false
  eventName?: TEventName
}

class ElmaUMDController{
    constructor ElmaUMDController(_moduleName: string, props?: Props): ElmaUMDController
}
```

При создании экземпляра класса, создается промисе umdPromise, удовлетворение которого считается признаком успешной загрузки/наличия подключенного модуля.

Имя ожидаемого модуля и промис можно получить напрямую через геттеры:

```ts
  get moduleName(): string {
    return this.moduleName
  }

  get promise() {
    return this.umdPromise.promise
  }
```

## Стратегии контроля

- `props.wait` - Ожидание наличия объекта `_moduleName` в `window`;
- `props.listen` - Ожидание события на `document` с именем по паттерну `eventName`.

### Wait

Делает попытки найти модуль по имени в глобальном объекте `window` `attempts` раз с интервалом `timeout`. При нахождении удовлетворяет промис.

Если кол-во попыток исчерпано, отклоняет промис. (Не отклоняет, если не подключен слушатель `listen=false`).

### Listen

Создает слушателя на `document` с именем по паттерну `eventName`. Удовлетворяет промис при получении события.

## Событие подключения модуля

Событие срабатывает, если слушатель (Listen) не подключен. Те мы ждем подключения только методом Wait.

## Метод onLoad

Метод позволяет подписать колбек функцию на событие удовлетворения промиса (подтверждение загрузки модуля).

```ts
new ElmaUMDController(moduleName, {
  listen: false,
}).onLoad(() => {
  setModuleLoaded(moduleName)
})
```

## Принудительное подтверждение загрузки

Принудительно можно сообщить, что модуль загружен с помощью метода `loaded()`, он подтвердит промис и снимет слушателя с `document`

```ts
 loaded() {
    this.#resolve()
    this.controller.abort()
  }
```
