const promisesAplusTests = require('promises-aplus-tests')
const Aayega = require('../lib/aayega');

class Adapter {
    static resolved(value) {
        return new Aayega((resolve) => {
            resolve(value);
        });
    }
    static rejected(reason) {
        return new Aayega((resolve, reject) => {
            reject(reason);
        });
    }
    static deferred() {
        let resolve, reject;

        return {
            promise: new Aayega((rslv, rjct) => {
                resolve = rslv;
                reject = rjct;
            }),
            resolve: resolve,
            reject: reject
        };
    }
}

module.exports = Adapter;