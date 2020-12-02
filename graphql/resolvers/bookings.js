const Booking = require("./../../models/booking");
const Event = require("./../../models/event");
const { dateToString } = require("./../../helpers/date");
const { transformBooking } = require("./merge");

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
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
            return transformBooking(result);
        } catch (error) {
            console.log("error");
            console.log(error);
            throw error;
        }
    },
    cancleBooking: async (args) => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (error) {

        }
    }
}
