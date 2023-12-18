import { Data, processDebt, reportDebt } from "./logics/logics";
import debts from "./data/debt.json";
import persons from "./data/persons.json";
import Swal from "sweetalert2";
import { useEffect, useState } from "preact/hooks";
import { Person } from "./model/Person";
import { Item } from "./model/Item";

export function App() {
  const [debtResult, setDebtResult] = useState<Data>({});
  // const [persons, setPersons] = useState<Array<Person>>([]);
  // const [debts, setDebts] = useState<Array<Item>>([]);
  useEffect(() => {
    setDebtResult(
      processDebt({
        persons: persons,
        items: debts,
      })
    );
  }, [debts]);
  return (
    <div
      style={{
        width: "calc(100vw - 8rem)",
        height: "calc(100vh - 8rem)",
        padding: "4rem",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Harn Hai Noi</h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex" }}>
          <div style={{ width: "50%" }}>
            <h2>People in Group</h2>
            <ol>
              {persons.map((person, index) => (
                <li>
                  {person.name} <button>x</button>
                </li>
              ))}
            </ol>
            <button>Add person</button>
          </div>
          <div style={{ width: "50%" }}>
            <h2>Debt list</h2>
            <ol>
              {debts.map((debt) => (
                <li>
                  {debt.name} (Paid by {debt.payer.name} {debt.cost} THB){" "}
                  <button>x</button>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {debt.debter.map((d) => (
                      <div
                        style={{
                          backgroundColor: d.person.color,
                          color: "#333",
                          padding: "4px",
                          borderRadius: "8px",
                        }}
                      >
                        {d.person.name}: {d.amount}
                      </div>
                    ))}
                  </div>
                </li>
              ))}
              <button>Add debt</button>
            </ol>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>Summary of Debt</h2>
          {reportDebt(debtResult, persons).map((r) => (
            <div>{r}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
