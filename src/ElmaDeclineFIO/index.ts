import { petrovich } from './petrovich.js'

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

export { getDeclineStringFIO }
