# Ben Merchant dot dev - back end

### [Front End Here](https://github.com/benmerchant/benmerchant.dev)


## Update [11:05 on 2019-03-21]
I'm about to go to sleep. I've worked pretty hard this week. The past few days especially. I just can't unpack how Mr. Goldberg is passing his app and router objects around. Plus in my old project I was using router as a function. Kind of confusing. One good thing though, I learned a lot about both Express and Node itself.

Can't go to bed until I have at least one API route fully working and its parent app deployed. 

--------------------------------------------------------------------------
## Update [16:40 on 2019-03-21] - via Yoni Goldberg
[1. Project Structure Practices](https://github.com/i0natan/nodebestpractices#1-project-structure-practices)
  1. ✔ 1.1 Structure your solution by components
    1. Structure your solution by self-contained components
  1. ✔ 1.2 Layer your components, keep Express within its boundaries
    1. Business Logic/DAL doesn't need to meet express
    1. create and pass a custom context object
  1. ✔ 1.3 Wrap common utilities as npm packages
    1. Private modules require paid account, worth it in the future
  1. ✔ 1.4 Separate Express 'app' and 'server'
    1. at least two files:
      1. the API declaration (app.js)
      1. the networking concerns (WWW)
      1. allows testing the API in-process(using supertest), without performing network calls
  1. ✔ 1.5 Use environment aware, secure and hierarchical config
    1. (a) keys can be read from file AND from environment variable
    1. (b) secrets are kept outside committed code
    1. (c) config is hierarchical for easier findability. There are a few packages that can help tick most of those boxes like rc, nconf and config


- Installing express-generator really quickly to get a handle on this `./bin/www` business.

`SyntaxError: Unexpected identifier`

- Installing babel-register babel-preset-env since Node cant handle ES6 yet

More vulnerabilities:
```$ npm install -s-dev babel-register babel-preset-env
+ babel-preset-env@1.7.0
+ babel-register@6.26.0
added 89 packages from 18 contributors and audited 5037 packages in 13.162s
found 2 moderate severity vulnerabilities
  run `npm audit fix` to fix them, or `npm audit` for details

$ npm audit
=== npm audit security report ===
# Run  npm update js-yaml --depth 2  to resolve 2 vulnerabilities

$ npm audit fix
updated 2 packages in 3.46s
fixed 2 of 2 vulnerabilities in 5037 scanned packages

```
https://github.com/developit/express-es6-rest-api/search?q=babel&unscoped_q=babel
https://gist.github.com/sam-artuso/d39dc04650f9455e34549841a8270c82 // presets is dead
https://www.codementor.io/iykyvic/writing-your-nodejs-apps-using-es6-6dh0edw2o
https://babeljs.io/docs/en/babel-node
https://babeljs.io/docs/en/babel-preset-env

https://hackernoon.com/using-babel-7-with-node-7e401bc28b04
```$ npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/node
npm notice save @babel/core is being moved from dependencies to devDependencies
+ @babel/core@7.4.0
+ @babel/cli@7.2.3
+ @babel/node@7.2.2
+ @babel/preset-env@7.4.2
added 109 packages from 61 contributors, updated 1 package and audited 8574 packages in 16.23s
found 0 vulnerabilities


$ npm uninstall babel-preset-env babel-register
removed 81 packages and audited 6598 packages in 3.986s
found 0 vulnerabilities
```

```$ touch .babelrc
$ vi .babelrc
$ mkdir dist
```

Finally got Babel Working. Now transcribing my code so it can be transpiled.
- @i0natan had me thinking `.normalizePort()` was a an express or Node function. It looks like it came from [HERE](https://github.com/Azure-Samples/app-service-web-nodejs-get-started/blob/master/bin/www). But what Do I know.

Also, `bin/www` not working at the moment. Probably because it doesn't have a file type for `Babel` to hook on too.

* added a `.env` to help with my configurations
* import via command line later. dont want to wreck the scritps
------------------------------------------------------------------------------

Trying to make something out of this mess. Every commit before this one was my first true attempt to make something with knowledge only of `JavaScript`, not `MEAN`. Also, going to try to track my progress. I heard that you don't need to timestamp everything since that is inherent in `git`. I'll do my best.

* Didn't even have a `.gitignore`. As a result, I pushed `/node_modules` last year. Let's remedy that.
*Checked Windows Explorer for size of the folder
Size: 49.0 MB (51,414,395 bytes)
Contains: 10,574 Files, 1,628 Folders*

- [x] `touch .gitignore`
- [x] `vi .gitignore`
- [x] (You can figure out how to insert text and exit I'm sure)
- [x] `rm -rf node_modules`

* Six security alerts:
1. lodash -       low severity
1. just-extend -  low severity
1. mpath -        low severity
1. extend -       low severity
1. deep-extend -  high severity
1. cryptiles -    high severity


* Check out [package.json](https://github.com/benmerchant/benmerchant.dev-backend/blob/1743ef68cefb5a0c632d2759c422f048c66cb7d3/package.json) from `1743ef6` on May 3, 2018 (the most recent commit).

* Going to attempt `npm install` with carats on all of the current packages. See if they'll still work together. At their respective highest major version. It will also be interesting to see if the security warnings go away. Going to commit first.

- [x] `npm install`
- `package.json` didn't change one bit at all. I figured with the carats at least some of the modules would move up a minor version.
- `package-lock.json` changed a lot. Many sub-dependencies. Maybe we'll delve another day


```
added 806 packages from 1120 contributors and audited 3184 packages in 30.516s
found 26 vulnerabilities (5 low, 18 moderate, 3 high)
  run `npm audit fix` to fix them, or `npm audit` for details
```
*Just realized this would be better as a Medium article. But who's going to read it anyways.*

- [x] `npm audit`
- [ ] Parse and link audit report later.

##### Here are the highlights:
* `Run  npm install --save-dev nyc@13.3.0  to resolve 12 vulnerabilities`
* `Run  npm install mongoose@5.4.19  to resolve 2 vulnerabilities`
* `Run  npm install --save-dev morgan@1.9.1  to resolve 1 vulnerability`
* `Run  npm install --save-dev nodemon@1.18.10  to resolve 3 vulnerabilities`
* `Run  npm update jws --depth 2  to resolve 3 vulnerabilities`
* `Run  npm update request --depth 2  to resolve 2 vulnerabilities`
* `Run  npm update lodash --depth 2  to resolve 1 vulnerability`
* `Run  npm update handlebars --depth 2  to resolve 1 vulnerability`
* `Run  npm update nise --depth 2  to resolve 1 vulnerability`

- [x] `npm audit fix`

```
+ morgan@1.9.1
+ nodemon@1.18.10
+ mongoose@5.4.19
added 39 packages from 51 contributors, removed 48 packages and updated 47 packages in 30.248s
fixed 14 of 26 vulnerabilities in 3184 scanned packages
  1 package update for 12 vulns involved breaking changes
  (use `npm audit fix --force` to install breaking changes; or refer to `npm audit` for steps to fix these manually)
```

##### Don't want to break it, since it does technically work right now... So:
- [x] `npm audit`

##### Well, since they are all `nyc` and I wasn't planning on worrying about code coverage in this sprint, I'm going to do the force option to see what happens.
- [x] `npm audit fix --force`

`npm WARN using --force I sure hope you know what you are doing.`

*Spoiler Alert: I do not.*

```
> fsevents@1.2.7 install Y:\bmdev-back\node_modules\fsevents
> node install

+ nyc@13.3.0
added 108 packages from 88 contributors, removed 220 packages, updated 67 packages and moved 1 package in 13.293s
fixed 12 of 12 vulnerabilities in 4048 scanned packages
  1 package update for 12 vulns involved breaking changes
  (installed due to `--force` option)
```

### Lets try it out, see what happens
But first, `package.json` did change after the `--force`:
`mongoose`  from 5.0.16 to 5.4.19
`morgan`    from 1.9.0 to 1.9.1
`nodemon`   from 1.17.3 to 1.18.10
`nyc`       from 11.7.1 to 13.3.0

#### New self-question: How do you [Semantically Version](https://semver.org/) software?

- [x] `npm test`

Wait a second. I don't have MongoDB running...
I use a regular CMD for that. So, I can click on GitBash and only one window pop up.

- [x] `mongod` // its nice since it's a PATH variable now.

Let's try that again:

- [x] `npm test`

Too long for here. Relevant snippets:
```(node:11724) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
(node:11724) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
(node:11724) DeprecationWarning: collection.remove is deprecated. Use deleteOne, deleteMany, or bulkWrite instead.
(node:11724) DeprecationWarning: collection.findAndModify is deprecated. Use findOneAndUpdate, findOneAndReplace or findOneAndDelete instead.
...

20 passing (5s)
2 failing

1) Employees
     LOGIN / LOGOUT
       it should not login employee if email not in database:

    Uncaught AssertionError: expected { Object (_events, _eventsCount, ...) } to have status code 200 but got 400


2) Roles
     /POST create new role
       it should not POST a new role without salaried field - Mongoose:

    Uncaught AssertionError: expected { Object (_events, _eventsCount, ...) } to have status code 200 but got 500

----------------------------|----------|----------|----------|----------|-------------------|
File                        |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------------------------|----------|----------|----------|----------|-------------------|
All files                   |    67.66 |    37.23 |    46.27 |    73.77 |                   |
----------------------------|----------|----------|----------|----------|-------------------|
npm ERR! Test failed.  See above for more details.

```

If I say so myself, those are some well-written tests that just document themselves. And even after forcing NPM to give us new modules, only two tests failed.

Now, the badges on the original repo say
[![Build Status](https://travis-ci.org/benmerchant/StartPOS-backend.svg?branch=master)](https://travis-ci.org/benmerchant/StartPOS-backend)
[![Coverage Status](https://coveralls.io/repos/github/benmerchant/StartPOS-backend/badge.svg?branch=master)](https://coveralls.io/github/benmerchant/StartPOS-backend?branch=master).

So, what has changed?

For one, I was using node -v 8 before. Now, my local machine is
```$ node -v
v10.15.3
```

Let's ignore the `.travis.yml` and `.coveralls.yml` for now. Well, coveralls is empty, so, delete.
```vi .gitignore
```

'[a]'

'.travis.yml'

':wq'

#### One more thing before a break and a switching of gears.
There is a /coverage folder with beautifully illustrated breakdowns of the code coverage in HTML. It didn't generate any just now. I wonder why. Either way. Since they'll be in older commits, I'm going to delete them. It will be in previous commits, I'm going to delete it from the repo before this new commit. Should you gitignore them or go ahead and post them. Might confuse some people. I sure was last year.


Now I'm confused. After that bit of housekeeping, I ran `npm test` again.

## All Tests passed!
``` 47 passing (6s)

----------------------------|----------|----------|----------|----------|-------------------|
File                        |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
----------------------------|----------|----------|----------|----------|-------------------|
All files                   |    88.32 |    65.96 |    94.03 |    96.07 |                   |
----------------------------|----------|----------|----------|----------|-------------------|
```

I'm not sure. But that means we are good to go.

# Start your server!
```$ nodemon
[nodemon] 1.11.0
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node server.js`
(node:6264) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.
Server listening on port 3005
Mongoose connected to mongodb://localhost/startpos
(node:6264) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
```
Let's fix these Deprecation Warnings.
I'm not using MongoClient. Mongoose is. So Let's try to upgrade that.
- I have the latest version installed. Not sure about those warnings.

Nothing happened as a result of updating Mongoose.
```$ npm list mongodb-core
BenMerchant.dev-backend@0.3.0 Y:\bmdev-back
`-- mongoose@5.4.19
  +-- mongodb@3.1.13
  | `-- mongodb-core@3.1.11  deduped
  `-- mongodb-core@3.1.11
  ```
No idea how to get rid of warnings.
------------------------------------------------------------------------------
[Found this article a couple weeks ago.](https://medium.com/@me_37286/yoni-goldberg-javascript-nodejs-testing-best-practices-2b98924c9347)
Node.js & JavaScript Testing Best Practices (2019) by @i0natan

Mainly, the controllers and models need rearranged by feature or type, like the tests, not the way they are, by type of file or module.
Very similar to what people were saying about AngularJS. It's strange that EVERY SINGLE tutorial does it the "less good" way.

1. He mentions testing immediately
  1. test needs 3 parts
  1. BDD-style
  1. Lint w/ test linters
  1. black box
  1. mocks >>> stubs/spies
  1. use realistic fake data
  1. property based Testing
  1. stay within the test
  1. avoid globals
  1. expect errors, not catch
  1. tag tests

... Just realized all fifty points here are on testing.

Here's [another article.](https://medium.com/@me_37286/19-ways-to-become-a-better-node-js-developer-in-2019-ffd3a8fbfe38)

1. more types/schemas (Typescript)
1. enrich linters
  1. eslint-plugin-chai-expect  - can discover tests without assertions
  1. eslint-plugin-promise      - can discover promises with no resolve (your code will never continue)
  1. eslint-plugin-security     - can discover eager regex expressions that might get used for DOS attacks

Finally found what i wanted:
[1. Project Structure Practices](https://github.com/i0natan/nodebestpractices#1-project-structure-practices)
  1. ✔ 1.1 Structure your solution by components
  1. ✔ 1.2 Layer your components, keep Express within its boundaries
  1. ✔ 1.3 Wrap common utilities as npm packages
  1. ✔ 1.4 Separate Express 'app' and 'server'
  1. ✔ 1.5 Use environment aware, secure and hierarchical config

Going to start over at the top.
