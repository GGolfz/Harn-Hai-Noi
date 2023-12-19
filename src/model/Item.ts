import { Person } from "./Person"

export interface Item {
    id: string,
    name: string
    cost: number
    payer: Person
    debter: Depter[]
}

export interface Depter {
    person: Person
    amount: number
}