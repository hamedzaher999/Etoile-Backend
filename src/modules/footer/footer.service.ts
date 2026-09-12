import { CustomError } from "../../utils/customError.js";
import {
  selectFooterStructure,
  insertFooterTitle,
  insertFooterItem,
  selectFooterItemById,
  updateFooterItem,
  deleteFooterItemById,
} from "./footer.model.js";
import {
  FooterTitleInfo,
  FooterItemInfo,
  UpdateFooterItemInfo,
} from "./footer.validation.js";

export const getFooterStructure = async () => {
  const rows = await selectFooterStructure();
  const grouped: Record<string, { key: string; items: any[] }> = {};
  for (const row of rows) {
    if (!grouped[row.title_id]) {
+     grouped[row.title_id] = { id: row.title_id, key: row.title_key, items: [] };
    }
    if (row.item_id) {
      grouped[row.title_id].items.push({
        id: row.item_id,
        name: row.item_name,
        reference: row.item_reference,
      });
    }
  }
  return Object.values(grouped);
};

export const createFooterTitle = async (info: FooterTitleInfo) => {
  const result = await insertFooterTitle(info);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};

export const createFooterItem = async (info: FooterItemInfo) => {
  const result = await insertFooterItem(info);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};

export const changeFooterItem = async (
  id: string,
  new_info: UpdateFooterItemInfo
) => {
  const item = await selectFooterItemById(id);
  if (!item) throw new CustomError(404, "footer item not found.");
  const info = { ...item, ...new_info };
  const result = await updateFooterItem(id, info);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};

export const deleteFooterItem = async (id: string) => {
  const item = await selectFooterItemById(id);
  if (!item) throw new CustomError(404, "footer item not found.");
  const result = await deleteFooterItemById(id);
  if (!result) throw new CustomError(500, "try again.");
  return result;
};
