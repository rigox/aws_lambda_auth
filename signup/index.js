const AWS =  require("aws-sdk")
const  bcrypt =  require("bcryptjs")

const dynamo  =  new AWS.DynamoDB()



exports.handler = async(event,context) =>{
  let body =  JSON.parse(event.body)
  const  userPassword = String(body.password)
  const email =  String(body.email)
  const salt =  await bcrypt.genSalt(10)
  const hashPassword =  await bcrypt.hash(userPassword,salt)

  const response = {
      statusCode:200
  }

  dynamo.putItem({
       TableName:config.DDB_TABLE,
       Item:{
            email:{
                S: email
            },
            hashPassword:{
                S:hashPassword
            }
       }

  })

  console.log("Response",response)
  console.log(event.body)
  return response;

}