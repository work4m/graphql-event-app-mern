const Event = require("./../../models/event");
const User = require("./../../models/user");
const { dateToString } = require("./../../helpers/date");
const { transformEvent } = require("./merge");

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(evnt => {
                return transformEvent(evnt);
            })
        } catch (error) {
            throw error;
        }
    },
    createEvent: async (args) => {
        try {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: dateToString(args.eventInput.date),
                creator: '5fc0022c0473d81e2c588d8e'
            });
            let createdEvents;
            const result = await event.save();
            // console.log(result);
            createdEvents = transformEvent(result);
            const existingUser = await User.findById('5fc0022c0473d81e2c588d8e');
            if (!existingUser) {
                throw new Error('User not exist.');
            }
            existingUser.createdEvents.push(event);
            await existingUser.save();
            return createdEvents;
        } catch (error) {
            throw error;
        }
    },
}
