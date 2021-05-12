const {ApolloServer} = require('apollo-server')
const typeDefs = require('./schema')
const resolvers = require("./resolvers")
const QuakeApi  = require("./datasources/quake")
const UserApi = require("./datasources/user")
const {createStore} = require("./utils")
const jwt = require("jsonwebtoken")


const store = createStore()



const server = new ApolloServer({
    context: async ({ req }) => {
        
        // simple auth check on every request
        // const auth = (req.headers && req.headers.authorization) || '';
        const auth = req.headers?.authorization || ''
    
        let email = ""
        let token = ""

        const getToken = () => {
            return auth.split(" ")[1]
        }
        if (auth.length && auth.split(" ")[1]) {
            token = getToken()
        }
        if (token !== "") {
            email = jwt.verify(token, `${process.env.SECRET_KEY}`).email
        }

        
        // find a user by their email
        const usercheck = await store.map(user => {
            if (email === user.email) {
                return user
            }
        });

      

        let users = []
        await usercheck.forEach(elem => {
            if (elem) {
                users.push(elem)
            }
        })
        const user = users && users[0] ? users[0] : null;
        return { user };
      }, 
      
    typeDefs,
    resolvers,

    dataSources: ()=> ({
        quakeApi: new QuakeApi(),
        userApi: new UserApi(store)
    })
})


server.listen().then((res)=>{
    console.log(`Server is running at ${res.url}`)
})