if (typeof Promise.withResolvers === 'undefined') {
  Promise.withResolvers = <T>() => {
    let resolve: (value: T | PromiseLike<T>) => void
    let reject: (reason?: unknown) => void
    const promise = new Promise<T>((res, rej) => {
      resolve = res
      reject = rej
    })
    return { promise, resolve: resolve!, reject: reject! }
  }
}

type TEventName = (n?: string) => string
type Props = {
  listen?: boolean
  wait?: boolean
  timeout?: number
  attempts?: number
  log?: boolean
  eventName?: TEventName
}

export class ElmaUMDController {
  private umdPromise: ReturnType<typeof Promise.withResolvers<void>> =
    Promise.withResolvers()
  private controller: AbortController = new AbortController()
  private attempt: number = 0
  private timeoutId: number | undefined
  props: Props = {
    eventName: () => `${this._moduleName}-loaded`,
    listen: true,
    wait: true,
    timeout: 50,
    attempts: 500,
    log: false,
  }

  #resolve() {
    if (this.timeoutId) clearTimeout(this.timeoutId)
    this.umdPromise.resolve()
    this.#log(`resolved.`)
    this.dispatchEvent()
    this.controller.abort()
  }

  #reject() {
    if (this.timeoutId) clearTimeout(this.timeoutId)
    this.umdPromise.reject()
    this.#log(`rejected.`)
    this.controller.abort()
  }
  setTimeout = () => {
    if (this._moduleName in window) {
      this.#resolve()
      return
    }
    this.#log(`waiting... Attempt: ${this.attempt}`)

    if (this.attempt++ < (this.props.attempts ?? 50)) {
      this.timeoutId = window.setTimeout(
        this.setTimeout,
        this.props.timeout ?? 50
      )
    } else {
      this.#log(`attempts limit reached.`)
      if (!this.props.listen) this.#reject() // отклоняем, если не слушаем событие
    }
  }

  constructor(private _moduleName: string, props?: Props) {
    Object.assign(this.props, props)
    this.#init()
  }

  #init() {
    this.#wait()
    this.#addListener()
    this.#log(`init()`, this.props)

    return this.umdPromise.promise
  }

  #wait() {
    if (!this.props.wait) return
    this.setTimeout()
  }

  #addListener() {
    if (!this.props.listen) return

    if (this.props.eventName)
      document.addEventListener(
        this.props.eventName(this._moduleName),
        () => {
          this.#resolve()
        },
        {
          signal: this.controller.signal,
        }
      )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #log(...args: any) {
    if (this.props.log)
      console.log('ElmaUMDController:', `${this._moduleName}:`, ...args)
  }

  get moduleName(): string {
    return this._moduleName
  }

  get promise() {
    return this.umdPromise.promise
  }

  loaded() {
    this.#resolve()
    this.controller.abort()
  }

  dispatchEvent() {
    if (this.props.listen) return

    const eventName = this.props.eventName?.(this._moduleName) ?? ''
    if (eventName) {
      this.#log(`${eventName} dispatched.`)
      window.document.dispatchEvent(new window.CustomEvent(eventName))
    } else {
      this.#log(`Error: no event name. ${this.props.eventName}`)
    }
  }

  onLoad(cb: () => void) {
    this.umdPromise.promise.then(() => {
      this.dispatchEvent()
      cb()
      this.controller.abort()
    })
  }
}
