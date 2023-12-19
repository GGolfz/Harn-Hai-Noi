import { ReportData, processDebt } from "./logics/logics";
import { useEffect, useState } from "preact/hooks";
import { Person } from "./model/Person";
import { Item } from "./model/Item";
import Navbar from "./components/Navbar";
import Layout from "./components/Layout";
import { Page } from "./constant/Page";
import { getPage, savePage } from "./storage/localStorage";
import { Component } from "./type/Component";
import Home from "./components/Home";
import Group from "./components/Group";
import { JSX } from "preact/jsx-runtime";

export function App() {
  const [debtResult, setDebtResult] = useState<Array<ReportData>>([]);
  const [persons, setPersons] = useState<Array<Person>>([]);
  const [debts, setDebts] = useState<Array<Item>>([]);
  useEffect(() => {
    setDebtResult(
      processDebt({
        persons: persons,
        items: debts,
      })
    );
  }, [debts]);
  const [page, setPage] = useState<Page>(Page.Home);
  useEffect(() => {
    setPage(getPage());
  }, []);
  useEffect(() => {
    savePage(page);
  }, [page]);
  const renderPage = (): JSX.Element => {
    switch (page) {
      case Page.Home:
        return <Home />;
      case Page.Group:
        return <Group />;
      default:
        return <></>;
    }
  };
  return (
    <Layout>
      <Navbar isHome={page === Page.Home} onBack={() => setPage(Page.Home)} />
      {renderPage()}
    </Layout>
  );
}
