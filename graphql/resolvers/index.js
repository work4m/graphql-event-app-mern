const bcrypt = require('bcryptjs');

const Event = require("./../../models/event");
const User = require("./../../models/user");
const Booking = require("./../../models/booking");

const events = async (eventIds) => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: user(event._doc.creator)
            };
        });
        // return events;
    } catch (error) {
        throw error;
    }
}

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event.id,
            creator: user(event.creator)
        };
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

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(evnt => {
                return {
                    ...evnt._doc,
                    _id: evnt.id,
                    date: new Date(evnt._doc.date).toISOString(),
                    creator: user(evnt._doc.creator)
                }
            })
        } catch (error) {
            throw error;
        }
    },
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return {
                    ...booking._doc,
                    _id: booking.id,
                    user: user(booking._doc.user),
                    event: singleEvent(booking._doc.event),
                    createdAt: new Date(booking._doc.createdAt).toISOString(),
                    updatedAt: new Date(booking._doc.updatedAt).toISOString()
                }
            });
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
                date: new Date(args.eventInput.date).toISOString(),
                creator: '5fc0022c0473d81e2c588d8e'
            });
            let createdEvents;
            const result = await event.save();
            // console.log(result);
            createdEvents = {
                ...result._doc,
                _id: result.id,
                creator: user(result._doc.creator)
            };
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
    createUser: async (args) => {
        try {
            const userData = await User.findOne({ email: args.userInput.email });
            if (userData) {
                throw new Error('User exist already.');
            }
            const hashPassword = await bcrypt.hash(args.userInput.password, 12)
            const user = new User({
                email: args.userInput.email,
                password: hashPassword
            });
            const result = await user.save();
            // console.log(result);
            // return result;
            return { ...result._doc, password: null, _id: result.id };
        } catch (error) {
            throw error;
        }
    },
    bookEvent: async (args) => {
        try {
            const fetchedEvent = await Event.findById(args.eventId);
            const booking = new Booking({
                user: "5fc0022c0473d81e2c588d8e",
                event: args.eventId
            });
            const result = await booking.save();
            console.log(result);
            return {
                ...result._doc,
                _id: result.id,
                createdAt: new Date(result._doc.createdAt).toISOString(),
                updatedAt: new Date(result._doc.updatedAt).toISOString()
            };
        } catch (error) {
            console.log("error");
            console.log(error);
            throw error;
        }
    },
    cancleBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = {
                ...booking.event._doc,
                _id: booking.event.id,
                creator: user(booking.event._doc.creator)
            };
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (error) {

        }
    }
}