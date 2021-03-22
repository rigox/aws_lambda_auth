const AWS =  require("aws-sdk")


const dynamo = new AWS.DynamoDB().DocumentClient()

const findUser = async(email)=>{
    
 const params  = {
       key:{
           "Email":{"S":email}
       },
       TableName: "Users"
 }

 try {
       const result =  await dynamo.getItem(params).promise()
       return result
 } catch (error) {
       return error
 }

}


exports.handler = async(event,context) =>{
    let body =  JSON.parse(event.body)
    
    const user =  await  findUser(body.email)
   
    const response = {
         status:200
    }
    
    response.user = user
  
    return response;


    
}