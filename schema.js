const {gql} = require('apollo-server')



const typeDefs = gql`

    type RecordUpdateResponse{
        success: Boolean!
        message: String
        records: [Quake]
    }

    type Mutation{
        saveRecords(recordId: ID!): RecordUpdateResponse!
        deleteRecords(recordId: ID!): RecordUpdateResponse!
        login(email: String, password: String): String
    }

    type Quake {
        id: ID!
        location: String
        magnitude: Float
        when: String
        cursor: String
      }

    type User {
        id: ID!
        username: String!
        email: String!
        password: String!
        records: [Quake]
      }

    type Query{
        quakes(
            pageSize: Int
            after: String
        ): QuakeConnection!
        quake(id: ID!): Quake
        users: [User]
        me: User
    }

    type QuakeConnection{
        cursor: String!
        hasMore: Boolean!
        quakes: [Quake]!
    }

   

`


module.exports = typeDefs