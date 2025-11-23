import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({ auth: import.meta.env.NOTION_API_TOKEN });
const dataSourceId = import.meta.env.NOTION_DATA_SOURCE_ID;

export async function fetchDataSource() {
  return await notion.dataSources.query({
    data_source_id: dataSourceId,
  })
}

export async function getPageIdsFromSource() {
  const data = await fetchDataSource()
  return data.results.map(page => page.id)
}

// blockId is the pageId in that case
export async function getAllPagesById(blockId) {
  // retrieve all child blocks of the page
  const response = await notion.blocks.children.list({
    block_id: blockId,
    page_size: 50,
  });
  return response;

};
// passing notion client to the option
const n2m = new NotionToMarkdown({ notionClient: notion });

export async function convertBlocksToMarkdown(blockId) {
  // get all blocks in the page
  const { results } = await notion.blocks.children.list({
    block_id: blockId,
  });

  //convert to markdown
  const markdownBlocks = await n2m.blocksToMarkdown(results);
  const markdownString = n2m.toMarkdownString(markdownBlocks)
  return markdownString
};

export async function convertBlockToMarkdown(block) {
  const result = n2m.blocksToMarkdown(block)
  return result
}
