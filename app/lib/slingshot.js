Slingshot.fileRestrictions("fileSystemUploader", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: 5 * 1024 * 1024 * 1024
});

Slingshot.fileRestrictions("s3Uploader", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/gif"],
  maxSize: null
});
