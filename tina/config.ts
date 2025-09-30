import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch = process.env.HEAD || process.env.VERCEL_GIT_COMMIT_REF || "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_PUBLIC_CLIENT_ID, // Get this from tina.io
  token: process.env.TINA_TOKEN, // Get this from tina.io
  build: {
    outputFolder: "admin",
    publicFolder: "./",
  },
  media: {
    tina: {
      mediaRoot: "assets/img",
      publicFolder: "./",
    },
  },
  search: {
    tina: {
      indexerToken: process.env.SEARCH_TOKEN, // Get this from tina.io
      stopwordLanguages: ['eng']
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100
  },
  schema: {
    collections: [
      {
        name: "link",
        label: "Links",
        path: "_links",
        ui: {
          filename: {
            readonly: false,
            slugify: (values) => {
              const date = values.date ? new Date(values.date) : new Date();
              const formattedDate = date.toISOString().slice(0, 10);
              return `${formattedDate}`;
            },
          },
        },
        defaultItem: () => {
          return {
            date: new Date().toISOString(),
            layout: "link",
          }
        },
        fields: [
          {
            type: "string",
            name: "title1",
            label: "Title1"
          },
          {
            type: "string",
            name: "url1",
            label: "URL1",
            required: true
          },
          {
            type: "datetime",
            name: "date",
            label: "Date",
            required: true,
          },
          {
            type: "string",
            name: "categories",
            label: "categories",
            list: true,
          },
          {
            type: "string",
            name: "title2",
            label: "Title2",
          },
          {
            type: "string",
            name: "url2",
            label: "URL2",
          },
          {
            type: "string",
            name: "layout",
            label: "collection"
          }
        ],
      },
      {
        name: "page",
        label: "Pages",
        path: "/",
        match: {
          exclude: '_*/**',
        },
        defaultItem: () => {
          return {
            date: new Date().toISOString(),
            layout: "page",
          }
        },
        fields: [
          {
            type: "datetime",
            name: "date",
            label: "Date",
          },
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            // Short description for sharing/page previews
            type: "string",
            name: "description",
            label: "description"
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
          {
            type: "string",
            name: "categories",
            label: "categories",
            list: true,
          },
          {
            type: "string",
            name: "layout",
            label: "collection"
          }
        ],
      }
    ],
  },
});
