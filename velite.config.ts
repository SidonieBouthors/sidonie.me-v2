import { defineConfig, defineCollection, s } from "velite";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeToc, {
  HeadingNode,
  HtmlElementNode,
  TextNode,
} from "@jsdevtools/rehype-toc";

const recipeComputedFields = <
  T extends {
    slug: string;
    prepTime?: number;
    cookTime?: number;
    waitTime?: number;
  }
>(
  data: T
) => ({
  ...data,
  // Extract the slug from the path
  extractedSlug: data.slug.split("/").slice(1).join("/"),
  totalTime: (data.prepTime || 0) + (data.cookTime || 0) + (data.waitTime || 0),
});

const recipes = defineCollection({
  name: "Recipe",
  pattern: "recipes/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      name: s.string().max(20),
      description: s.string().max(100).optional(),
      coverImage: s.image(),
      contentImage: s.image().optional(),
      date: s.isodate(),
      published: s.boolean().default(true),
      tags: s.array(s.string()).optional(),
      yield: s.number(), // number of servings
      prepTime: s.number().optional(), // in minutes
      cookTime: s.number().optional(), // in minutes
      waitTime: s.number().optional(), // in minutes
      body: s.mdx(),
    })
    .transform(recipeComputedFields),
});

const postComputedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  // Extract the slug from the path
  extractedSlug: data.slug.split("/").slice(1).join("/"),
});

const posts = defineCollection({
  name: "Post",
  pattern: "share/**/*.mdx",
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(40),
      description: s.string().max(200).optional(),
      date: s.isodate(),
      published: s.boolean().default(true),
      tags: s.array(s.string()).optional(),
      body: s.mdx(),
    })
    .transform(postComputedFields),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/velite",
    base: "/velite/",
    name: "[name]-[hash:6].[ext]",
    clean: true,
  },
  collections: { recipes, posts },
  mdx: {
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: {
            dark: "github-dark-dimmed",
            light: "github-light",
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
      [
        rehypeToc,
        {
          headings: ["h2", "h3", "h4", "h5", "h6"],
        },
      ],
    ],
    remarkPlugins: [],
  },
});
