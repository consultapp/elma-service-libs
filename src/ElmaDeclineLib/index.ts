import { petrovich } from './petrovich.js'
// @ts-ignore
import * as RussianNouns from '../../node_modules/russian-nouns-js/RussianNouns.js'

console.log('RussianNouns', RussianNouns)

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

const regEn = /[a-z]/gi
const regRu = /[а-я]/gi
function detectLang(s: string) {
  return [...s.matchAll(regEn)].length > [...s.matchAll(regRu)].length
    ? 'en'
    : 'ru'
}

// [
//     "именительный",
//     "родительный",
//     "дательный",
//     "винительный",
//     "творительный",
//     "предложный",
//     "местный"
// ]

// Grammatical gender is a noun class system in Russian.
// {
//     FEMININE: "женский",
//     MASCULINE: "мужской",
//     NEUTER: "средний",
//     COMMON: "общий"
// }

function getDeclineStringCompany(company: string) {
  if (detectLang(company) === 'en') return company

  return company
}

const rne = new RussianNouns.Engine()
console.log(rne.decline({ text: 'общество', gender: 'средний' }, 'родительный'))
console.log(rne.decline({ text: 'с', gender: 'общий' }, 'родительный'))
console.log(
  rne.decline({ text: 'ограниченной', gender: 'средний' }, 'родительный')
)
console.log(
  rne.decline({ text: 'ответственностью', gender: 'общий' }, 'родительный')
)

console.log(
  rne.decline({ text: 'Автономной', gender: 'женский' }, 'родительный')
)
console.log(
  rne.decline({ text: 'некоммерческой', gender: 'женский' }, 'родительный')
)
console.log(
  rne.decline({ text: 'организации', gender: 'женский' }, 'родительный')
)

export { getDeclineStringFIO, getDeclineStringCompany }
