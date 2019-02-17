(() => {
    // STATES a promise can be in. Inspired from traffic lights we'all know about. 
    const STATES = {
        PENDING: 'YELLOW',
        FULFILLED: 'GREEN',
        REJECTED: 'RED'
    };

    /**
     * Helpers is a set of helper methods belonging to no specific class 
     * For example :::: Factory Method getNewPromise and Validator method are both in the same set. 
     * Helpers are not meant to belong to a specific set of methods , they're just to keep things togehter.
     */
    const Helpers = {
        getNewPromise: () => {
            // A simple method which returns a new Promise 
            return new Aayega();
        },
        asyncOp: (asyncOperation) => {
            // "micro-task” mechanism described in section 3. Notes of the A+ spec. 
            process.nextTick(asyncOperation);
        },
        isFunc: (val) => {
            return typeof val === "function";
        },
        isObject: function(val) {
            if (val)
                return typeof val === "object";
            return false;
        },
        isPromise: function(val) {
            if (val)
                return val.constructor === Aayega;
            return false;
        },
        isValidState: (state) => {
            // returns whether the state is one of the valid states 
            return ((state === STATES.PENDING) ||
                (state === STATES.REJECTED) ||
                (state === STATES.FULFILLED));
        }
    };


    /**
     * 
     * @param {*} newPromise    
     * @param {*} oldPromiseVal 
     *          
     *          As per spec ::: there's a PRP viz Promise Resolution Procedure 
     *          runPRP implements section 2.3 The Promise Resolution Procedure
     *          of the spec. 
     */
    const runPRP = (newPromise, oldPromiseVal) => {
        if (newPromise === oldPromiseVal) {
            // this if blocks implements 2.3.1
            newPromise.changeState(STATES.REJECTED, new TypeError("Identity ERR"));
        } else if (Helpers.isPromise(oldPromiseVal)) {
            // spec 2.3.2 if value is a promise, new promise should adopt the state 
            if (oldPromiseVal.state === STATES.PENDING) {
                oldPromiseVal.then(function(val) {
                    runPRP(newPromise, val);
                }, function(reason) {
                    newPromise.changeState(STATES.REJECTED, reason);
                });
            } else {
                newPromise.changeState(oldPromiseVal.state, oldPromiseVal.value);
            }
        } else if (Helpers.isObject(oldPromiseVal) || Helpers.isFunc(oldPromiseVal)) {
            // spec 2.3.3 if value is an object or function 
            let called = false;
            var thenCallback;
            try {
                thenCallback = oldPromiseVal.then;

                if (Helpers.isFunc(thenCallback)) {
                    thenCallback.call(oldPromiseVal,
                        function(v) {
                            if (!called) {
                                runPRP(newPromise, v);
                                called = true;
                            }
                        },
                        function(r) {
                            if (!called) {
                                newPromise.reject(r);
                                called = true;
                            }
                        });
                } else {
                    newPromise.fulfill(oldPromiseVal);
                    called = true;
                }
            } catch (e) {
                if (!called) {
                    newPromise.reject(e);
                    called = true;
                }
            }
        } else {
            newPromise.fulfill(oldPromiseVal);
        }
    }


    /**
     *      Class: Aayega describes the blueprint for the promise objects realisation 
     */
    class Aayega {
        constructor(asyncOp) {
            const self = this;

            this.value = null;
            this.state = STATES.PENDING;
            this.queue = [];
            this.handlers = {
                fulfill: null,
                reject: null
            };

            // Note that there's always an async operation associated with a promise 
            // Following is where that async operation is actually called
            // And upon success / failure of that operation 
            // corresponding Resolve / Reject are called.  
            if (asyncOp) {
                asyncOp((value) => {
                    runPRP(self, value);
                }, (reason) => {
                    self.reject(reason);
                });
            }
        }

        changeState(state, value) {
            if (this.changeGuard(state, arguments.length)) {
                return;
            }

            this.value = value;
            this.state = state;
            this.executeChain();
        }

        changeGuard(state, argsLen) {
            return (this.state === state ||
                this.state !== STATES.PENDING ||
                !Helpers.isValidState(state) ||
                argsLen !== 2)
        }

        executeChain() {
            const that = this,
                fulfillFallBack = function(value) {
                    return value;
                },
                rejectFallBack = function(reason) {
                    throw reason;
                };

            if (this.state === STATES.PENDING) {
                return;
            }

            Helpers.asyncOp(function() {
                while (that.queue.length) {
                    const chainedPromise = that.queue.shift();
                    let handler = null,
                        value;

                    if (that.state === STATES.FULFILLED) {
                        handler = chainedPromise.handlers.fulfill || fulfillFallBack;
                    } else if (that.state === STATES.REJECTED) {
                        handler = chainedPromise.handlers.reject || rejectFallBack;
                    }

                    try {
                        value = handler(that.value);
                    } catch (e) {
                        chainedPromise.changeState(STATES.REJECTED, e);
                        continue;
                    }

                    runPRP(chainedPromise, value);
                }
            });
        };
        reject(reason) {
            this.changeState(STATES.REJECTED, reason);
        }
        fulfill(value) {
            this.changeState(STATES.FULFILLED, value);
        }

        /**
         * 
         * @param {*} onFulfilled 
         * @param {*} onRejected 
         *     then takes onFulfilled , onRejected an returns a new promise which goes through the PRP via 
         *     the executeChain method in order to decide on how actually it needs to resolve. 
         */
        then(onFulfilled, onRejected) {
            const chainedPromise = Helpers.getNewPromise();
            if (Helpers.isFunc(onFulfilled)) {
                chainedPromise.handlers.fulfill = onFulfilled;
            }

            if (Helpers.isFunc(onRejected)) {
                chainedPromise.handlers.reject = onRejected;
            }

            this.queue.push(chainedPromise);
            this.executeChain();

            return chainedPromise;
        };
    }

    // a quick dirty hack to ensure the code runs on browser as well as server env 
    if (typeof module !== 'undefined') {
        if (typeof module.exports !== 'undefined') {
            module.exports = Aayega;
        }
    } else {
        window.Aayega = Aayega;
    }

})();