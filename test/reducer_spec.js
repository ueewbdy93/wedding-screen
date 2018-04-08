const reducer = require('../core/reducer');
const { List, Map } = require('immutable');
const { expect } = require('chai');
const sinon = require('sinon');
const Actions = require('../core/actions');
const { testComment1, testComment2 } = require('./reducer_fixtures');

describe('reducer', function () {
  beforeEach(function () {
    this.sandbox = sinon.createSandbox();
    this.clock = this.sandbox.useFakeTimers();
  });
  afterEach(function () {
    this.sandbox.restore();
  });

  describe(`test action: ${Actions.RESET}`, function () {
    it('success', function () {
      const state = Map({
        currentRoundStartTime: new Date(),
        currentRoundComment: List([]),
        nextRoundComment: List([Map(testComment1)]),
        currentComment: Map(testComment1),
        currentPicIndex: 2
      });
      this.clock.tick(1000);
      const nextState = reducer(state, { type: Actions.RESET });
      expect(nextState).equal(Map({
        currentRoundStartTime: new Date(),
        currentRoundComment: List([Map(testComment1)]),
        nextRoundComment: List([]),
        currentComment: null,
        currentPicIndex: 0
      }));
    });

    it('success if currentRoundComment is not empty', function () {
      const state = Map({
        currentRoundStartTime: new Date(),
        currentRoundComment: List([Map(testComment2)]),
        nextRoundComment: List([Map(testComment1)]),
        currentComment: Map(testComment1),
        currentPicIndex: 1
      });
      this.clock.tick(1000);
      const nextState = reducer(state, { type: Actions.RESET });
      expect(nextState).equal(Map({
        currentRoundStartTime: new Date(),
        currentRoundComment: List([Map(testComment1), Map(testComment2)]),
        nextRoundComment: List([]),
        currentComment: null,
        currentPicIndex: 0
      }));
    });
  });

  describe(`test action: ${Actions.PRINT_COMMENT}`, function () {
    it('success', function () {
      const state = Map({
        currentRoundComment: List([Map(testComment1)]),
        nextRoundComment: List([Map(testComment2)]),
        currentComment: null
      });
      const nextState = reducer(state, { type: Actions.PRINT_COMMENT });
      expect(nextState).equal(Map({
        currentRoundComment: List([]),
        nextRoundComment: List([Map(testComment2), Map(testComment1)]),
        currentComment: Map(testComment1)
      }));
    });
  });

  describe(`test action: ${Actions.ADD_COMMENT}`, function () {
    it('success', function () {
      const state = Map({
        currentRoundStartTime: new Date(2018, 5, 26, 0, 0, 0, 0),
        currentRoundComment: List(),
        nextRoundComment: List(),
        commentOffsetMaxMs: 1000
      });

      const comment = {
        content: '', name: '', type: '', createTime: new Date(2018, 5, 26, 0, 0, 2, 0)
      };

      const nextState = reducer(state, { type: Actions.ADD_COMMENT, comment });
      expect(nextState).to.eql(Map({
        currentRoundStartTime: new Date(2018, 5, 26, 0, 0, 0, 0),
        currentRoundComment: List(),
        nextRoundComment: List([Map({ ...comment, offset: 1000 })]),
        currentComment: Map({ ...comment, offset: 1000 }),
        commentOffsetMaxMs: 1000
      }));
    });
  });

  describe(`test action: ${Actions.NEXT_PICTURE}`, function () {
    it('will add currentPicIndex', function () {
      const state = Map({
        picCount: 100,
        currentPicIndex: 0
      });
      const nextState = reducer(state, { type: Actions.NEXT_PICTURE });
      expect(nextState.get('currentPicIndex')).eqls(1);
    });

    it('will round when currentPicIndex > picCount', function () {
      const state = Map({
        picCount: 100,
        currentPicIndex: 99
      });
      const nextState = reducer(state, { type: Actions.NEXT_PICTURE });
      expect(nextState.get('currentPicIndex')).eqls(0);
    });
  });
});
