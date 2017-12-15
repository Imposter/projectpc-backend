# ProjectPC Typescript Backend (projectpc-backend)
### Introduction
Project PC is the result of a problem that many people face, finding quality computer parts that wont break the bank. As a university student, I like to save money when I can. So when building my PC, I decided to see if there were cheaper alternatives on the market rather than buying new parts. Unfortunately, there was not and the only way to save money was to buy used. To do this, I went to many existing sites such as Kijiji, and eBay but found there to be no specific category where I could easily find the parts I needed. In addition, parts would often be listed incorrectly as most sellers are not educated in PC parts. ProjectPC takes the hassle and guess work out of buying used PC parts and creates a community of like minded individuals who all have teh same passion. With a few taps you can sell your old PC parts for that new motherboard. Or you can buy that graphics card you always wanted for a fraction of the price.

### Requirements
The following are requirements to compile and run the server:
- Node.js with Node Package Manager (npm) ([How to install](https://nodejs.org/en/download/))
- Typings for Node.js ([How to install](https://www.npmjs.com/package/typings))
- Typescript v2.2 ([How to install](https://www.typescriptlang.org/index.html#download-links))
- MongoDB v3.6 server ([How to install](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/))

### Compiling/Installing
1. Run `npm install` to install Node.js packages
4. Run `tsc` to compile the Typescript code into runnable Javascript (You may receive compiling errors for some Node modules, but those can be ignored)
5. Copy `config-dev.example.json` to `config-dev.json` and substitute `mongo` with your server configuration
6. Change directory to `build` using `cd build`
6. Run server using `node Main.js`
 
###### Note: The server you start will not be used by the application unless the source is modified to connect to the endpoint the server is running on, and will instead use the default server hosted by us.

### Authors
- Thaghsan Mohanarathnam
- Jesse Crouch
- Rameet Sekhon
- Eyaz Rehman