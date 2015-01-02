///* global jasmine, describe, it, expect */
///* jshint jquery: true */
//
//(function () {
//  'use strict';
//
//  describe('Parallels', function () {
//
//    it('should have a save bit dialog', function () {
//      window.PARALLELS.Clipper.showSave('url', 'dataUrl', jasmine.createSpy('save'));
//      expect($('.bit-dialog')).toBeInDOM();
//    });
//
//    it('should be able to open and close multiple times on the same tab', function () {
//      var saveSpy = jasmine.createSpy('save');
//
//      // First try cancelled
//      window.PARALLELS.Clipper.showSave('url', 'dataUrl', saveSpy);
//      $('button.cancel').click();
//      expect(saveSpy).not.toHaveBeenCalled();
//
//      // Second try should go through
//      window.PARALLELS.Clipper.showSave('url', 'dataUrl', saveSpy);
//      $('button.submit').click();
//      expect(saveSpy).toHaveBeenCalled();
//    });
//
//    describe('loading', function () {
//
//      it('should append a base div for the extension', function () {
//        expect(window.PARALLELS).toBeDefined();
//        expect($('.parallels-web-clipper')).toBeInDOM();
//      });
//
//    });
//
//    describe('saving', function () {
//
//      it('should save the bit with all the required attributes', function (done) {
//        window.PARALLELS.Clipper.showSave('url', 'dataUrl', function (bit) {
//          expect(bit.type).toEqual('image');
//          expect(bit.url).toEqual('url');
//          expect(bit.title).not.toBeNull();
//          expect(bit.imageDataUrl).toEqual('dataUrl');
//          expect(bit.nativeWidth).not.toBeNull();
//          expect(bit.nativeHeight).not.toBeNull();
//          expect(bit.createdAt).not.toBeNull();
//          done();
//        });
//
//        $('button.submit').click();
//      });
//
//      it('should default the page title', function (done) {
//        window.PARALLELS.Clipper.showSave('url', 'dataUrl', function (page) {
//          expect(page.title).toEqual('Jasmine Spec Runner');
//          done();
//        });
//
//        $('button.submit').click();
//      });
//
//      it('should save the title entered if there is one', function (done) {
//        window.PARALLELS.Clipper.showSave('url', 'dataUrl', function (page) {
//          expect(page.title).toEqual('Override');
//          done();
//        });
//
//        $('.bit-title').val('Override');
//        $('button.submit').click();
//      });
//
//      it('should save any additional context', function (done) {
//        window.PARALLELS.Clipper.showSave('url', 'dataUrl', function (page) {
//          expect(page.context).toEqual('some additional context');
//          done();
//        });
//
//        $('.bit-context').val('some additional context');
//        $('button.submit').click();
//      });
//
//      it('should save any tags entered', function (done) {
//        window.PARALLELS.Clipper.showSave('url', 'dataUrl', function (page) {
//          expect(page.tags.length).toEqual(2);
//          expect(page.tags).toContain('example');
//          expect(page.tags).toContain('another example');
//          done();
//        });
//
//        $('.bit-tags').tagEditor('addTag', 'example');
//        $('.bit-tags').tagEditor('addTag', 'another example');
//        $('button.submit').click();
//      });
//    });
//
//    // describe('escaping out', function () {
//
//    //   it('should close the dialog box and not try to save', function () {
//    //     var saveSpy = jasmine.createSpy('save');
//    //     window.PARALLELS.Clipper.showSave('url', 'dataUrl', saveSpy);
//
//    //     var e = $.Event('keyup');
//    //     e.which = 27;   // ASCII code for esc key
//    //     $('body').trigger(e);
//
//    //     expect(saveSpy).not.toHaveBeenCalled();
//    //     expect($('.bit-dialog')).not.toBeInDOM();
//    //   });
//
//    // });
//
//
//    describe('cancelling', function () {
//
//      it('should close the dialog box and not try to save', function () {
//        var saveSpy = jasmine.createSpy('save');
//        window.PARALLELS.Clipper.showSave('url', 'dataUrl', saveSpy);
//
//        $('button.cancel').click();
//        expect(saveSpy).not.toHaveBeenCalled();
//      });
//
//    });
//
//  });
//
//})();
