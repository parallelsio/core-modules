FileSystemUploader = {

  /**
   * Define the additional parameters that your your service uses here.
   *
   * Note that some parameters like maxSize are shared by all services. You do
   * not need to define those by yourself.
   */


  directiveMatch: { },

  /**
   * Here you can set default parameters that your service will use
   */

  directiveDefault: { },


  /**
   *
   * @param {Object} method - This is the Meteor Method context.
   * @param {Object} directive - All the parameters from the directive.
   * @param {Object} file - Information about the file as gathered by the
   * browser
   * @param {Object} [meta] - Meta data that was passed to the uploader.
   *
   * @returns {UploadInstructions}
   */

  upload: function (method, directive, file, meta) {

    return {
      // Endpoint where the file is to be uploaded:
      upload: "http://localhost:9000/upload",

      // Download URL, once the file uploaded:
      download: "http://localhost:9000/" + file.name,

      // POST data to be attached to the file-upload:
      postData: [ ],

      // HTTP headers to send when uploading:
      headers: { }
    };
  },

  /**
   * Absolute maximum file-size allowable by the storage service.
   */

  maxSize: 5 * 1024 * 1024 * 1024
};


Slingshot.createDirective("fileSystemUploader", FileSystemUploader, {
  authorize: function () {
    return true;
  }
});
