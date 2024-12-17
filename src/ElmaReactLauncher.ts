import { ElmaUMDController } from './ElmaUMDController'

type TEventName = (n: string) => string

type Props = {
  moduleName?: string
  fileName?: string
  contextData?: IContextData
  eventName?: TEventName
  styleName?: string
  dependencies?: string[]
  log?: boolean
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

export class ElmaReactLauncher {
  private props: Props = {
    eventName: () => `${this.moduleName}-loaded`,
    dependencies: [],
    log: false,
    reactInitObject: {},
  }

  private modulesIsLoaded: Object

  private moduleName: string
  private fileName: string
  private contextData: IContextData
  private reactInitObject: Object

  constructor(props: Props) {
    Object.assign(this.props, props)

    if (!props.moduleName) throw Error('No Module Name.')
    if (!props.fileName) throw Error('No Module File Name.')
    if (!props.contextData) throw Error('No Elma Context Data.')

    this.moduleName = props.moduleName
    this.fileName = props.fileName
    this.contextData = props.contextData
    this.reactInitObject = props.reactInitObject ?? {}

    this.contextData.templateData = {
      js: this.fileName,
      css: props.styleName ?? '',
      isReady: false,
      rootId: Date.now().toString(36) + Math.random().toString(36).substring(2),
      cssLoaded: this.cssLoaded.bind(this),
    }

    this.modulesIsLoaded = {
      [this.moduleName]: false,
      plugin: false,
    }
    if (props.styleName) Object.assign(this.modulesIsLoaded, { css: false })
  }

  init() {
    this.#waitForDependencies()
  }

  #waitForDependencies() {
    if (this.props.dependencies?.length)
      Promise.all(
        this.props.dependencies.map((n) => new ElmaUMDController(n).promise)
      ).then(() => {
        this.#setIsReady()
      })
    else this.#setIsReady()
  }

  #setIsReady() {
    this.contextData.templateData = {
      ...this.contextData.templateData,
      isReady: true,
    } as TReactModuleTemplateData

    this.#waitModuleLoad()
  }

  #waitModuleLoad() {
    new ElmaUMDController(this.moduleName).onLoad(() => {
      this.#log('waitLibLoad:' + 'setModuleLoaded')
      this.#setModuleLoaded(this.moduleName)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #log(...args: any) {
    if (this.props.log)
      console.log('ElmaReactLauncher:', `${this.moduleName}:`, ...args)
  }

  #checkModulesIsLoaded = () =>
    (Object.values(this.modulesIsLoaded) as Boolean[]).reduce(
      (a, v) => v && a,
      true
    )

  #setModuleLoaded = (name: string) => {
    // @ts-ignore
    this.modulesIsLoaded[name] = true
    this.#log(this.modulesIsLoaded)

    if (this.#checkModulesIsLoaded()) this.#render()
  }

  #render() {
    const root = document.getElementById(
      this.contextData.templateData?.rootId ?? 'rootId'
    )
    // @ts-ignore
    window[this.moduleName].reactRender(
      Object.assign(this.reactInitObject, { root })
    )
  }

  cssLoaded() {
    this.#setModuleLoaded('css')
  }

  pluginLoaded() {
    this.#setModuleLoaded('plugin')
  }

  get templateData() {
    return this.contextData.templateData
  }
}
