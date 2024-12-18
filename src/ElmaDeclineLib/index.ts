import { petrovich } from './petrovich.js'
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

const dicDeclineCompany: DicPair[] = [
  { search: 'Акционерное общество', replace: 'Акционерного общества' },
  {
    search: 'Общество с ограниченной ответственностью',
    replace: 'Общества с ограниченной ответственностью',
  },
  {
    search: 'Автономная некоммерческая организация',
    replace: 'Автономной некоммерческой организации',
  },
  {
    search: 'Публичное акционерное общество',
    replace: 'Публичного акционерного общества',
  },
  {
    search: 'Закрытое акционерное общество',
    replace: 'Закрытого акционерного общества',
  },
  { search: 'Унитарное предприятие', replace: 'Унитарного предприятия' },
  {
    search: 'Индивидуальный предприниматель',
    replace: 'Индивидуального предпринимателя',
  },
]

type DicPair = {
  search: string
  replace: string
}

function addDeclineCompanySinglePair(pair: DicPair) {
  if (!('search' in pair) && !('replace' in pair))
    throw Error('Wrong dictionary pair type.' + pair)
  if (!dicDeclineCompany.map((item) => item.search).includes(pair.search))
    dicDeclineCompany.push(pair)
}

function addDeclineCompanyPairs(p: DicPair | DicPair[]) {
  if (!p) throw Error('addDeclineCompanyPairs: No pairs.')

  if (Array.isArray(p)) p.forEach((pair) => addDeclineCompanySinglePair(pair))
  else addDeclineCompanySinglePair(p)

  return dicDeclineCompany
}

function getDeclineCompanyPairs() {
  return dicDeclineCompany
}

function getDeclineStringCompany(company: string) {
  if (detectLang(company) === 'en') return company

  dicDeclineCompany.forEach(({ search, replace }) => {
    if (company.startsWith(search)) company = company.replace(search, replace)
  })

  return company
}

export {
  getDeclineStringFIO,
  getDeclineStringCompany,
  addDeclineCompanyPairs,
  getDeclineCompanyPairs,
}
