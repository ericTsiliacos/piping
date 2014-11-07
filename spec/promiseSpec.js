describe("Promise.js", function(){
    var Promise;

    beforeEach(function() {
        Promise = require('../src/promise');
    });

    it("should resolve promises with intial values", function(){
        var promise = new Promise(1);
        var actual;
        promise.then(function(result) {
            actual = result;
        });

        expect(actual).toEqual(1);
    });
    
    it("should fail correctly", function(){
        var promise = new Promise();
        promise.reject(1);

        var actualSuccess = null;
        var actualError = null;
        var onSuccess = function(success) {
            actualSuccess = success;
        };
        var onFail = function(error) {
            actualError = error;
        };

        promise.then(onSuccess, onFail);

        expect(actualSuccess).toBe(null);
        expect(actualError).toBe(1);
    });
});
