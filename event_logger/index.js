const {EventLogger, evm} = require('./logger');

const event1 = new EventLogger();

// event listener
evm.on("logged", (title, description, date)=>{
    console.log({title, description, date});
});
event1.logEvent("Weddimg Ceremony", "details about the program");
event1.logEvent("Weddimg Ceremony2", "details about the program2");
event1.logEvent("Weddimg Ceremony3", "details about the program3");
event1.logEvent("Weddimg Ceremony4", "details about the program4");


// display events
console.log("\n\n All Event logged");
console.table(event1.getEvents())