const { EventEmitter } = require("events");
const evm = new EventEmitter();

function EventLogger(){
    const eventList = [];
    this.logEvent = function(title, description){
        let date = new Date();
        // format date and time
        date = `${date.getDay()}-${date.getMonth()+1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        // add new event to the list
        eventList.push({title, description, date});
        
        // emit logged event
        evm.emit("logged", title, description, date);
    }

    this.getEvents = function() {
        return eventList;
    }
}

module.exports = {EventLogger, evm};