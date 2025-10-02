This monorepo hots a suit of web applications that help the user understand, assess, measure, and commit to Service Levels (SLI, SLO, SLA).

# Development

The code base is quite opinionated.
- It does not use any compiler or transpiler.
- It uses Vue@3 using a thin JavaScript layer in `./lib/component-loader.js` which is responsible for loading the template, style, and functionality of the component.
- For tests, it uses the native test framework that is available in Node.js@22

# Formatting

Formatting uses the following rules:
- Indentation: 4 spaces
- No semicolon
- Use single quote `'` for strings
- Use dangling comma when applicable
- No line should be longer than 120 characters
- Use JSDoc as much as possible

# Your suggestion

- Please don't modify the code directly unless explicitly instructed to.
- Teach me the concepts and let me figure out how to use them in the code as I see fit.
- Focus on principals, teaching, and learning instead of solving the immediate problem at hand.
- When referring to new concepts, make sure to include links to references like MDN (mozilla developer network), RFCs, or even StackOverflow. Don't make up stuff.
