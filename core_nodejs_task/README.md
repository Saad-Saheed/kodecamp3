# Explain the following to the best of your ability

- **a. Reactor pattern**
- **b. Callback pattern**
- **c. The module system**

> ## Reactor pattern
because of the fact that I/O operator are slow and take more time to complete, in a syncronous execution, when their is I/O call the thread will need to wait for it to complete before it can continue its execution, this  is called I/O blocking. But Reactor pattern is mainly used in an asynchronous/Non blocking I/O execution which make sure that an handler is associate to each I/O operation, which will be invoke when event is produced and processed by the event loop.

### Steps Involved
1. The application generates a new I/O operation by submitting a request to the Event Demultiplexer. 
The application also specifies a handler, which will be invoked when the operation completes. Submitting a new request to the Event Demultiplexer is a non-blocking call and it immediately returns the control back to the application.
2. When a set of I/O operations completes, the Event Demultiplexer pushes the new events into the Event Queue.
3. At this point, the Event Loop iterates over the items of the Event Queue.
4. For each event, the associated handler is invoked.
5. The handler, which is part of the application code, will give back the control to the Event Loop when its execution completes 
 - 5a. However, new asynchronous operations might be requested during the execution of the handler 
 - 5b. causing new operations to be inserted in the Event Demultiplexer, before the control is given back to the Event Loop.
6. When all the items in the Event Queue are processed, the loop will block again on the Event Demultiplexer which will then trigger another cycle.

> ## Callback Pattern
In node.js an asynchronous operation will invoke a function upon the completion of its operation, this function is called a callback function. this callback function takes two parameters, the first parameter used to be an error or null, and the second parameter is the data returned.

> ## The Module System
To keep our application maintainable it's a good practice to split the different logic into smaller pieces that have specific responsibilities and then import these pieces of logic into the main application for reuse. In Node.js we are given a module system which enable application developers to abstract logic into modules, export the modules to be used else where in our application.