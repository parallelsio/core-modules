// describe('BitEvents', function() {
//   'use strict';

//   var mockEvent, mockTemplate;

//   beforeEach(function () {
//     mockEvent = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
//     mockTemplate = {data: {_id: 1}};
//   });

//   describe('toggleSelectedClass', function () {
//     it('should NOT add a "selected" css class if the target element does not have a "bit" class', function() {
//       var nonBitTarget = document.createElement('div');
//       $(nonBitTarget).addClass('dummy');

//       mockEvent.target = nonBitTarget;
//       BitEvents.toggleSelectedClass(mockEvent, {});
//       expect(mockEvent.target.classList.toString()).toEqual('dummy');
//     });

//     it('should add a "selected" css class if the target element has a "bit" class', function() {
//       var bitTarget = document.createElement('div');
//       $(bitTarget).addClass('bit');

//       mockEvent.target = bitTarget;
//       BitEvents.toggleSelectedClass(mockEvent, mockTemplate);
//       expect(mockEvent.target.classList.toString()).toContain('selected');
//     });
//   });
// });
