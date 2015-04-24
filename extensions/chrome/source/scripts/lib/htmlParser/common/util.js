'use strict';

define(function () {

  function getDoctype(doc) {
    var docType = doc.doctype, docTypeStr;
    if (docType) {
      docTypeStr = "<!DOCTYPE " + docType.nodeName;
      if (docType.publicId) {
        docTypeStr += " PUBLIC \"" + docType.publicId + "\"";
        if (docType.systemId)
          docTypeStr += " \"" + docType.systemId + "\"";
      } else if (docType.systemId)
        docTypeStr += " SYSTEM \"" + docType.systemId + "\"";
      if (docType.internalSubset)
        docTypeStr += " [" + docType.internalSubset + "]";
      return docTypeStr + ">\n";
    }
    return "";
  }

  return {
    getDocContent: function (doc, docElement) {
      docElement = docElement || doc.documentElement;
      return getDoctype(doc) + docElement.outerHTML;
    }
  };
});
