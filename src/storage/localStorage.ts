import { Page } from "../constant/Page";

const baseKey = "harnhainoi";
export const key = {
  page: `${baseKey}.page`,
  groups: `${baseKey}.groups`,
};
export const getPage = (): Page => {
  return (window.localStorage.getItem(key.page) ?? Page.Home) as Page;
};

export const savePage = (page: Page): void => {
  window.localStorage.setItem(key.page, page.toString());
};
