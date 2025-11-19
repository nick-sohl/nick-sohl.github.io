import { Client } from "@notionhq/client";

const notion = new Client({ auth: import.meta.env.NOTION_API_TOKEN });
const dataSourceId = import.meta.env.NOTION_DATA_SOURCE_ID;

export async function fetchDataSource() {
  return await notion.dataSources.query({
    data_source_id: dataSourceId,
  })
}

export async function getPagesFromSource() {
  return await fetchDataSource()
}

export async function getPageIdsFromSource() {
  const data = await fetchDataSource()
  return data.results.map(page => page.id)
}

export async function getPageContent(blockId) {
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  });
  return response;
};

