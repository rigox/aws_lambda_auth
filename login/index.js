const AWS =  require("aws-sdk")
const bcrypt =  require("bcryptjs")
const config =  require("./config.json")
const dynamo = new AWS.DynamoDB();
var cognitoidentity = new AWS.CognitoIdentity({region: 'us-east-1'});


//finds a user
const findUser = async(email)=>{
    
 const params  = {
       Key:{
           "Email":{"S":email}
       },
       TableName: "Users"
 }

 try {
       const result =  await dynamo.getItem(params).promise()
       console.log("in Functino", result)
       return result
 } catch (error) {
       console.log(error)
       return error
 }

}
////////////////////
//validates user 
const validateUser  = async(password,hashPassword)=>{
    
    try {
         const isPassword = await bcrypt.compare(password,hashPassword)
     
     return isPassword;
    } catch (e) {
        
    }
    
}
////////

const getID = async()=>{
 
        let param = {
		IdentityPoolId: config.IDENTITY_POOL_ID,
		Logins: {} // To have provider name in a variable
	};
	
param.Logins[config.DEVELOPER_PROVIDER_NAME] = config.DEVELOPER_PROVIDER_NAME
const data = await cognitoidentity.getOpenIdTokenForDeveloperIdentity(param).promise()


return data 

    
}


/////////

const buildResponse =  async(code,data)=>{
   const response = {
        'statusCode':code,
        'headers': {
            "Content-Type": "application/json"
        },
        'body':JSON.stringify(data)
   }    
   
   return response
}

///////



exports.handler = async(event,context) =>{
    let body =  JSON.parse(event.body)
    let email =  String(body.Email)
    let password =  String(body.Password)

    try {
    const user =  await findUser(email)
    let hashPassword = String(user.Item.hashPassword.S)
    const isUser =  await validateUser(password,hashPassword)
    if(isUser){
        
      let tokens =  await getID()
      
      let response  = await buildResponse(200,tokens)
      
      
      return response
          
       
   
    
    }else{
        
     let response = {
         "statusCode":404,
         
         "headers": {
            "Content-Type": "application/json"
        },
         "body":JSON.stringify({msg:"User not found"})
    }
    
    return response
        
    }
      } catch (e) {
          
          let response = {StatusCode:500,body:JSON.stringify(e)}  
          
          return response
        
      }

    
}