const network = require("../Utils/network.js");
const fs = require('fs');

const key = "LaboratoryAdmin";
const value = "laboratoryadmin";
const MSPID = "LaboratoryMSP";


function setup(networkObj, functionName) {
  const OrgPeer = ['peer0.hospital.healthvault.com:7051'];
  const transaction = networkObj.contract.createTransaction(functionName);
  return transaction.setEndorsingPeers(OrgPeer);
};

function setup_1(networkObj, functionName, OrgPeer) {
  const transaction = networkObj.contract.createTransaction(functionName);
  return transaction.setEndorsingPeers(OrgPeer);
};

function base64_encode(file) {
  return "data:image/gif;base64,"+fs.readFileSync(file, 'base64');}


//------------------------Admin Submit Transcations-----------------------
exports.createReport = async (req, res, org, orgId, AdminID) => {



  
  const { fun_name,
    patientId,
    testDate,
    abnormalities,
    furtherTesting,
    interpretation,
    ClinicalComments,
    Result,
    labId,
    testsPerformed } = req.body;


    console.log(req.body);
    console.log(req.file);

    var base64str = base64_encode(req.file.path);
    // console.log(base64str);
   


  // Set up and connect to Fabric Gateway using the username in header
  const networkObj = await network.connectToNetwork(req, res, org, orgId, AdminID);
  const OrgPeers = ['peer0.hospital.healthvault.com:7051', 'peer0.laboratory.healthvault.com:7052'];
  const transaction = setup_1(networkObj, fun_name, OrgPeers);

  // The request present in the body is converted into a single json string

  if (fun_name === 'Labadmin_createReport') {
    const createPatientReport = await transaction.submit(patientId, key, value, MSPID,
      testDate,
      abnormalities,
      furtherTesting,
      interpretation,
      ClinicalComments,
      Result,
      labId,
      testsPerformed, base64str
    );
    // Invoke the smart contract function
    if (createPatientReport.error) {
      res.status(400).send(response.error);
    }

    // Enrol and register the user with the CA and adds the user to the wallet.
    //const userData = JSON.stringify({orgId: orgId, userId: patientId});
    //const registerUserRes = await network.registerUser(userData);

    // if (registerUserRes.error) {
    //   await networkObj.contract.submitTransaction('Admin_deletePatient', patientId);
    //   res.send(registerUserRes.error);
    // }

    res.status(201).send(`Successfully created patient ${patientId}report `/*, req.body.patientId*/);
  }
  else {
    res.status(300).send("Retry wrong transction Triggered!");
  }

  
};

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





exports.LabAdmin_readLabReq = async (req, res, org, orgId, AdminID) => {
  const { patientId, fun_name, doctorId, BMID, firstName, lastName } = req.body;
  const networkObj = await network.connectToNetwork(req, res, org, orgId, AdminID);
  //console.log("Kartik");
  // const queryName = req.headers.query;
  console.log("queryName : ", fun_name);
  console.log("req.user.AdminId : ", req.user.ID);

  const OrgPeers = ['peer0.hospital.healthvault.com:7051', 'peer0.laboratory.healthvault.com:7052'];
  const transaction = setup_1(networkObj, fun_name, OrgPeers);

  if (fun_name == "LabAdmin_readLabReq") {
    //const response = await networkObj.contract.evaluateTransaction(queryName, 'admin');
    const response = await transaction.evaluate(patientId, key, value, MSPID);
    await networkObj.gateway.disconnect();

    if (response.error) {
      res.status(400).send(response.error);
    }
    console.log(`Transaction has been evaluated, result is: ${response.toString()}`);
    res.status(201).send(`Transaction has been evaluated, result is: ${response.toString()}`);
    return response

  }/*else if (queryName == "Admin_readDoctor"){
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
    }*/else {
    // const response = await networkObj.contract.evaluateTransaction(queryName, args);
    //  const result_toString = response.toString()
    //  await networkObj.gateway.disconnect();
    res.status(300).send("Retry wrong transction Triggered!");
  }


}
