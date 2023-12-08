const network = require("../Utils/network.js");
const { prettyJSONString } = require("../Utils/Utils.js");

const key = "BillManager";
const value = "true";
const MSPID = "HospitalMSP";

exports.BillManager_submit_transcations = async(req,res,org,orgId,BMID) => {
  const networkObj = await network.connectToNetwork(req,res,org,orgId,BMID);
  const {function_Name,
    patientId,
    hospName,
    hospId,
    patientInsuranceNo,
    insuranceFirmId,
    detailedReport,
    additionalDetails,
    billno,
    generatingManager,
    amount
    } = req.body;

    
  const bmid = BMID;
  if(function_Name == "BillManager_HospitalBillCreation"){


    const transaction = networkObj.contract.createTransaction('BillManager_HospitalBillCreation');
    const org1peer = ['peer0.hospital.healthvault.com:7051'];

    transaction.setEndorsingPeers(org1peer);
    console.log('peers found');


    const createBill  = await transaction.submit(
    patientId,
    hospName,
    hospId,
    patientInsuranceNo,
    insuranceFirmId,
    detailedReport,
    additionalDetails,
    billno,
    generatingManager,
    amount,
    key,
    value,
    MSPID);

    await networkObj.gateway.disconnect();  
    
    if (createBill.error) {
      res.status(400).send(createBill.error);
    }
    //res.status(201).json(`${prettyJSONString(UpdateDoctor_Detials_Res)}`);
    res.status(201).json(`Successfully created bill for ${patientId}.`);
  }

  // }else if(function_Name == "Doctor_updatePatientDetails"){
  //   const Update_Patient_Detials_Res  = await networkObj.contract.submitTransaction('Doctor_updatePatientDetails',patientId,
  //   newSymptoms ,newDiagnosis ,newTreatment ,newFollowUp,updatedBys);
  //     await networkObj.gateway.disconnect();  
    
  //     if (Update_Patient_Detials_Res.error) {
  //       res.status(400).send(Update_Patient_Detials_Res.error);
  //     }      
      
  //     //res.status(201).json(`${prettyJSONString(Update_Patient_Detials_Res)}`);
  //     res.status(201).json(`Successfully updated patient details.`);

  // }else if(function_Name == "DoctorCreate_LabRequisition"){
  //   const Update_Patient_Detials_Res  = await networkObj.contract.submitTransaction('Doctor_updatePatientDetails',patientId,
  //   newSymptoms ,newDiagnosis ,newTreatment ,newFollowUp,updatedBys); //changes required
  //     await networkObj.gateway.disconnect();  
    
  //     if (Update_Patient_Detials_Res.error) {
  //       res.status(400).send(Update_Patient_Detials_Res.error);
  //     }      
      
  //     //res.status(201).json(`${prettyJSONString(Update_Patient_Detials_Res)}`);
  //     res.status(201).json(`Successfully doctor created patient lab requisition.`);

  // }else if(function_Name == "DoctorCreate_patientMedDetails"){
  //   const Update_Patient_Detials_Res  = await networkObj.contract.submitTransaction('Doctor_updatePatientDetails',patientId,
  //   newSymptoms ,newDiagnosis ,newTreatment ,newFollowUp,updatedBys); //changes required
  //     await networkObj.gateway.disconnect();  
    
  //     if (Update_Patient_Detials_Res.error) {
  //       res.status(400).send(Update_Patient_Detials_Res.error);
  //     }      
      
  //     //res.status(201).json(`${prettyJSONString(Update_Patient_Detials_Res)}`);
  //     res.status(201).json(`Successfully doctor created patient medical prescription.`); }
  
  
  else{
    res.status(300).send('Invalid function triggered');
  }

}

//--------------------------------Doctor Query transcations -----------------------------

exports.BillManager_query = async(req,res,org,hospid,BMID) => {
//  const networkObj = await network.connectToNetwork(req,res,org,hospid,BMID);
// //     const {firstName, lastName} = req.body;
    const managerID = req.user.ID;
    const queryName = req.headers.query;
    console.log("queryName:",queryName);
    console.log("managerID  : ",managerID);
    
    if(queryName === "BillManager_readBM"){
      const response = await transaction.evaluate(req.user.ID, key, value, MSPID);
      
      await networkObj.gateway.disconnect();  
    
      if (response.error) {
        res.status(400).send(response.error);
      }
      console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
      res.status(201).json(`${prettyJSONString(response)}`);

    // } else if(queryName === "Doctor_readDoctor"){
//       console.log("queryName:",queryName);
//       console.log("Doctor ID : ",req.user.ID);
//       const response = await networkObj.contract.evaluateTransaction(queryName, req.user.ID);
      
//       await networkObj.gateway.disconnect();  
    
//       if (response.error) {
//         res.status(400).send(response.error);
//       }
//       console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
//       res.status(201).json(`${prettyJSONString(response)}`);

//     }else if(queryName === "Doctor_queryPatientsByFirstName"){
//       const response = await networkObj.contract.evaluateTransaction(queryName, firstName);
      
//       await networkObj.gateway.disconnect();  
    
//       if (response.error) {
//         res.status(400).send(response.error);
//       }
//       console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
//       res.status(201).json(`${prettyJSONString(response)}`);

//     }else if(queryName === "Doctor_queryPatientsByLastName"){
//       const response = await networkObj.contract.evaluateTransaction(queryName, lastName);
      
//       await networkObj.gateway.disconnect();  
    
//       if (response.error) {
//         res.status(400).send(response.error);
//       }
//       console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
//       res.status(201).json(`${prettyJSONString(response)}`);
//     }else if(queryName === "Doctor_ReadPatientReport"){
//       console.log("queryName:",queryName);
//       console.log("Doctor ID : ",req.user.ID);
//       const response = await networkObj.contract.evaluateTransaction(queryName, req.user.ID);
      
//       await networkObj.gateway.disconnect();  
    
//       if (response.error) {
//         res.status(400).send(response.error);
//       }
//       console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
//       res.status(201).json(`${prettyJSONString(response)}`);

//     }else if(queryName === "DoctorRead_LabReq"){
//       console.log("queryName:",queryName);
//       console.log("Doctor ID : ",req.user.ID);
//       const response = await networkObj.contract.evaluateTransaction(queryName, req.user.ID);
      
//       await networkObj.gateway.disconnect();  
    
//       if (response.error) {
//         res.status(400).send(response.error);
//       }
//       console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
//       res.status(201).json(`${prettyJSONString(response)}`);

//     }else if(queryName === "Doctor_ReadMedPrescription"){
//       console.log("queryName:",queryName);
//       console.log("Doctor ID : ",req.user.ID);
//       const response = await networkObj.contract.evaluateTransaction(queryName, req.user.ID);
      
//       await networkObj.gateway.disconnect();  
    
//       if (response.error) {
//         res.status(400).send(response.error);
//       }
//       console.log(`Transaction has been evaluated, result is: ${prettyJSONString(response)}`);
//       res.status(201).json(`${prettyJSONString(response)}`);

    }else{
      res.status(300).send('Invalid function triggered');
    }
}