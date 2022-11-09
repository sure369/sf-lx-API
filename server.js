const express = require("express");
const app = express();
const dotenv = require("dotenv")
const port = 5600;
const jsforce = require('jsforce');
const cors = require("cors");
dotenv.config({ path: "config.env" })
const bodyParser = require('body-parser');
var oauth2 = new jsforce.OAuth2({
  loginUrl: 'https://gulfsothebysinternational--cddev.sandbox.my.salesforce.com',
  clientId: '3MVG9GXbtnGKjXe7F9lwjAiAmI0L4sNQkwMccr1wXX8E6k_R_hM.B0QCl23_lvLpJAMeLUnIK4DANKwKRQ0Ot',
  clientSecret: '970ACB43CDD44544F5C3C432A941FFE2C1CAC9A160009D6F1C26742EF7C61D31',
  redirectUri: `http://localhost:3001/redirect`,
});
var token = "";
var userid = "";
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(cors());


app.post('/connection', (req, res) =>{
  console.log('inside node')
  const conn = new jsforce.Connection({ oauth2: oauth2 });
  conn.authorize(req.query.code, (err, userInfo) => {
    if (err) {
      return console.error(err);
    }
    console.log("Demo user site ", userInfo);
    userid = userInfo.id
    console.log("inside demo user id " + userid)
    console.log("Access Token", conn.accessToken);
    token = conn.accessToken
    res.header('Token', token);
    res.send(token);
  });
});
app.post('/userdetails', (req, res) => {
  console.log("inside user details  ")
  console.log("user id inside user details ", userid)
  let token = req.headers.token;
  // console.log('token user detials record ', token);
  var conn = new jsforce.Connection({
    instanceUrl: 'https://gulfsothebysinternational--cddev.sandbox.my.salesforce.com',
    accessToken: token
  });
  conn.query("SELECT  id,Name FROM User WHERE Id='" + userid + "'", (err, result) => {
    if (err) {
      console.log("error log ", err)
    }
    else {
      // console.log("inside user detials  ", result)
      // console.log('name', result.records[0].Name);
      res.send(result.records[0].Name)
    }
  })
})
app.post('/getrecord', (req, res) => {
  console.log("inside get records")
  let token = req.headers.token;
  console.log('token get record ', token);
  var conn = new jsforce.Connection({
    instanceUrl: 'https://gulfsothebysinternational--cddev.sandbox.my.salesforce.com',
    accessToken: token
  });
  conn.query("select Id,Name,Status__c,CD_Project__c,Project_Name__c,City_Dubizzle__c,CD_Project__r.Name,CD_Unit_Number__c,CD_Bedrooms__c, CD_Floor__c, CD_Image__c,CD_City__c,CD_Country__c,Type__c,CD_uaefields_Developer__c,CD_Completion_Status__c,CD_Total_Area__c,CD_uaefields_Furnished__c,CD_Sales_Price__c,CD_isblocked__c, CD_Block_Status__c,CD_Block_Comments__c,CD_Purchase_date__c,CD_Block_Date__c,CD_Agent_Name_User__c,CD_Mode_of_Payment__c,CD_Payment_Percentage__c,(select id,Name,pba__Status__c, InquiryType__c from Inquiries1__r)from cd_Property__c", (err, result) => {
    console.log("inside Query");
    res.send(result)
  })
})
console.log('test');
app.post('/recordId', (req, res) => {
  var propertyRecordId;
  let token = req.headers.token;
  console.log(' get recordid page token ', token);
  var conn = new jsforce.Connection({
    instanceUrl: 'https://gulfsothebysinternational--cddev.sandbox.my.salesforce.com',
    accessToken: token
  });
    console.log(req.query.searchId)
    console.log("session Id ",req.headers)
    propertyRecordId = req.query.searchId 
    console.log("propertyRecordId ",propertyRecordId)
    console.log("token outside query ",token)
    if(propertyRecordId !== undefined){
    conn.query("select id,CD_Project__c,Name,CD_Unit_Number__c,Type__c,CD_uaefield_Property_Sub_Type__c,CD_Title__c,CD_View__c,CD_Tower__c,CD_Area__c,CD_Country__c,CD_Floors__c,CD_Agent_Name__c ,Status__c from CD_Property__c where Id='"+propertyRecordId+"'",(err, result) =>{
    console.log("token inside query ",token)
    console.log("inside soql query property id ",propertyRecordId)
    if (err) { console.log("error ",err) }  
    console.log("session inside Id ",req.headers)
    console.log("queried data ", result);
      res.send(result)
    })
  }
 
})
app.listen(port, () => {
  console.log("Connected to port successfully")
})
