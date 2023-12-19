import { Bill } from "../model/Bill";
import { Item } from "../model/Item";
import { Person } from "../model/Person";

export interface Data {
  [person: string]: {
    [oweTo: string]: number;
  };
}
export interface ReportData {
  person1: Person;
  person2: Person;
  amount: number;
}
interface Pair {
  person1: string;
  person2: string;
}
const isOwe = (person1: string, person2: string, data: Data): boolean => {
  return !!data[person1][person2];
};
const getPersonPairs = (persons: Person[]) => {
  const personPairs: Array<Pair> = persons.reduce(
    (acc: Array<Pair>, personI: Person, i: number, arr: Array<Person>) => {
      const rest = arr.slice(i + 1);
      return [
        ...acc,
        ...rest.map((personJ: Person) => ({
          person1: personI.id,
          person2: personJ.id,
        })),
      ];
    },
    []
  );
  return personPairs;
};
const getInitialData = (persons: Person[]): Data => {
  return persons.reduce((prev, curr) => ({ ...prev, [curr.id]: {} }), {});
};
const setupDebt = (data: Data, items: Item[]) => {
  items.map((item) => {
    item.debter.map((debter) => {
      const isPayer = debter.person.id === item.payer.id;
      if (!isPayer) {
        if (!data[debter.person.id][item.payer.id]) {
          data[debter.person.id][item.payer.id] = 0;
        }
        data[debter.person.id][item.payer.id] += debter.amount;
      }
    });
  });
};
const cleanTogetherOwe = (data: Data, pairs: Pair[]) => {
  pairs.map((pair) => {
    if (
      isOwe(pair.person1, pair.person2, data) &&
      isOwe(pair.person2, pair.person1, data)
    ) {
      if (
        data[pair.person1][pair.person2] >= data[pair.person2][pair.person1]
      ) {
        data[pair.person1][pair.person2] -= data[pair.person2][pair.person1];
        data[pair.person2][pair.person1] = 0;
      } else {
        data[pair.person2][pair.person1] -= data[pair.person1][pair.person2];
        data[pair.person1][pair.person2] = 0;
      }
    }
  });
};
const cleanData = (data: Data): void => {
  const keys = Object.keys(data);
  keys.map((key) => {
    const subKeys = Object.keys(data[key]);
    subKeys.map((subKey) => {
      if (data[key][subKey] === 0) {
        delete data[key][subKey];
      }
    });
  });
};
const simplifyDebt = (data: Data, pairs: Pair[]) => {
  pairs.map((pair) => {
    for (let p3 in data[pair.person1]) {
      // For all people that A owe (C)
      if (isOwe(pair.person2, p3, data)) {
        // A owe C and B also owe C
        if (
          isOwe(pair.person1, pair.person2, data) &&
          data[pair.person1][pair.person2] > data[pair.person2][p3]
        ) {
          // A owe B more than B owe C -> Transfer debt between B -> C to be A -> B and A -> C
          data[pair.person1][p3] += data[pair.person2][p3];
          data[pair.person1][pair.person2] -= data[pair.person2][p3];
          data[pair.person2][p3] = 0;
        } else if (
          // B owe A more than A owe C -> Transfer debt between A -> C to be B -> A and B -> C
          isOwe(pair.person2, pair.person1, data) &&
          data[pair.person2][pair.person1] > data[pair.person1][p3]
        ) {
          data[pair.person2][p3] += data[pair.person1][p3];
          data[pair.person2][pair.person1] -= data[pair.person1][p3];
          data[pair.person1][p3] = 0;
        } else if (isOwe(pair.person2, pair.person1, data)) {
          // B owe A but less than A owe C -> Convert B owe A to B owe C and reduce debt of A and C
          data[pair.person1][p3] -= data[pair.person2][pair.person1];
          data[pair.person2][p3] += data[pair.person2][pair.person1];
          data[pair.person2][pair.person1] = 0;
        } else if (isOwe(pair.person1, pair.person2, data)) {
          // A owe B but less than B owe C -> Convert A owe B to A owe C and reduce debt of B and C
          data[pair.person1][p3] += data[pair.person1][pair.person2];
          data[pair.person2][p3] -= data[pair.person1][pair.person2];
          data[pair.person1][pair.person2] = 0;
        }
      }
    }
  });
};
const postprocess = (data: Data, persons: Person[]): Array<ReportData> => {
  let reports: Array<ReportData> = [];
  const personMap: {
    [key: string]: Person;
  } = persons.reduce((map, person) => ({ ...map, [person.id]: person }), {});
  for (let p1 in data) {
    const person1 = personMap[p1];
    for (let p2 in data[p1]) {
      const person2 = personMap[p2];
      reports.push({
        person1,
        person2,
        amount: data[p1][p2],
      });
    }
  }
  return reports;
};

export const processDebt = (bill: Bill): Array<ReportData> => {
  const data: Data = getInitialData(bill.persons);
  const pairs = getPersonPairs(bill.persons);
  setupDebt(data, bill.items);
  cleanTogetherOwe(data, pairs);
  cleanData(data);
  simplifyDebt(data, pairs);
  cleanData(data);
  return postprocess(data, bill.persons);
};
