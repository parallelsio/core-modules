Slingshot.createDirective("s3Uploader", Slingshot.S3Storage, {
  bucket: process.env.AWS_BUCKET || "BUCKET",

  AWSAccessKeyId: process.env.AWS_ACCESS_KEY_ID || 'KEY',
  AWSSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'SECRET',
  acl: "public-read",

  authorize: function () {
    return true;
  },

  key: function (file) {
    return file.name + "_" + Date.now();
  }
});
