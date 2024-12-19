# Библиотека для склонения ФИО и названий компаний (ElmaDeclineLib)

## ФИО

```ts
const orderInit = { last: 'last', first: 'first', middle: 'middle' } as const

function getDeclineStringFIO(
  fio: string,
  order: typeof orderInit = orderInit
): string
```

## Название компании

```ts
type DicPair = {
  search: string
  replace: string
}
function getDeclineStringCompany(company: string): string
function addDeclineCompanySinglePair(pair: DicPair): void
function getDeclineCompanyPairs(): DicPair[]
```
