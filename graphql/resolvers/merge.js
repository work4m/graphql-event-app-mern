const Event = require("./../../models/event");
const User = require("./../../models/user");
const { dateToString } = require("./../../helpers/date");

const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return transformEvent(event);
        });
        // return events;
    } catch (error) {
        throw error;
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (error) {
        throw error;
    }
}

const user = async (userId) => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events(user._doc.createdEvents)
        };
    } catch (error) {
        throw error;
    }
}


const transformBooking = (booking) => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user(booking._doc.user),
        event: singleEvent(booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    };
}


const transformEvent = (event) => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: user(event._doc.creator)
    };
}

module.exports = {
    // user,
    // singleEvent,
    transformBooking,
    transformEvent,
    // events
};
