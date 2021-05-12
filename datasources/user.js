const {DataSource } = require('apollo-datasource')


class UserApi extends DataSource{
    constructor(obj){
        super();
        this.store = obj
        
    }

    initialize(config){
        this.context = config.context
    }

    async getUsers(){
        const users = await this.store
        console.log(this.store)
        return users
    }

    async getUser(emailArg){
        
        let index = 0;
        const email = this.context && this.context.user ?
        this.context.user.email : emailArg

        const theUser = this.store.map(user =>{
            if(email === user.email){ 
                index = this.store.indexOf(user)
                return user
            }
        })
        
        return theUser[index]
    }

    async saveRecord(recordId){
        
        const userId = this.context.user
        
        if(!userId){
            console.log("No User on Context")
        } else{
            console.log("User on Context")
        }
        const userCheck = this.store.map(user => {
            
            if(recordId === user.id){
                
                user.records.push({id:recordId})
                return user
            }
        })
        console.log(userId)
        
        
        let users = []
        await userCheck.forEach(elem =>{
            if(elem){
                users.push(elem)
            }
        })
 
      
        return users[0].records.length > 4 ? users[0].records : "Oh, noses!"
    }

}



module.exports = UserApi