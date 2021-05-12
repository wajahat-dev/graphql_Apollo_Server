const {paginateResult} = require("./utils")
const jwt = require("jsonwebtoken")

module.exports = {

  Query:{
        quakes: async (_, { pageSize = 20, after }, { dataSources }) => {
            const allQuakes = await dataSources.quakeApi.getAllQuakes();
            // we want these in reverse chronological order
            allQuakes.reverse();
            const quakes = paginateResult({
              after,
              pageSize,
              results: allQuakes
            });
            return {
              quakes,
              cursor: quakes.length ? quakes[quakes.length - 1].cursor : null,
              // if the cursor at the end of the paginated results is the same as the
              // last item in _all_ results, then there are no more results after this
              hasMore: quakes.length
                ? quakes[quakes.length - 1].cursor !==
                  allQuakes[allQuakes.length - 1].cursor
                : false
            };
          },
        quake: (_ ,{ id }, context)=>{
            context.dataSources.quakeApi.getQuakeById({quakeId: id})
        },
        users: (_,__,context) => {
            
            return context.dataSources.userApi.getUsers()
        }
        
    },
    Mutation: {
      login: async (_, args, { dataSources }) => {
        const email = args.email
        const user = await dataSources.userApi.getUser(email);
       
        if (user) {
         const token = jwt.sign({
           id: user.id,
           email: user.email
         }, `${process.env.SECRET_KEY}`,{
           expiresIn: 3600
         })
         
         return token
        }

        if(!user){
          console.log("User not in Database")
        }

      },
      saveRecords: async (_, args, context)=>{
        
        const results = await context.dataSources.userApi.saveRecord(args.recordId)
    
        return {
          success: results.length ? true: false,
          message: results.length ? "Quake data Saved Successfully" : "Can't Saved Quake Data",
          records: results
        }
      }
    }

}