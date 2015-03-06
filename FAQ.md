# FAQ (Frequently Asked Questions)

### Where is the documentation?
+ Documentation for this module is in the README.md file.

### What is an adapter?

 Adapters expose **interfaces**, which imply a contract to implement certain functionality. This allows us to guarantee conventional usage patterns across multiple models, developers, apps, and even companies, making app code more maintainable, efficient, and reliable.  Adapters are useful for integrating with databases, open APIs, internal/proprietary web services, or even hardware.

### What kind of things can I do in an adapter?

Adapters are mainly focused on providing model-contextualized CRUD methods.  CRUD stands for create, read, update, and delete.  In Waterline, we call these methods `create()`, `find()`, `update()`, and `destroy()`.

For example, a `MySQLAdapter` implements a `create()` method which, internally, calls out to a MySQL database using the specified table name and connection informtion and runs an `INSERT ...` SQL query.

In practice, your adapter can really do anything it likes-- any method you write will be exposed on the raw connection objects and any models which use them.

## What is an Adapter Interface?

> For more information, check out the [adapter interface reference](https://github.com/balderdashy/sails-docs/blob/master/adapter-specification.md).

### Why haven't I gotten a response to my feature request?

When people see something working in practice, they're usually a lot more down to get on board with it!  That's even more true in the open-source community, since most of us are not getting paid to do this (myself included).  The best feature request is a pull request-- even if you can't do the whole thing yourself, if you blueprint your thoughts, it'll help everyone understand what's going on.

### I want to make a sweeping change / add a major feature
It's always a good idea to contact the maintainer(s) of a module before doing a bunch of work.  This is even more true when it affects how things work / breaks backwards compatibility.

### How do I get involved?

+ [Contributing to this module](./CONTRIBUTING.md)
+ If you find a bug with this module, please submit an issue to the tracker in this repository.  Better yet, send a pull request :)

### More questions?

> If you have an unanswered question that isn't covered here, and that you feel would add value for the community, please feel free to send a PR adding it to this section.