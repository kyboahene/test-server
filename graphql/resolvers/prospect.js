const { UserInputError } = require("apollo-server-errors");
const Prospect = require("../../models/Prospect");
const User = require("../../models/User");
const { validProspectInput, validDLicenseInput } = require("../../util/validate");

module.exports = {
    Query: {
        //Get all prospects
        async getProspects(){
            try{
                const prospects = await Prospect.find().sort({ createdAt: -1});
                return prospects;
            } catch(err){
                throw new Error(err);
            }
        },

        //Get a prospect
        async getProspect(_, { prospectId }){
            try{
                const prospect = await Prospect.findById(prospectId);
                if(prospect){
                    return prospect;
                } else {
                    throw new Error("Prospect not found");
                }
            } catch(err){
                throw new Error(err);
            }
        }
    },

    Mutation: {
        //add a prospect
        async addProspect(_, {prospectDetails}){
            const { username, fname, Lname, email, phone} = prospectDetails;

            //validate prospect's inputs
            const { valid, errors } = validProspectInput(fname, Lname, email, phone);
            if(!valid){
                throw new UserInputError("Errors", {errors});
            }

            //check whether Prospect exist
            const prospect = await Prospect.findOne({ email });
            if(prospect){
                throw  new UserInputError("Prospect already exists", {
                    errors: {
                        general: 'This Prospect already exists'
                    }
                })
            }

            const user = await User.findOne({ username });

            if(user){
                //create new prospect
                const newP = new Prospect({
                    fname: fname,
                    Lname: Lname,
                    email: email,
                    phone: phone,
                    user: user._id
                });

                const res = await newP.save();
                return{
                    ...res._doc,
                    id: res.id
                }
            }else {
                throw new Error("Prospect was not created!!!");
            }
        },

        //delete a prospect
        async deleteProspect(_, {ProspectId}){
            try{
               const prospect = await Prospect.findById(ProspectId);
               await prospect.delete();

               return "Prospect Deleted Successfully"
            } catch(err){
                throw new Error(err);
            }        
        },
        
        //add driver's info
        async addDriverLincense(_, {ProspectId, DofBirth, Number, State}){
           
            //validate inputs
            const { valid, errors } = validDLicenseInput(DofBirth, Number, State);
            if(!valid){
                throw new UserInputError("Errors", {errors});
            }

            const res = await Prospect.findOneAndUpdate(
                {_id: ProspectId},
                {$addToSet: {
                    driver_license : {
                        DofBirth: DofBirth,
                        Number: Number,
                        State: State
                        }
                    },
                },
                {new: true}
            )

            if (res) {
                console.log(res);
                return res;
            }else{
                throw new UserInputError("Driver's license couldn't be added!");
            }
        },

        //add Provider
        async addProvider(_, {ProspectId, Provider}){
            if(Provider.trim() == ""){
                throw new UserInputError("Errors", {
                    errors: {
                        Provider: "Provided is required"
                    }
                })
            }

            try{
                const res = await Prospect.findOneAndUpdate({_id: ProspectId}, {provider: Provider}, {new: true})
                return res;
            } catch(err){
                throw new Error(err);
            }
        }
    }
}