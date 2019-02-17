# aayega
aayega is a promises library compliant with promises / a+ spec

## For those with no time to read. 
```
git clone https://github.com/rishabhio/aayega.git
npm install 
npm test 

``` 

# Usage 
```
    npm install aayega 

```

# What is Aayega?
> Aayega is a promises library which is compliant with promises / A+ spec. 

## What is the inspiration behind it?

1. *Aayega* is meant for educational and learning purposes. 
2. Aayega means "it will come" in hindi language and it is a good term to represent the result of an async operation. 

## What are the goals?
1. Goal is not to learn and implement the specification. 
2. Code readibility is the primary focus so new comers to A+ spec can use this as reference. 
3. Use of ES6 features. 


### All steps taken to reach the final outcome are listed below ::::: 

### Step-1 [ Read the specification ] 

It is advised to read the spec at least 5 times if you're like me :) 

Following is what I got ater going through the spec for a few times. 

![A plus implementation](https://raw.githubusercontent.com/rishabhio/aayega/master/assets/aplus.jpg)



By reading the spec a few times, we can easily draw the following inferences >>> 

1. Promise is nothing but a js object / functions which conforms to certain rules. 
2. Every promise has a then method
3. Then method must return a new Promise 
4. then method takes 2 arguments 
5. There's a way called TPRP -> The Promise Resolution Procedure to be followed when resolving 
6. Every promise starts with a pending state 
7. Promise can move from pending -> fulfilled or pending -> rejected 
8. Once fulfilled / rejected, a promise can't change state. 
9. We need to provide an adapter for the testing to take place. 
10. We should install `promises-aplus-tests` to run the tests.

## Let's get in action. 

Our mission is to document almost every step which we take to make our promises library. 

### Step-2 Initialize npm package 

*NOTE* I'm writing these steps on the go so there can be a little up / down in the sequence , but the 
idea is to document most of the steps. 

```
npm init 
```

Run the above command and provide all the details. 


### Step-3 Setup the code structure 
1. `lib` folder to store the code for our library 
2. `tests` folder to store the adapter we write 
3. `index.js` file is the entry point to the package

### Step-4 Run the following command to install the compliance tests package 
```
npm install --save-dev promises-aplus-tests

```

### Step-5 Provide the adapter as mentioned in the specification 
Create the following file in the tests folder. 
```
aayega-adapter.js
```

### Step-6 Write the required functions in the adapter as follows 

check file `aayega-adapter.js` for the relevant code. 

### Step-7 Add the test command in the package.json file 
```
// package.json 
. . .
        "test": "promises-aplus-tests tests/aayega-adapter"

. . . 
```

First time you run `npm test` , it will give 'Cannot find Module' error because we've not yet set 
up the aayega module. Let's do that next.  

### Step-8 In the lib directory, create a module

```
    aayega.js 
```

```
    // Initialize promise structure as per the spec 
    // Please read the inline comments in the code itself for better understanding. 
```

### Step-9 write the Aayega class with all the basic attributes and methods

In short we've to fill in the following structure ::::: 
This is how an `Aayega` aka Promise looks like. 
```
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
        if (asyncOp) {
            asyncOp((value) => {
                runPRP(self, value);
            }, (reason) => {
                self.reject(reason);
            });
        }
    }

    changeState(state, value) {
    }

    executeChain() {

    }
    reject(reason) {

    }
    fulfill(value) {

    }
    then(onFulfilled, onRejected) {

    }
}

``` 

### Step-10 Implementing the PRP aka Promise Resolution Procedure 

```
    Section 2.3 is all about this. Please read the inline comments in code function 
        runPrp to get more details on it. 
```

### The then method

```
     then takes onFulfilled , onRejected an returns a new promise which goes through the PRP via 
        the executeChain method in order to decide on how actually it needs to resolve. 
```

### Step-11 Making the software browser compatible 
I've used a quick / dirty hack to ensure the software can be made useful in browser environment 
as well. 

```
    if (typeof module !== 'undefined') {
        if (typeof module.exports !== 'undefined') {
            module.exports = Aayega;
        }
    } else {
        window.Aayega = Aayega;
    }
```

### Step-12 Run the Test Cases again 

```
    npm test 
```

### Step-13 The feeling of accomplishment 

![A moment of accomplishment](https://raw.githubusercontent.com/rishabhio/aayega/master/assets/success.png)

### Step-14 Launching to NPM 

```
    npm login 
    npm publish 
```

### Step-15 Link to A+ compliant `Aayega` aka Promises lib on npm 


### Step-16 If you want to play around or test the compliance ::::: 

```
    git clone https://github.com/rishabhio/aayega.git
    npm install 
    npm test
```