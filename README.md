# aayega
aayega is a promises library compliant with promises / a+ spec

## For those with no time to read. 
```
git clone https://github.com/rishabhio/aayega.git
npm install 
npm test 

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

### write the Aayega class with all the basic attributes and methods 