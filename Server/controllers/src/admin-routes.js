const network = require("../Utils/network.js");

const key = "HospitalAdmin"
const value = "hospitaladmin";
const MSPID = "HospitalMSP";

exports.createPatient = async (req, res, org, orgId, AdminID) => {
  // Set up and connect to Fabric Gateway 
  const networkObj = await network.connectToNetwork(
    req,
    res,
    org,
    orgId,
    AdminID
  );
  
  const patientId = req.body.patientId;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const dob = req.body.dob;
  const age = req.body.age;
  const gender = req.body.gender;
  const address = req.body.address;
  const phoneNo = req.body.phoneNo;
  const emailId = req.body.emailId;
  const password = req.body.password;
  const emergencyContactNo = req.body.emergencyContactNo;
  
  // console.log("Hi....");
  
  const transaction = networkObj.contract.createTransaction('Admin_createPatient');
  const org1peer = ['peer0.hospital.healthvault.com:7051'];
  
  transaction.setEndorsingPeers(org1peer);

  const createPatientRes = await transaction.submit(
    patientId,
    emailId,
    firstname,
    lastname,
    password,
    address,
    gender,
    phoneNo,
    emergencyContactNo,
    age,
    dob,
    key,
    value,
    MSPID
  );
  
  if (createPatientRes.error) {
    //console.log("Kartik");
    res.status(400).send(response.error);
  }

  await networkObj.gateway.disconnect();
  // console.log("Kartik");
  const userData = JSON.stringify({ orgId1: orgId, userId: patientId, key: "patient", value: "true", firstName: firstname , lastName: lastname});
  const registerUserRes = await network.registerUser(userData);

  if (registerUserRes.error) {
    await networkObj.contract.submitTransaction(
      "Admin_deletePatient",
      patientId,
      key,
      value,
      MSPID
    );
    res.send(registerUserRes.error);
  }

  // res
  //   .status(201)
  //   .send(
  //     `Successfully registered Patient ${patientId}`
  //   );

    await res.status(201).json({
      executed : "successful",
      result : `Successfully registered Patient ${patientId}`
  });
};

exports.createDoctor = async (req, res, org, orgId, AdminID) => {
  const networkObj = await network.connectToNetwork(
    req,
    res,
    org,
    orgId,
    AdminID
  );

  const doctorId = req.body.doctorId;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const age = req.body.age;
  const phoneNo = req.body.phoneNo;
  const emailId = req.body.emailId;
  const address = req.body.address;
  const bloodgroup = req.body.bloodgroup;
  const password = req.body.password;
  const field = req.body.field;
  const department = req.body.department;
  
  console.log("Hi....");
  //const data = JSON.stringify(DocID, emailId, firstName, lastName , password, age, phoneNumber, Fields);

  // const transaction = contract.createTransaction('Admin_createPatient');
  // const org1Peers = ['peer0.org1.example.com:7051'];
  // transaction.setEndorsingPeers(org1Peers);
  // console.log('peers found');

  const transaction = networkObj.contract.createTransaction('Admin_createDoctor');
  const org1peer = ['peer0.hospital.healthvault.com:7051'];
  
  transaction.setEndorsingPeers(org1peer);
  console.log('peers found');
  const createDoctorRes = await transaction.submit(
    doctorId,
    firstname,
    lastname,
    age,
    phoneNo,
    emailId,
    address,
    bloodgroup,
    password,
    field,
    department,
    key,
    value,
    MSPID
  );

  if (createDoctorRes.error) {
    // console.log("Kartik");
    res.status(400).send(response.error);
  }
  // const responseString = JSON.parse(createDoctorRes);
  // console.log(responseString);

  await networkObj.gateway.disconnect();

  const userData = JSON.stringify({ orgId1: orgId, userId: doctorId, key: "Doctor", value: "true", firstName: firstname , lastName: lastname});

  const registerDocRes = await network.registerUser(userData);

  if (registerDocRes.error) {
    await networkObj.contract.submitTransaction(
      "Admin_deleteDoctor",
      doctorId,
      key,
      value,
      MSPID
    );
    res.send(registerDocRes.error);
  }

  res
    .status(201)
    .send(
      
      `Successfully registered Doctor ${doctorId}`
    );
};

exports.createBillManager = async (req, res, org, orgId, AdminID) => {
  const networkObj = await network.connectToNetwork(
    req,
    res,
    org,
    orgId,
    AdminID
  );

  const managerId = req.body.managerId;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const emailId = req.body.emailId;
  const password = req.body.password;
  const phoneNo = req.body.phoneNo;
  const address = req.body.address;
  
  const transaction = networkObj.contract.createTransaction('Admin_createBillManager');
  const org1peer = ['peer0.hospital.healthvault.com:7051'];
  
  transaction.setEndorsingPeers(org1peer);

  const response = await transaction.submit(
    managerId,
    firstname,
    lastname,
    emailId,
    password,
    phoneNo,
    address,
    key,
    value,
    MSPID
  );
  await networkObj.gateway.disconnect();

  if (response.error) {
    res.status(400).send(response.error);
  }

  // Enrol and register the user with the CA and adds the user to the wallet.
  const userData = JSON.stringify({ orgId1: orgId, userId: managerId, key: "BillManager", value: "true", firstName: firstname , lastName: lastname});
  const registerBillmanagerRes = await network.registerUser(userData);

  if (registerBillmanagerRes.error) {
    await networkObj.contract.submitTransaction(
      "Admin_deleteBillManager",
      managerId,
      key,
      value,
      MSPID
    );
    res.send(registerBillmanagerRes.error);
  }

  res
    .status(201)
    .send(
      `Successfully registered Bill Manager ${managerId}.` 
    );
};

exports.deletePatient = async (req, res, org, orgId, AdminID) => {
  console.log(req.body);
  const networkObj = await network.connectToNetwork(
    req,
    res,
    org,
    orgId,
    AdminID
  );

  const patientId = req.body.patientId;
  
  const PID = JSON.stringify(patientId);
  console.log("77 PID:", PID);
  const transaction = networkObj.contract.createTransaction('Admin_deletePatient');
  const org1peer = ['peer0.hospital.healthvault.com:7051'];
  
  transaction.setEndorsingPeers(org1peer);

  const deletePatientRes = await transaction.submit(
    patientId,
    key,
    value,
    MSPID
  );
  await networkObj.gateway.disconnect();

  if (deletePatientRes.error) {
    res.status(400).send(deletePatientRes.error);
  }
  res.status(200).send(`Successfully Deleted PatientID:${PID}`);
};

exports.deleteDoctor = async (req, res, org, orgId, AdminID) => {
  const networkObj = await network.connectToNetwork(
    req,
    res,
    org,
    orgId,
    AdminID
  );

  const doctorId = req.body.doctorId;
  

  const transaction = networkObj.contract.createTransaction('Admin_deleteDoctor');
  const org1peer = ['peer0.hospital.healthvault.com:7051'];
  
  transaction.setEndorsingPeers(org1peer);

  const deleteDoctorRes = await transaction.submit(
    doctorId,
    key,
    value,
    MSPID
  );
  await networkObj.gateway.disconnect();

  if (deleteDoctorRes.error) {
    res.status(400).send(response.error);
  }
  res.status(201).send(`Successfully Deleted DoctorID:${doctorId}`);
};

exports.deleteBillManager = async (req, res, org, orgId, AdminID) => {
  console.log(req.body);
  const networkObj = await network.connectToNetwork(
    req,
    res,
    org,
    orgId,
    AdminID
  );

  const managerId = req.body.managerId;

  
  const transaction = networkObj.contract.createTransaction('Admin_deleteBillManager');
  const org1peer = ['peer0.hospital.healthvault.com:7051'];
  
  transaction.setEndorsingPeers(org1peer);

  console.log("ManagerId : ", managerId);
  const deleteBillManagerRes = await transaction.submit(
    managerId,
    key,
    value,
    MSPID
  );
  await networkObj.gateway.disconnect();

  if (deleteBillManagerRes.error) {
    res.status(400).send(response.error);
  }
  res.status(201).send(`Successfully Deleted ManagerID:${managerId}`);
};

function connect(networkObj,functionName)
{
  const org1peer = ['peer0.hospital.healthvault.com:7051'];
  const transaction = networkObj.contract.createTransaction(functionName); 
  return transaction.setEndorsingPeers(org1peer);
};




//------------------------Admin Query Transcations-----------------------

exports.Admin_query = async (req, res, org, orgId, AdminID) => {
  const patientId = req.body.patientId;
  const doctorId = req.body.doctorId;
  const managerId = req.body.managerId;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const queryName = req.headers.query;
  const networkObj = await network.connectToNetwork(
    req,
    res,
    org,
    orgId,
    AdminID
  );
  console.log("Kartik");
  // const queryName = req.headers.query;
  console.log("queryName:", queryName);
  console.log("AdminID :", req.user.ID);

  const transaction = connect(networkObj, queryName);
  //console.log(transaction);

  if (queryName === "Admin_readPatient") {


    //const response = await networkObj.contract.evaluateTransaction(queryName, 'admin');
    const response = await transaction.evaluate(
      patientId,
      key,
      value,
      MSPID
    );
    await networkObj.gateway.disconnect();

    if (response.error) {
      res.status(400).send(response.error);
    }

    
    console.log(
      `Transaction has been evaluated, result is: ${response.toString()}`
    );
    res
      .status(201)
      .send(
        `Transaction has been evaluated, result is: ${response.toString()}`
      );
    return response;


    // var editResp = JSON.parse(response);
    //     editResp = editResp.asset1;

    //     const newResp = JSON.stringify(editResp);

    //     console.log(newResp);


// console.log(
//       `Transaction has been evaluated, result is: ${editResp.toString()}`
//     );
//     res
//       .status(201)
//       .send(
//         `Transaction has been evaluated, result is: ${editResp.toString()}`
//       );
    
//         return newResp;


  } else if (queryName === "Admin_readDoctor") {
    const response = await transaction.evaluate(
      doctorId,
      key,
      value,
      MSPID
    );
    await networkObj.gateway.disconnect();

    if (response.error) {
      res.status(400).send(response.error);
    }
    console.log(
      `Transaction has been evaluated, result is: ${response.toString()}`
    );
    res
      .status(201)
      .send(
        `Transaction has been evaluated, result is: ${response.toString()}`
      );
    return response;
  } else if (queryName === "Admin_queryPatientsByFirstName") {
    const response = await transaction.evaluate(
      firstname,
      key,
      value,
      MSPID
    );
    await networkObj.gateway.disconnect();

    if (response.error) {
      res.status(400).send(response.error);
    }

    const response1 = JSON.parse(response);
    console.log(
      `Transaction has been evaluated, result is: ${response1}`
    );
    res
      .status(201)
      .send(
        `Transaction has been evaluated, result is: ${response.toString()}`
      );
    return response;
  } else if (queryName === "Admin_queryPatientsByLastName") {
    const response = await transaction.evaluate(
      lastname,
      key,
      value,
      MSPID
    );
    await networkObj.gateway.disconnect();

    if (response.error) {
      res.status(400).send(response.error);
    }
    console.log(
      `Transaction has been evaluated, result is: ${response.toString()}`
    );
    res
      .status(201)
      .send(
        `Transaction has been evaluated, result is: ${response.toString()}`
      );
    return response;
  } else if (queryName === "Admin_readBillManager") {
    const response = await transaction.evaluate(
      managerId,
      key,
      value,
      MSPID
    );
    await networkObj.gateway.disconnect();

    if (response.error) {
      res.status(400).send(response.error);
    }
    console.log(
      `Transaction has been evaluated, result is: ${response.toString()}`
    );
    res
      .status(201)
      .send(
        `Transaction has been evaluated, result is: ${response.toString()}`
      );
    return response;
  } else {
    // const response = await networkObj.contract.evaluateTransaction(queryName, args);
    //  const result_toString = response.toString()
    //  await networkObj.gateway.disconnect();
    res.status(300).send("Retry wrong transction Triggered!");
  }
};
