import { Item } from "./Item";
import { Person } from "./Person";

export interface Bill {
    persons: Person[]
    items: Item[]
}