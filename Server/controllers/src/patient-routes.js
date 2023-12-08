const network = require("../Utils/network.js");
const { prettyJSONString } = require("../Utils/Utils.js");

const key = "patient";
const value = "true";
const MSPID = "HospitalMSP";
//--------------------------Patient Submit Transcations------------------------------
exports.Patient_Submit_transcations = async (
  req,
  res,
  org,
  orgId,
  connectID
) => {
  const networkObj = await network.connectToNetwork(
    req,
    res,
    org,
    orgId,
    connectID
  );

  console.log(req.body);
  const fun_name = req.body.fun_name;

  if (fun_name == "Patient_updatePatient") {
    const patientId = req.body.patientId;
    const newFirstname = req.body.newFirstname;
    const newLastname = req.body.newLastname;
    const newAge = req.body.newAge;
    const updatedBy = req.body.updatedBy;
    const newPhoneNumber = req.body.newPhoneNumber;
    const newEmergPhoneNumber = req.body.newEmergPhoneNumber;
    const newAddress = req.body.newAddress;
    const newEmailId = req.body.newEmailId;
    const newdob = req.body.newdob;

    const transaction = networkObj.contract.createTransaction(
      "Patient_updatePatient"
    );
    const org1peer = ["peer0.hospital.healthvault.com:7051"];

    transaction.setEndorsingPeers(org1peer);
    console.log("peers found");

    const UpdatePatient_Detials_Res = await transaction.submit(
      patientId,
      newFirstname,
      newLastname,
      newAge,
      updatedBy,
      newPhoneNumber,
      newEmergPhoneNumber,
      newAddress,
      newEmailId,
      newdob,
      key,
      value,
      MSPID
    );

    await networkObj.gateway.disconnect();

    if (UpdatePatient_Detials_Res.error) {
      res.status(400).json(UpdatePatient_Detials_Res.error);
    }
    //res.status(201).json(`${prettyJSONString(UpdatePatient_Detials_Res)}`);
    res.status(201).json(`Successfully updated details.`);
  } else if (fun_name == "Patient_updatePatientPassword") {
    const { patientId, newPassword } = req.body;

    console.log(patientId, newPassword, key, value, MSPID);

    const transaction = networkObj.contract.createTransaction(
      "Patient_updatePatientPassword"
    );
    const org1peer = ["peer0.hospital.healthvault.com:7051"];

    transaction.setEndorsingPeers(org1peer);
    console.log("peers found");

    const Update_Patient_Password_Res = await transaction.submit(
      patientId,
      newPassword,
      key,
      value,
      MSPID
    );
    await networkObj.gateway.disconnect();

    if (Update_Patient_Password_Res.error) {
      res.status(400).json(Update_Patient_Password_Res.error);
    }
    console.log(Update_Patient_Password_Res);
    res.status(201).json("Successfully updated password.");
    //res.status(201).json(`${prettyJSONString(Update_Patient_Password_Res)}`);
  } else if (fun_name == "patient_GrantAccessTo_others") {
    const { patientId, accessId } = req.body;

    const transaction = networkObj.contract.createTransaction(
      "patient_GrantAccessTo_others"
    );
    const org1peer = ["peer0.hospital.healthvault.com:7051"];

    transaction.setEndorsingPeers(org1peer);
    console.log("peers found");

    const Patient_grantAccessToDoctor = await transaction.submit(
      patientId,
      accessId,
      key,
      value,
      MSPID
    );
    console.log(Patient_grantAccessToDoctor.toString());

    await networkObj.gateway.disconnect();

    if (Patient_grantAccessToDoctor.error) {
      res.status(400).json(Patient_grantAccessToDoctor.error);
    }
    //res.status(201).json(`${prettyJSONString(doctorId)}`);
    res.status(201).json(`Granted access to ${accessId}.`);
  } else if (fun_name == "patient_RevokeAccess") {
    const { patientId, revokeId } = req.body;

    const transaction = networkObj.contract.createTransaction(
      "patient_RevokeAccess"
    );
    const org1peer = ["peer0.hospital.healthvault.com:7051"];

    transaction.setEndorsingPeers(org1peer);
    console.log("peers found");

    const Patient_revokeAccessFromDoctor = await transaction.submit(
      patientId,
      revokeId,
      key,
      value,
      MSPID
    );
    console.log(Patient_revokeAccessFromDoctor.toString());

    await networkObj.gateway.disconnect();

    if (Patient_revokeAccessFromDoctor.error) {
      res.status(400).json(Patient_revokeAccessFromDoctor.error);
    }
    console.log(Patient_revokeAccessFromDoctor);
    //res.status(201).json(prettyJSONString(doctorId));
    res.status(201).json(`Access revoked for ${revokeId}.`);
  } else {
    console.log = "Invalid invoke request.";
  }
};

//--------------------------------Patient Query transcations -----------------------------

exports.Patient_query = async (req, res, org, orgId, connectID) => {
  // const {queryName,patientId} = req.body;

  const queryName = req.headers.query;

  console.log(org, orgId, connectID, queryName);

  /*if (queryName === 'Patient_readPatient') {
        const networkObj = await network.connectToNetwork(req, res, org, orgId, connectID);

        const transaction = networkObj.contract.createTransaction(queryName);
        const org1peer = ['peer0.hospital.healthvault.com:7051'];

        transaction.setEndorsingPeers(org1peer);
        console.log('peers found');

        const response = await transaction.evaluate(req.user.ID, key, value, MSPID);

        await networkObj.gateway.disconnect();

        if (response.error) {
            res.status(400).json(response.error);
        }

        console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
        var editResp = JSON.parse(response);
        editResp = editResp.asset1;

        const newResp = JSON.stringify(editResp);

        console.log(newResp);



        res.status(201).json(`${prettyJSONString(newResp)}`);
        console.log();

        return newResp;


    }*/

  if (queryName) {
    const networkObj = await network.connectToNetwork(
      req,
      res,
      org,
      orgId,
      connectID
    );

    const transaction = networkObj.contract.createTransaction(queryName);
    const org1peer = ["peer0.hospital.healthvault.com:7051"];

    transaction.setEndorsingPeers(org1peer);
    console.log("peers found");

    var response = await transaction.evaluate(req.user.ID, key, value, MSPID);

    await networkObj.gateway.disconnect();

    if (response.error) {
      res.status(400).json(response.error);
    }

    if (queryName === "Patient_readPatient") {
      const data = JSON.parse(response);
      const numAttributes = Object.keys(data).length;
      if (numAttributes >= 2) {
        const { asset1 } = data;
        const { asset2 } = data;
        //console.log(asset1, asset2);
        // const obj1 = datas.asset1;
        // const obj2 = datas.asset2;
        response = Object.assign({}, asset1, asset2);
        //console.log(response);
      }
    }
    response = JSON.stringify(response);
    //console.log(response);
    console.log(
      `Transaction has been evaluated, result is: ${prettyJSONString(response)}`
    );
    res.status(201).json(`${prettyJSONString(response)}`);
    console.log();

    return response;
  }

  /*
    //console.log("networkObj",networkObj);
    if(queryName == "Patient_readPatient"){
       

            const transaction = networkObj.contract.createTransaction('Patient_readPatient');
            const org1peer = ['peer0.hospital.healthvault.com:7051'];
            
            transaction.setEndorsingPeers(org1peer);
            console.log('peers found');

           const response  = await transaction.evaluate(req.user.ID, key, value, MSPID);
           
           await networkObj.gateway.disconnect();  
           
           if (response.error) {
               res.status(400).json(response.error);
           }
           console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
           res.status(201).json(`${prettyJSONString(response)}`);
           console.log();

           return response;
       
    //    catch{
    //         res.status(400).json("Error");
    //    } 
    }else if(queryName == "Patient_readLabReq"){
        const transaction = networkObj.contract.createTransaction('Patient_readLabReq');
            const org1peer = ['peer0.hospital.healthvault.com:7051'];
            
            transaction.setEndorsingPeers(org1peer);
            console.log('peers found');

        const response  = await transaction.evaluate(req.user.ID, key, value, MSPID);
        
        await networkObj.gateway.disconnect();  
        
        if (response.error) {
            res.status(400).json(response.error);
        }
        console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
        res.status(201).json(`${prettyJSONString(response)}`);
        console.log();

        return response;
    
 //    catch{
 //         res.status(400).json("Error");
 //    } 
    }else if(queryName == "Patient_ReadLabReport"){
       
        const transaction = networkObj.contract.createTransaction('Patient_readLabReq');
        const org1peer = ['peer0.hospital.healthvault.com:7051'];
        
        transaction.setEndorsingPeers(org1peer);
        console.log('peers found');

    const response  = await transaction.evaluate(req.user.ID, key, value, MSPID);
    
    await networkObj.gateway.disconnect();  
    
    if (response.error) {
        res.status(400).json(response.error);
    }
    console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
    res.status(201).json(`${prettyJSONString(response)}`);
    console.log();

    return response;

//    catch{
//         res.status(400).json("Error");
//    } 
    }else if(queryName == "Patient_readMedPrescriptions"){
        const transaction = networkObj.contract.createTransaction('Patient_readLabReq');
        const org1peer = ['peer0.hospital.healthvault.com:7051'];
        
        transaction.setEndorsingPeers(org1peer);
        console.log('peers found');

    const response  = await transaction.evaluate(req.user.ID, key, value, MSPID);
    
    await networkObj.gateway.disconnect();  
    
    if (response.error) {
        res.status(400).json(response.error);
    }
    console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
    res.status(201).json(`${prettyJSONString(response)}`);
    console.log();

    return response;

//    catch{
//         res.status(400).json("Error");
//    } 
    }else if(queryName == "Patient_ReadHospitalBill"){
        const transaction = networkObj.contract.createTransaction('Patient_readLabReq');
        const org1peer = ['peer0.hospital.healthvault.com:7051'];
        
        transaction.setEndorsingPeers(org1peer);
        console.log('peers found');

    const response  = await transaction.evaluate(req.user.ID, key, value, MSPID);
    
    await networkObj.gateway.disconnect();  
    
    if (response.error) {
        res.status(400).json(response.error);
    }
    console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
    res.status(201).json(`${prettyJSONString(response)}`);
    console.log();

    return response;
*/
  //    catch{
  //         res.status(400).json("Error");
  //    }
  else {
    console.log = "Invalid query.";
  }
};
