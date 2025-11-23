import { Client } from "@notionhq/client";

const notion = new Client({ auth: import.meta.env.NOTION_API_TOKEN });
const databaseId = import.meta.env.NOTION_DATA_SOURCE_ID;
let cachedPosts: CollectionEntry<"blogs">[] | null = null;

export async function getAllBlogPosts(): Promise<CollectionEntry<"blogs">[]> {
  if (cachedPosts) return cachedPosts;
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "draft",
        checkbox: {
          equals: false,
        },
      },
      sorts: [
        {
          property: "pubDatetime",
          direction: "descending",
        },
      ],
    });
    const posts = response.results.map((page: any) => ({
      id: page.id,
      slug: page.properties.slug.rich_text[0].plain_text,
      title: page.properties.title.title[0].plain_text,
      description: page.properties.description.rich_text[0].plain_text,
      pubDatetime: new Date(page.properties.pubDatetime.date.start),
      modDatetime: new Date(page.last_edited_time),
      author: page.properties.author.rich_text[0].plain_text,
      featured: page.properties.featured.checkbox,
      draft: page.properties.draft.checkbox,
      tags: page.properties.tags.multi_select.map((tag: any) => tag.name),
    }));
    cachedPosts = posts;
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts from Notion:", error);
    throw error;
  }
}
