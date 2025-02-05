import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  modelUploader: f({
    "application/octet-stream": { maxFileSize: "32MB" }, // For STL files
    "model/stl": { maxFileSize: "32MB" } // Alternative MIME type for STL
  })
    .middleware(async () => {
      // This code runs on your server before upload
      return {}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata)
      console.log("File URL", file.url)
    }),

  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      // This code runs on your server before upload
      return {}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata)
      console.log("File URL", file.url)
    }),

  stlFile: f({ "application/octet-stream": { maxFileSize: "32MB" } })
    .middleware(async () => {
      return { };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for file:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
