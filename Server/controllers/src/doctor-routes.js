const network = require("../Utils/network.js");
const { prettyJSONString } = require("../Utils/Utils.js");
const fs = require('fs');

const key = "Doctor"
const value = "true";
const MSPID = "HospitalMSP";

function setup(networkObj,functionName)
{
  const OrgPeer = ['peer0.hospital.healthvault.com:7051'];
  const transaction = networkObj.contract.createTransaction(functionName); 
  return transaction.setEndorsingPeers(OrgPeer);
};

function setup_1(networkObj,functionName, OrgPeer)
{
  const transaction = networkObj.contract.createTransaction(functionName); 
  return transaction.setEndorsingPeers(OrgPeer);
};


//--------------------------Doctor Submit Transcations------------------------------
exports.Doctor_submit_transcations = async(req,res,org,orgId,DocID) => {
  const networkObj = await network.connectToNetwork(req,res,org,orgId,DocID);
  const {function_Name,patientId,firstName, lastName, password, age, phoneNumber,address, bloodGroup, fields, department,
         newSymptoms ,newDiagnosis ,newTreatment ,newFollowUp,updatedBy, checkup,
         scans,
         drugName,
         drugQuantity,
         drugDaysofSupply,
         others,
         description,
         prescriptionValidity} = req.body;

  const doctorId = DocID;
  if(function_Name == "Doctor_updateDoctor"){

  const transaction = setup(networkObj, function_Name);

    const UpdateDoctor_Detials_Res  = await transaction.submit(doctorId, firstName,
     lastName, age, password, phoneNumber,address, fields, bloodGroup, department, key, value, MSPID);
    await networkObj.gateway.disconnect();  
    
    if (UpdateDoctor_Detials_Res.error) {
      res.status(400).send(UpdateDoctor_Detials_Res.error);
    }

    console.log(`Successfully updated details.`);
    //res.status(201).json(`${prettyJSONString(UpdateDoctor_Detials_Res)}`);
    res.status(201).json(`Successfully updated details.`);


  }else if(function_Name == "Doctor_updatePatientDetails"){
    
    const transaction = setup(networkObj, function_Name);
    const Update_Patient_Detials_Res  = await transaction.submit(patientId,
    newSymptoms ,newDiagnosis ,newTreatment ,newFollowUp,updatedBy, key, value, MSPID);
      await networkObj.gateway.disconnect();  
    
      if (Update_Patient_Detials_Res.error) {
        res.status(400).send(Update_Patient_Detials_Res.error);
      }      
      console.log(`Successfully updated ${patientId} details by ${doctorId}.`);
      //res.status(201).json(`${prettyJSONString(Update_Patient_Detials_Res)}`);
      res.status(201).json(`Successfully updated patient details.`);

  }else if(function_Name == "DoctorCreate_LabRequisition"){
    
  const OrgPeers = ['peer0.hospital.healthvault.com:7051','peer0.laboratory.healthvault.com:7052'];
    const transaction = setup_1(networkObj, function_Name, OrgPeers);
    
    const Update_Patient_Detials_Res  = await await transaction.submit(patientId,
      checkup,
      scans,
      doctorId, key, value, MSPID); //changes required
      await networkObj.gateway.disconnect();  
    
      if (Update_Patient_Detials_Res.error) {
        res.status(400).send(Update_Patient_Detials_Res.error);
      }      
      
      //res.status(201).json(`${prettyJSONString(Update_Patient_Detials_Res)}`);
      res.status(201).json(`Successfully doctor created patient lab requisition.`);

  }else if(function_Name == "DoctorCreate_patientMedDetails"){

    //const OrgPeers = ['peer0.hospital.healthvault:7051','peer0.laboratory.healthvault.com:7052'];
    const transaction = setup(networkObj, function_Name);

    const Update_Patient_Detials_Res  = await transaction.submit(patientId,
      drugName,
      drugQuantity,
      drugDaysofSupply,
      others,
      description,
      doctorId,
      prescriptionValidity, 
      key, value, MSPID); //changes required
      await networkObj.gateway.disconnect();  


      if (Update_Patient_Detials_Res.error) {
        res.status(400).send(Update_Patient_Detials_Res.error);
      }      
      
      //res.status(201).json(`${prettyJSONString(Update_Patient_Detials_Res)}`);
      res.status(201).json(`Successfully doctor created patient medical prescription.`); 
  }else{
    res.status(300).send('Invalid function triggered');
  }

}

//--------------------------------Doctor Query transcations -----------------------------

exports.Doctor_query = async(req,res,org,orgId,DocID) => {
  const networkObj = await network.connectToNetwork(req,res,org,orgId,DocID);
    const {firstName, lastName} = req.body;
    const patientId = req.body.patientId;
    const queryName = req.headers.query;

    console.log("queryName:",queryName);
    console.log("Doctor ID : ",req.user.ID);

  const transaction = setup(networkObj, queryName);

    
    if(queryName === "Doctor_ReadPatients"){
      const response = await transaction.evaluate(patientId,req.user.ID, key, value, MSPID);
      
      await networkObj.gateway.disconnect();  
    
      if (response.error) {
        res.status(201).send(`Patient ${patientId} doesn't give permission`);  
        res.status(400).send(response.error);
      }
      

      console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
      res.status(201).json(`${prettyJSONString(response)}`);


    }else if(queryName === "Doctor_readDoctor"){
      console.log("queryName:",queryName);
      console.log("Doctor ID : ",req.user.ID);
      const response = await transaction.evaluate(req.user.ID, key, value, MSPID);
      
      await networkObj.gateway.disconnect();  
    
      if (response.error) {
        res.status(400).send(response.error);
      }
      console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
      res.status(201).json(`${prettyJSONString(response)}`);

    }else if(queryName === "Doctor_queryPatientsByFirstname"){
      const response = await transaction.evaluate(firstName, key, value, MSPID);
      
      await networkObj.gateway.disconnect();  
    
      if (response.error) {
        res.status(400).send(response.error);
      }
      console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
      res.status(201).json(`${prettyJSONString(response)}`);

    }else if(queryName === "Doctor_queryPatientsByLastname"){
      const response = await transaction.evaluate(lastName, key, value, MSPID);
      
      await networkObj.gateway.disconnect();  
    
      if (response.error) {
        res.status(400).send(response.error);
      }
      console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
      res.status(201).json(`${prettyJSONString(response)}`);
    }else if(queryName === "Doctor_ReadPatientReport" || queryName === "DoctorRead_LabReq" || queryName === "Doctor_ReadMedPrescription"){
      // console.log("queryName:",queryName);
      // console.log("Doctor ID : ",req.user.ID);
      const response = await transaction.evaluate(patientId, req.user.ID, key, value, MSPID);

      await networkObj.gateway.disconnect();  

      if(queryName === "Doctor_ReadPatientReport")
      {
        const result = JSON.parse(response);
        console.log(result.enImages);

        const base64Data = result.enImages;

        // Decode the base64 data into a buffer
        const buffer = Buffer.from(base64Data, 'base64');

        // Write the buffer to a file
        fs.writeFileSync(`./images/${patientId}.jpg`, buffer);
      
      }
    
      if (response.error) {
        res.status(400).send(response.error);
      }
      console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
      res.status(201).json(`${prettyJSONString(response)}`);

    }
    /*
    else if(queryName === "DoctorRead_LabReq"){
      console.log("queryName:",queryName);
      console.log("Doctor ID : ",req.user.ID);
      const response = await await transaction.evaluate(req.user.ID, key, value, MSPID);
      
      await networkObj.gateway.disconnect();  
    
      if (response.error) {
        res.status(400).send(response.error);
      }
      console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
      res.status(201).json(`${prettyJSONString(response)}`);

    }
    else if(queryName === "Doctor_ReadMedPrescription"){
      console.log("queryName:",queryName);
      console.log("Doctor ID : ",req.user.ID);
      const response = await transaction.evaluate(req.user.ID, key, value, MSPID);
      
      await networkObj.gateway.disconnect();  
    
      if (response.error) {
        res.status(400).send(response.error);
      }
      console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
      res.status(201).json(`${prettyJSONString(response)}`);

    }*/
    else{
      res.status(300).send('Invalid function triggered');
    }
}