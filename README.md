# Vue Fast
A super fast Vue dev environment powered by [`snowpack`](https://www.snowpack.dev/) and [`babel`](https://babeljs.io/).

More information about this idea in this snowpack blog post called [A Future Without Webpack
](https://www.pika.dev/blog/pika-web-a-future-without-webpack/).

## Getting Started
Install the dependencies!
```
npm i
```

Then, run snowpack!
```
npx snowpack
```

## Running the Dev Server
Just run the `babel` in one tab and `servor` in another :)
```
# Run this in one tab
# You will get a warning saying "could not resolve "/web_modules/vue/dist/vue.esm-browser.js" in file XXX"
# which you can ignore!
npx babel src/ --out-dir lib --watch --extensions ".ts"

# And also run this in parallel in another tab
npx servor --reload
```

## Caveats
1. This would not be good to use in a production website.
2. You cannot use `.vue` files ATM. There are solutions out there but they're not simple. Snowpack is currently looking for someone to write a "short guide for authoring .vue SFC’s and then compiling them to valid JS".
3. We still use babel. I think this would be hard to get rid of given our use of TypeScript and module aliasing. A faster alternative is [sucrase](https://github.com/alangpierce/sucrase) which is an "alternative to Babel that allows super-fast development builds".
