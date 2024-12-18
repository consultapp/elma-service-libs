import { petrovich } from './petrovich.js'
// @ts-ignore
// import * as RussianNouns from '../../node_modules/russian-nouns-js/RussianNouns.js'

// ********************************** getDeclineStringFIO *************************************

const orderInit = { last: 'last', first: 'first', middle: 'middle' } as const
type TOrder = keyof typeof orderInit

function getDeclineStringFIO(fio: string, order: typeof orderInit = orderInit) {
  // @ts-ignore
  const genitive: { [k in TOrder]: string } = petrovich(
    fio.split(' ').reduce(
      (a, v, i) => {
        // @ts-ignore
        a[Object.keys(order)[i]] = v
        return a
      },
      { ...orderInit }
    ),
    'genitive'
  )

  return Object.keys(order)
    .reduce((a, v) => (a += genitive[v as TOrder] + ' '), ' ')
    .trim()
}

// ********************************** getDeclineStringCompany *************************************

const regEn = /[a-z]/gi
const regRu = /[а-я]/gi
function detectLang(s: string) {
  return [...s.matchAll(regEn)].length > [...s.matchAll(regRu)].length
    ? 'en'
    : 'ru'
}

const dicDeclineCompanyTypes = [
  { t: 'Акционерное общество', r: 'Акционерного общества' },
  {
    t: 'Общество с ограниченной ответственностью',
    r: 'Общества с ограниченной ответственностью',
  },
  {
    t: 'Автономная некоммерческая организация',
    r: 'Автономной некоммерческой организации',
  },
  {
    t: 'Публичное акционерное общество',
    r: 'Публичного акционерного общества',
  },
  { t: 'Закрытое акционерное общество', r: 'Закрытого акционерного общества' },
  { t: 'Унитарное предприятие', r: 'Унитарного предприятия' },
  { t: 'Индивидуальный предприниматель', r: 'Индивидуального предпринимателя' },
]

function getDeclineStringCompany(company: string) {
  if (detectLang(company) === 'en') return company

  dicDeclineCompanyTypes.forEach(({ t, r }) => {
    if (company.startsWith(t)) company = company.replace(t, r)
  })

  return company
}

export { getDeclineStringFIO, getDeclineStringCompany }
