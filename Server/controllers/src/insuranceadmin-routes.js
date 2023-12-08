const network = require("../Utils/network.js");

const key = "InsuranceAdmin";
const value = "insuranceadmin";
const MSPID = "InsuranceMSP";

function setup(networkObj, functionName) {
  const OrgPeer = ['peer0.hospital.healthvault.com:7051'];
  const transaction = networkObj.contract.createTransaction(functionName);
  return transaction.setEndorsingPeers(OrgPeer);
};

function setup_1(networkObj, functionName, OrgPeer) {
  const transaction = networkObj.contract.createTransaction(functionName);
  return transaction.setEndorsingPeers(OrgPeer);
};


//------------------------Admin Submit Transcations-----------------------
/*
exports.createReport = async (req, res, org, hospid, AdminID) => {

        // Set up and connect to Fabric Gateway using the username in header
        const networkObj = await network.connectToNetwork(req,res,org,hospid,AdminID);

        
        const patientId  = req.body.patientId;
        const emailId = req.body.emailId;
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const password = req.body.password;
        const age = req.body.age;
        const phoneNumber = req.body.phoneNumber;

        
        // The request present in the body is converted into a single json string
        const createPatientRes = await networkObj.contract.submitTransaction('Admin_createPatient', patientId, emailId, firstName, lastName, password, age, phoneNumber);
        // Invoke the smart contract function
        if (createPatientRes.error) {
            res.status(400).send(response.error);
          }

        // Enrol and register the user with the CA and adds the user to the wallet.
        const userData = JSON.stringify({hospitalId: hospid, userId: patientId});
        const registerUserRes = await network.registerUser(userData);

        if (registerUserRes.error) {
          await networkObj.contract.submitTransaction('Admin_deletePatient', patientId);
          res.send(registerUserRes.error);
        }

  res.status(201).send('Successfully registered Patient.', req.body.patientId, req.body.password);
};*/

/*
exports.createDoctor = async (req, res, org, hospid, AdminID) => {


    const networkObj = await network.connectToNetwork(req,res,org,hospid,AdminID);

    const new_DocID = req.body.new_DocID;
    const emailId= req.body.emailId;
    const firstName= req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;
    const age= req.body.age;
    const phoneNumber= req.body.phoneNumber;
    const Fields = req.body.Fields;
    
    const DocID = new_DocID;

    //const data = JSON.stringify(DocID, emailId, firstName, lastName , password, age, phoneNumber, Fields);
    await networkObj.contract.submitTransaction('Admin_createDoctor',DocID, emailId, firstName, lastName , password, age, phoneNumber, Fields );
    await networkObj.gateway.disconnect();  

    // Enrol and register the user with the CA and adds the user to the wallet.
    const userData = JSON.stringify({hospitalId: hospid, userId: new_DocID});
    const registerDocRes =  await network.registerUser(userData);

    if (registerDocRes.error) {
      await networkObj.contract.submitTransaction('Admin_deleteDoctor', DocID);
      res.send(registerDocRes.error);
    }

    res.status(201).send('Successfully registered Doctor.', new_DocID,emailId, firstName, lastName,password, age,phoneNumber,Fields, password);

};

exports.createBillManager = async (req, res, org, hospid, AdminID) => {


  const networkObj = await network.connectToNetwork(req,res,org,hospid,AdminID);

  const new_DocID = req.body.new_BMID;
  const emailId= req.body.emailId;
  const firstName= req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  const age= req.body.age;
  const phoneNumber= req.body.phoneNumber;
  
  
  const DocID = new_DocID;

  //const data = JSON.stringify(DocID, emailId, firstName, lastName , password, age, phoneNumber, Fields);
  await networkObj.contract.submitTransaction('Admin_createBillManager',DocID, emailId, firstName, lastName , password, age, phoneNumber, Fields );
  await networkObj.gateway.disconnect();  

  // Enrol and register the user with the CA and adds the user to the wallet.
  const userData = JSON.stringify({hospitalId: hospid, userId: new_DocID});
  const registerDocRes =  await network.registerUser(userData);

  if (registerDocRes.error) {
    await networkObj.contract.submitTransaction('Admin_deleteBillManager', DocID);
    res.send(registerDocRes.error);
  }

  res.status(201).send('Successfully registered Doctor.', new_DocID,emailId, firstName, lastName,password, age,phoneNumber,Fields, password);

};



exports.deletePatient = async(req,res,org,hospid,AdminID) => {
  console.log(req.body);
  const networkObj = await network.connectToNetwork(req,res,org,hospid,AdminID);
  
  const patientId = req.body.patientId;
  const PID = JSON.stringify(patientId);
  console.log("77 PID:",PID);

  const deletePatientRes  = await networkObj.contract.submitTransaction('Admin_deletePatient',patientId);
  await networkObj.gateway.disconnect();  

  if (deletePatientRes.error) {
    res.status(400).send(deletePatientRes.error);
  }
  res.status(200).send(`Successfully Deleted PatientID:${PID}`);
}

exports.deleteDoctor = async(req,res,org,hospid,AdminID) => {
  const networkObj = await network.connectToNetwork(req,res,org,hospid,AdminID);
  
  const DoctorID = req.body.DocID;

  const deleteDoctorRes  = await networkObj.contract.submitTransaction('Admin_deleteDoctor',DoctorID);
  await networkObj.gateway.disconnect();  

  if (deleteDoctorRes.error) {
    res.status(400).send(response.error);
  }
  res.status(201).send(`Successfully Deleted DoctorID:${DoctorID}`);

}

exports.deleteBillManager = async(req,res,org,hospid,AdminID) => {
  const networkObj = await network.connectToNetwork(req,res,org,hospid,AdminID);
  
  const DoctorID = req.body.BMID;

  const deleteDoctorRes  = await networkObj.contract.submitTransaction('Admin_deleteBillManager',DoctorID);
  await networkObj.gateway.disconnect();  

  if (deleteDoctorRes.error) {
    res.status(400).send(response.error);
  }
  res.status(201).send(`Successfully Deleted DoctorID:${DoctorID}`);

}
*/
//------------------------Admin Query Transcations-----------------------

exports.InsuranceAdminQuery = async(req,res,org,hospid,AdminID) => {
    const {patientId,fun_name,doctorId,BMID,firstName,lastName} = req.body;
    const networkObj = await network.connectToNetwork(req,res,org,hospid,AdminID);
    //console.log("Kartik");
    // const queryName = req.headers.query;
    console.log("queryName:",fun_name);
    console.log("req.user.PID:",req.user.ID);

    const transaction = setup(networkObj, fun_name);
 
    if(fun_name == "Insurance_ReadHospitalBill"){
      //const response = await networkObj.contract.evaluateTransaction(queryName, 'admin');
          
      const response = await transaction.evaluate(patientId, key, value, MSPID);
      await networkObj.gateway.disconnect();
  
      if (response.error) {
        res.status(400).send(response.error);
      }
      console.log(`Transaction has been evaluated, result is: ${response.toString()}`);
      res.status(201).send(`Transaction has been evaluated, result is: ${response.toString()}`);
      return response

    }
    /*else if (queryName == "Admin_readDoctor"){
      const response = await networkObj.contract.evaluateTransaction(queryName, doctorId);
      await networkObj.gateway.disconnect();
      
      if (response.error) {
        res.status(400).send(response.error);
      }
      console.log(`Transaction has been evaluated, result is: ${response.toString()}`);
      res.status(201).send(`Transaction has been evaluated, result is: ${response.toString()}`);
      return response

    }else if(queryName == "Admin_queryPatientsByFirstName"){
      const response = await networkObj.contract.evaluateTransaction(queryName, req.user.firstName);
      await networkObj.gateway.disconnect();
     
      if (response.error) {
        res.status(400).send(response.error);
      }
      console.log(`Transaction has been evaluated, result is: ${response.toString()}`);
      res.status(201).send(`Transaction has been evaluated, result is: ${response.toString()}`);
      return response
      
    }else if(queryName == "Admin_queryPatientsByLastName"){
      const response = await networkObj.contract.evaluateTransaction(queryName, req.user.lastName);
      await networkObj.gateway.disconnect();
     
      if (response.error) {
        res.status(400).send(response.error);
      }
      console.log(`Transaction has been evaluated, result is: ${response.toString()}`);
      res.status(201).send(`Transaction has been evaluated, result is: ${response.toString()}`);
      return response

    }else if(queryName == "Admin_readBillManager"){
      const response = await networkObj.contract.evaluateTransaction(queryName, BMID);
      await networkObj.gateway.disconnect();
     
      if (response.error) {
        res.status(400).send(response.error);
      }
      console.log(`Transaction has been evaluated, result is: ${response.toString()}`);
      res.status(201).send(`Transaction has been evaluated, result is: ${response.toString()}`);
      return response
    }*/else{
        // const response = await networkObj.contract.evaluateTransaction(queryName, args);
        //  const result_toString = response.toString()
        //  await networkObj.gateway.disconnect();
         res.status(300).send("Retry wrong transction Triggered!");
    }
    

}
