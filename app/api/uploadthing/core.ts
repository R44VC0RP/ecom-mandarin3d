import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  modelUploader: f({
    'application/octet-stream': { maxFileSize: "128MB" }, // For STL files
    'model/stl': { maxFileSize: "128MB" }, // Alternative MIME type for STL
    'model/step': { maxFileSize: "128MB" }, // For STEP files
    'model/obj': { maxFileSize: "128MB" }, // For OBJ files
    'application/x-tgif': { maxFileSize: "128MB" }, // For some 3D files
    'text/plain': { maxFileSize: "128MB" } // For OBJ and other text-based 3D files
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      return { shouldSlice: true }; // Pass metadata to indicate this file needs slicing
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata);
      console.log("File URL", file.url);
      
      if (metadata.shouldSlice) {
        // TODO: Implement slicing SDK integration here
        console.log("File needs to be sliced:", file.url);
      }
    }),

  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      // This code runs on your server before upload
      return {}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata);
      console.log("File URL", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
