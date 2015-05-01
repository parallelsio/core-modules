Slingshot.createDirective("s3Uploader", Slingshot.S3Storage, {
  bucket: "vandelay-industries.images",

  acl: "public-read",

  authorize: function () {
    return true;
  },

  key: function (file) {
    return Date.now() + "/" + file.name;
  }
});
