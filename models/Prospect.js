const { model, Schema } = require("mongoose");

const ProspectSchema = new Schema({
    fname: {
        type: String 
    },
    Lname: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    provider: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: "Incomplete"   
    },
    driver_license: [
        {
            DofBirth: String,
            Number: String,
            State: String,
        }
    ],
    user: {
        type: String,
    }
})

module.exports = model("Prospect", ProspectSchema);