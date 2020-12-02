const bcrypt = require('bcryptjs');
const User = require("./../../models/user");

module.exports = {
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
}