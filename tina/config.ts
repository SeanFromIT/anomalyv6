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
        defaultItem: () => {
          return {
            date: new Date().toISOString(),
          }
        },
        fields: [
          {
            type: "string",
            name: "title1",
            label: "Title1",
            isTitle: true,
            required: true,
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
        ],
      },
    ],
  },
});
