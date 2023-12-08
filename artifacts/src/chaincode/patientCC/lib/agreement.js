"use strict";

const { Contract, Context} = require("fabric-contract-api");
const crypto = require("crypto");
const os = require("os");

class Agreement extends Contract {
  // ================================================================================ADMIN FUNCTIONS================================================================================

  async init(ctx) {
    // No implementation required with this example
    // It could be where data migration is performed, if necessary
    console.log('Instantiate the contract');
  }


  async Admin_createPatient(
    ctx,
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
  ) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const clientmspid = await ctx.clientIdentity.getMSPID();
    if (result && clientmspid === MSPID) {
      console.log(`MSPID : ${clientmspid}, key : ${key}, value :${value}`);
      
      const exists = await ctx.stub.getPrivateData("hospCollection", patientId);
      if ((!!exists && exists.length > 0)) {
        throw new Error(`The patient ${patientId} already exists`);
      }

      const patient = {
        patientId: patientId,
        firstname: firstname,
        lastname: lastname,
        dob: dob,
        age: age,
        gender: gender,
        address: address,
        phoneNo: phoneNo,
        emailId: emailId,
        emergencyContactNo: emergencyContactNo,
        permissionGranted: [],
        password: crypto.createHash("sha256").update(password).digest("hex"),
        docType: "patient",
        changedBy: "none",
      };
      const buffer = Buffer.from(JSON.stringify(patient));

      const peerMspid = ctx.stub.getMspID();
      console.log("peerMSPID : "+ peerMspid);

      if(peerMspid !== clientmspid)
      {
         throw new Error(`commiting peer and CID's MSPID doesnt match`);
      }

      await ctx.stub.putPrivateData("hospCollection", patientId, buffer);
      console.log("The patient data is created successfully!");
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Admin_createDoctor(
    ctx,
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
  ) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData("hospCollection", doctorId);
      if ((!!exists && exists.length > 0)) {
        throw new Error(`The Doctor ${doctorId} already exists`);
      }
      const doctor = {
        doctorId: doctorId,
        firstname: firstname,
        lastname: lastname,
        age: age,
        phoneNo: phoneNo,
        emailId: emailId,
        address: address,
        bloodgroup: bloodgroup,
        field: field,
        department: department,
        password: crypto.createHash("sha256").update(password).digest("hex"),
        docType: "doctor",
      };

      const buffer = Buffer.from(JSON.stringify(doctor));
      await ctx.stub.putPrivateData("hospCollection", doctorId, buffer);
      console.log("The Doctor data is created successfully!");
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Admin_createBillManager(
    ctx,
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
  ) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData("hospCollection", managerId);
      if ((!!exists && exists.length > 0)) {
        throw new Error(`The Bill Manager ${managerId} already exists`);
      }
      const manager = {
        managerId: managerId,
        firstname: firstname,
        lastname: lastname,
        emailId: emailId,
        password: crypto.createHash("sha256").update(password).digest("hex"),
        phoneNo: phoneNo,
        address: address,
      };

      const buffer = Buffer.from(JSON.stringify(manager));
      await ctx.stub.putPrivateData("hospCollection", managerId, buffer);
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Admin_deletePatient(ctx, patientId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData("hospCollection", patientId);
      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The patient ${patientId} does not exist`);
      }
      await ctx.stub.deletePrivateData("hospCollection", patientId);
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Admin_deleteDoctor(ctx, doctorId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData("hospCollection", doctorId);
      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The doctor ${doctorId} does not exist`);
      }
      await ctx.stub.deletePrivateData("hospCollection", doctorId);
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Admin_deleteBillManager(ctx, managerId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData("hospCollection", managerId);
      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The Bill Manager data ${managerId} does not exist`);
      }
      await ctx.stub.deletePrivateData("hospCollection", managerId);  //changed
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async initLedger(ctx) {

    const admin = {
      AdminID : "HospitalAdmin",
      password : "123456789",
      emailId : "hospitaladmin@gmail.com"
    };

    await ctx.stub.putPrivateData('hospCollection', admin.AdminID, Buffer.from(JSON.stringify(admin)));
    console.log('Created admin record with ID:', admin.AdminID);

  }


  // async readAdminDetails(ctx, adminId, password, key, value, MSPID) {
  //   const result = await ctx.clientIdentity.assertAttributeValue(
  //     `${key}`,
  //     `${value}`
  //   );
  //   const mspid = await ctx.clientIdentity.getMSPID();
  //   if (result && mspid === MSPID) {
  //     const exists = await ctx.stub.getPrivateData("hospCollection", adminId);
  //     if (!exists) {
  //       throw new Error(`The Admin ${adminId} does not exist`);
  //     } else {
  //       const asset = JSON.parse(exists.toString());
  //       password = crypto.createHash("sha256").update(password).digest("hex");
  //       if (asset.adminId == adminId && asset.password == password) {
  //         return asset;
  //       }
  //     }
  //   } else {
  //     throw new Error(`Not Authorized to Access`);
  //   }
  // }

  async readAdminDetails(ctx, adminId/*, password, key, value, MSPID*/) {
    //   const result = await ctx.clientIdentity.assertAttributeValue(
    //     `${key}`,
    //     `${value}`
    //   );
    //   const mspid = await ctx.clientIdentity.getMSPID();
    //   if (result && mspid === MSPID) {
        const exists = await ctx.stub.getPrivateData("hospCollection", adminId);
        if (!(!!exists && exists.length > 0)) {
          throw new Error(`The Admin ${adminId} does not exist`);
        } else {
          const asset = JSON.parse(exists.toString());
          // password = crypto.createHash("sha256").update(password).digest("hex");
          // if (asset.adminId == adminId && asset.password == password) {
            return asset;
          }
   }
   


  async Admin_readPatient(ctx, patientId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData(`hospCollection`, patientId);
      const exists1 = await ctx.stub.getPrivateData(
        `patientPrivateCollection`,
        patientId
      );
      const exists2 = await ctx.stub.getPrivateData(
        `pharmaCollection`,
        patientId
      );

      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The patient ${patientId} does not exist`);
      }

      if (!!exists1 && exists1.length > 0 && !!exists2 && exists2.length > 0) {
        const asset1 = JSON.parse(exists.toString());
        const asset2 = JSON.parse(exists1.toString());
        const asset3 = JSON.parse(exists2.toString());

        const asset = {
          asset1: asset1,
          asset2: asset2,
          asset3: asset3,
        };
        return asset;
      } else if (
        !!exists1 &&
        exists1.length > 0 &&
        !(!!exists2 && exists2.length > 0)
      ) {
        const asset1 = JSON.parse(exists.toString());
        const asset2 = JSON.parse(exists1.toString());

        const asset = {
          asset1: asset1,
          asset2: asset2,
        };
        return asset;
      } else if (
        !!exists2 &&
        exists2.length > 0 &&
        !(!!exists1 && exists1.length > 0)
      ) {
        const asset1 = JSON.parse(exists.toString());
        const asset2 = JSON.parse(exists2.toString());

        const asset = {
          asset1: asset1,
          asset2: asset2,
        };
        return asset;
      } else {
        const asset = JSON.parse(exists.toString());
        return asset;
      }
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Admin_readDoctor(ctx, doctorId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData("hospCollection", doctorId);
      if (!(!!exists && exists.length > 0)) {
        throw new Error(
          `The doctor with doctor ID: ${doctorId} does not exist`
        );
      }
      const asset = JSON.parse(exists.toString());
      return asset;
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Admin_readBillManager(ctx, managerId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData("hospCollection", managerId);
      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The Bill Manager data ${managerId} does not exist`);
      }
      const asset = JSON.parse(exists.toString());
      return asset;
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Admin_queryPatientsByFirstname(ctx, firstname, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      let queryString = {};
      queryString.selector = {};
      queryString.selector.docType = "patient";
      queryString.selector.firstname = firstname;
      const buffer = await this.getQueryResultForQueryString(
        ctx,
        JSON.stringify(queryString),
        key,
        value,
        MSPID
      );
      let result = JSON.parse(buffer.toString());

      return this.fetchLimitedFields(result);
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async getQueryResultForQueryString(ctx, queryString, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      let resultsIterator = await ctx.stub.getPrivateDataQueryResult(
        "hospCollection",
        queryString
      );
      console.info("getQueryResultForQueryString <--> ", resultsIterator);
      let results = await this.getAllPatientResults(
        ctx,
        resultsIterator,
        false,
        key,
        value,
        MSPID
      );
      return JSON.stringify(results);
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async getAllPatientResults(ctx, iterator, isHistory, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      let allResults = [];
      while (true) {
        let res = await iterator.next();

        if (res.value && res.value.value.toString()) {
          let jsonRes = {};
          console.log(res.value.value.toString("utf8"));

          if (isHistory && isHistory === true) {
            jsonRes.Timestamp = res.value.timestamp;
          }
          jsonRes.Key = res.value.key;

          try {
            jsonRes.Record = JSON.parse(res.value.value.toString("utf8"));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString("utf8");
          }
          allResults.push(jsonRes);
        }
        if (res.done) {
          console.log("end of data");
          await iterator.close();
          console.info(allResults);
          return allResults;
        }
      }
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  fetchLimitedFields = (result) => {
    for (let i = 0; i < result.length; i++) {
      const obj = result[i];
      result[i] = {
        patientId: obj.Key,
        firstname: obj.Record.firstname,
        lastname: obj.Record.lastname,
        phoneNo: obj.Record.phoneNo,
      };
    }
  };

  async Admin_queryPatientsByLastname(ctx, lastname, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      let queryString = {};
      queryString.selector = {};
      queryString.selector.docType = "patient";
      queryString.selector.lastname = lastname;
      const buffer = await this.getQueryResultForQueryString(
        ctx,
        JSON.stringify(queryString),
        key,
        value,
        MSPID
      );
      let result = JSON.parse(buffer.toString());

      return this.fetchLimitedFields(result);
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  // async Admin_GrantAccessTo_others() {}

  // async Admin_revokeAccessTo_others() {}

  // async Admin_GrantPatientBilltoInsurance() {}

  // async Admin_RevokePatientBilltoInsurance() {}

  // async Admin_GrantPatientPrescriptionToPharma() {}

  // async Admin_RevokePatientPrescriptionToPharma() {}

  // ================================================================================ADMIN DONE================================================================================

  // async patientExists(ctx, patientId) {
  //   const buffer = await ctx.stub.getPrivateData("hospCollection", patientId);
  //   return !!buffer && buffer.length > 0;
  // }



  async Patient_updatePatient(
    ctx,
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
  ) {

    console.log(patientId,
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
      MSPID);

    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData("hospCollection", patientId);
      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The patient ${patientId} does not exist`);
      }
      const patient = await this.Patient_readPatient(
        ctx,
        patientId,
        key,
        value,
        MSPID
      );
      let isDataChanged = false;
      if (
        newFirstname !== null &&
        newFirstname !== "" &&
        patient.firstname !== newFirstname
      ) {
        patient.firstname = newFirstname;
        isDataChanged = true;
      }
      if (
        newEmailId !== null &&
        newEmailId !== "" &&
        patient.emailId !== newEmailId
      ) {
        patient.emailId = newEmailId;
        isDataChanged = true;
      }

      if (newdob !== null && newdob !== "" && patient.dob !== newdob) {
        patient.dob = newdob;
        isDataChanged = true;
      }

      if (
        newLastname !== null &&
        newLastname !== "" &&
        patient.lastname !== newLastname
      ) {
        patient.lastname = newLastname;
        isDataChanged = true;
      }

     /* 
     if (newPassword === null || newPassword === "") {
        throw new Error(
          `Empty or null values should not be passed for newPassword parameter`
        );
      } else {
        patient.password = crypto
          .createHash("sha256")
          .update(newPassword)
          .digest("hex");
      }*/

      if (newAge !== null && newAge !== "" && patient.age !== newAge) {
        patient.age = newAge;
        isDataChanged = true;
      }

      if (updatedBy !== null && updatedBy !== "") {
        patient.changedBy = updatedBy;
      }

      if (
        newPhoneNumber !== null &&
        newPhoneNumber !== "" &&
        patient.phoneNumber !== newPhoneNumber
      ) {
        patient.phoneNumber = newPhoneNumber;
        isDataChanged = true;
      }

      if (
        newEmergPhoneNumber !== null &&
        newEmergPhoneNumber !== "" &&
        patient.emergPhoneNumber !== newEmergPhoneNumber
      ) {
        patient.emergPhoneNumber = newEmergPhoneNumber;
        isDataChanged = true;
      }

      if (
        newAddress !== null &&
        newAddress !== "" &&
        patient.address !== newAddress
      ) {
        patient.address = newAddress;
        isDataChanged = true;
      }
      if (isDataChanged === false) return;

      const buffer = Buffer.from(JSON.stringify(patient));
      await ctx.stub.putPrivateData("hospCollection", patientId, buffer);
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Patient_updatePatientPassword(
    ctx,
    patientId,
    newPassword,
    key,
    value,
    MSPID
  ) {
    console.log(patientId,
      newPassword,
      key,
      value,
      MSPID);

      const value1 = ctx.clientIdentity.getAttributeValue(
        `${key}`);

    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    
    const mspid = await ctx.clientIdentity.getMSPID();
    console.log(`Result : ${value1} , so matched ? : ${result}, mspid : ${mspid}`);
    

    if (result && mspid === MSPID) {
      if (newPassword === null || newPassword === "") {
        throw new Error(
          `Empty or null values should not be passed for newPassword parameter`
        );
      }

      const patient = await this.Patient_readPatient(
        ctx,
        patientId,
        key,
        value,
        MSPID
      );
      patient.password = crypto
        .createHash("sha256")
        .update(newPassword)
        .digest("hex");
      if (patient.pwdTemp) {
        patient.pwdTemp = false;
        patient.changedBy = patientId;
      }
      const buffer = Buffer.from(JSON.stringify(patient));
      await ctx.stub.putPrivateData("hospCollection", patientId, buffer);
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async patient_GrantAccessTo_others(
    ctx,
    patientId,
    accessId,
    key,
    value,
    MSPID
  ) {
    console.log(patientId,
      accessId,
      key,
      value,
      MSPID);
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData("hospCollection", patientId);
      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The PatientId ${patientId} already exists`);
      }
      const patient = JSON.parse(exists.toString());
      if (!patient.permissionGranted.includes(accessId)) {
        patient.permissionGranted.push(accessId);
        patient.changedBy = patientId;
      }
      const buffer = Buffer.from(JSON.stringify(patient));
      await ctx.stub.putPrivateData("hospCollection", patientId, buffer);
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async patient_RevokeAccess(ctx, patientId, revokeId, key, value, MSPID) {
    console.log(patientId,
      revokeId,
      key,
      value,
      MSPID);
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const patient = await this.Patient_readPatient(
        ctx,
        patientId,
        key,
        value,
        MSPID
      );
      // Remove the doctor if existing
      if (patient.permissionGranted.includes(revokeId)) {
        patient.permissionGranted = patient.permissionGranted.filter(
          (temp) => temp !== revokeId
        );
        patient.changedBy = patientId;
      }
      const buffer = Buffer.from(JSON.stringify(patient));
      // Update the ledger with updated permissionGranted
      await ctx.stub.putPrivateData("hospCollection", patientId, buffer);
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  
  async Patient_readPatient(ctx, patientId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists1 = await ctx.stub.getPrivateData(
        "hospCollection",
        patientId
      );
      const exists2 = await ctx.stub.getPrivateData(
        "patientPrivateCollection",
        patientId
      );
      if (!(!!exists1 && exists1.length > 0)) {
        throw new Error(`The patient ${patientId} does not exist`);
      } else if (
        !!exists1 &&
        exists1.length > 0 &&
        !!exists2 &&
        exists2.length > 0
      ) {
        const asset1 = JSON.parse(exists1.toString());
        const asset2 = JSON.parse(exists2.toString());
        const asset = { asset1: asset1, asset2: asset2 };
        return asset;
      } else {
        const asset1 = JSON.parse(exists1.toString());
        return asset1;
      }
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Patient_readLabReq(ctx, patientId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData(
        "LabReportCollection",
        patientId
      );

      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The patient ${patientId} does not exist`);
      }
      const patient = JSON.parse(exists.toString());
      return patient;
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Patient_ReadLabReport(ctx, patientId, key, value, MSPID) {
    const patient = Patient_readLabReq(ctx, patientId, key, value, MSPID);
    return patient;
  }
 
  async Patient_readMedPrescriptions(ctx, patientId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData(
        "pharmaCollection",
        patientId
      );

      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The patient ${patientId} does not exist`);
      }
      const patient = JSON.parse(exists.toString());
      return patient;
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Patient_ReadHospitalBill(ctx, patientId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData("billCollection", patientId);
      if (!(!!exists && exists.length > 0)) {
        throw new Error(
          `The patient Bill with patient Id: ${patientId} does not exist`
        );
      }
      const patientBill = JSON.parse(exists.toString());
      return patientBill;
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }


  // ================================================================================Patient DONE================================================================================

  

  async Doctor_updateDoctor(
    ctx,
    doctorId,
    newfirstname,
    newlastname,
    newAge,
    newPassword,
    newphoneNumber,
    newaddress,
    newfields,
    newdepartment,
    newbloodgroup,
    key,
    value,
    MSPID
  ) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await this.doctorExists(ctx, doctorId, key, value, MSPID);
      if (!exists) {
        throw new Error(`The Doctor with ID: ${doctorId} does not exist`);
      }
      const doctor = await this.Doctor_readDoctor(
        ctx,
        doctorId,
        key,
        value,
        MSPID
      );
      let isDataChanged = false;
      if (
        newfirstname !== null &&
        newfirstname !== "" &&
        doctor.firstname !== newfirstname
      ) {
        doctor.firstname = newfirstname;
        isDataChanged = true;
      }

      if (
        newlastname !== null &&
        newlastname !== "" &&
        doctor.lastname !== newlastname
      ) {
        doctor.lastname = newlastname;
        isDataChanged = true;
      }

      if (newAge !== null && newAge !== "" && doctor.age !== newAge) {
        doctor.age = newAge;
        isDataChanged = true;
      }

      if (newPassword === null || newPassword === "") {
        throw new Error(
          `Empty or null values should not be passed for newPassword parameter`
        );
      } else {
        doctor.password = crypto
          .createHash("sha256")
          .update(newPassword)
          .digest("hex");
      }

      if (
        newphoneNumber !== null &&
        newphoneNumber !== "" &&
        doctor.phoneNumber !== newphoneNumber
      ) {
        doctor.phoneNumber = newphoneNumber;
        isDataChanged = true;
      }

      if (
        newaddress !== null &&
        newaddress !== "" &&
        doctor.address !== newaddress
      ) {
        doctor.address = newaddress;
        isDataChanged = true;
      }

      if (
        newfields !== null &&
        newfields !== "" &&
        doctor.Fields !== newfields
      ) {
        doctor.Fields = newfields;
        isDataChanged = true;
      }
      if (
        newbloodgroup !== null &&
        newbloodgroup !== "" &&
        doctor.bloodgroup !== newbloodgroup
      ) {
        doctor.bloodgroup = newbloodgroup;
        isDataChanged = true;
      }
      if (
        newdepartment !== null &&
        newdepartment !== "" &&
        doctor.department !== newdepartment
      ) {
        doctor.department = newdepartment;
        isDataChanged = true;
      }

      if (isDataChanged === false) return;

      const buffer = Buffer.from(JSON.stringify(doctor));
      await ctx.stub.putPrivateData("hospCollection", doctorId, buffer);
      console.log("The Doctor data is updated successfully!");
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Doctor_updatePatientDetails(
    ctx,
    patientId,
    newSymptoms,
    newDiagnosis,
    newTreatment,
    newFollowUp,
    doctorId,
    key,
    value,
    MSPID
  ) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData(
        "patientPrivateCollection",
        patientId
      );

      if (!(!!exists && exists.length > 0)) {
        const patientPrivate = {
          patientId: patientId,
          symptoms: newSymptoms,
          diagnosis: newDiagnosis,
          treatment: newTreatment,
          followUp: newFollowUp,
          updatedBy: doctorId,
        };
        const buffer = Buffer.from(JSON.stringify(patientPrivate));
        await ctx.stub.putPrivateData(
          "patientPrivateCollection",
          patientId,
          buffer
        );
      } else {
        const patient = await this.Patient_readPatient(
          ctx,
          patientId,
          key,
          value,
          MSPID
        );
        let isDataChanged = false;
        if (
          newSymptoms !== null &&
          newSymptoms !== "" &&
          patient.symptoms !== newSymptoms
        ) {
          patient.symptoms = newSymptoms;
          isDataChanged = true;
        }

        if (
          newDiagnosis !== null &&
          newDiagnosis !== "" &&
          patient.diagnosis !== newDiagnosis
        ) {
          patient.diagnosis = newDiagnosis;
          isDataChanged = true;
        }

        if (
          newTreatment !== null &&
          newTreatment !== "" &&
          patient.treatment !== newTreatment
        ) {
          patient.treatment = newTreatment;
          isDataChanged = true;
        }

        if (
          newFollowUp !== null &&
          newFollowUp !== "" &&
          patient.followUp !== newFollowUp
        ) {
          patient.followUp = newFollowUp;
          isDataChanged = true;
        }

        if (updatedBy !== null && updatedBy !== "") {
          patient.changedBy = updatedBy;
        }

        if (isDataChanged === false) return;

        const patientPrivate = {
          patientId: patientId,
          symptoms: patient.symptoms,
          diagnosis: patient.diagnosis,
          treatment: patient.treatment,
          followUp: patient.followUp,
          updatedBy: patient.changedBy,
        };

        const buffer = Buffer.from(JSON.stringify(patientPrivate));
        await ctx.stub.putPrivateData(
          "patientPrivateCollection",
          patientId,
          buffer
        );
        console.log("The patient data is added successfully!");
      }
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async DoctorCreate_LabRequisition(
    ctx,
    patientId,
    checkup,
    scans,
    doctorId,
    key,
    value,
    MSPID
  ) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists1 = await ctx.stub.getPrivateData("hospCollection", patientId);
      const patient = JSON.parse(exists1.toString());

      const patientLabReq = {
        patientId: patientId,
        patientFirstname: patient.firstname,
        patientLastname: patient.lastname,
        patientAge: patient.age,
        patientGender: patient.gender,
        patientdob: patient.dob,
        checkup: checkup,
        scans: scans,
        signedBy: doctorId,
      };
      const buffer = Buffer.from(JSON.stringify(patientLabReq));
      await ctx.stub.putPrivateData("LabReportCollection", patientId, buffer);
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async DoctorCreate_patientMedDetails(
    ctx,
    patientId,
    drugName,
    drugQuantity,
    drugDaysofSupply,
    others,
    description,
    doctorId,
    prescriptionValidity,
    key,
    value,
    MSPID
  ) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const pharmacyPrescription = {
        patientId: patientId,
        drugName: drugName,
        drugQuantity: drugQuantity,
        drugDaysofSupply: drugDaysofSupply,
        others: others,
        description: description,
        signedByDoctor: doctorId,
        prescriptionValidity: prescriptionValidity,
      };

      const buffer = Buffer.from(JSON.stringify(pharmacyPrescription));
      await ctx.stub.putPrivateData("pharmaCollection", patientId, buffer);
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }
  


  async doctorExists(ctx, doctorId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const buffer = await ctx.stub.getPrivateData("hospCollection", doctorId);
      return !!buffer && buffer.length > 0;
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Doctor_readDoctor(ctx, doctorId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await this.doctorExists(ctx, doctorId, key, value, MSPID);
      if (!exists) {
        throw new Error(`The patient ${doctorId} does not exist`);
      }
      const buffer = await ctx.stub.getPrivateData("hospCollection", doctorId);
      const result = JSON.parse(buffer.toString());
      return result;
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Doctor_ReadPatients(ctx, patientId, doctorId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      let patient = await this.Patient_readPatient(
        ctx,
        patientId,
        key,
        value,
        MSPID
      );

      const numAttributes = Object.keys(patient).length;
      console.log(numAttributes);

      var permissionArray;

      if(numAttributes == 2)
      {
         permissionArray = patient.asset1.permissionGranted;
      }
      else 
      {
         permissionArray = patient.permissionGranted;
      }

      
      console.log(permissionArray); // added

      if (permissionArray.includes(doctorId)) {
        const exists1 = await ctx.stub.getPrivateData(
          `hospCollection`,
          patientId
        );
        const exists2 = await ctx.stub.getPrivateData(
          `patientPrivateCollection`,
          patientId
        );
        if (
          !!exists1 &&
          exists1.length > 0 &&
          !!exists2 &&
          exists2.length > 0
        ) {
          const asset1 = JSON.parse(exists1.toString());
          const asset2 = JSON.parse(exists2.toString());

          const asset = {
            patientId: patientId,
            firstname: asset1.firstname,
            lastname: asset1.lastname,
            age: asset1.age,
            gender: asset1.gender,
            phoneNo: asset1.phoneNo,
            dob: asset1.dob,
            Symptoms: asset2.newSymptoms,
            Diagnosis: asset2.newDiagnosis,
            Treatment: asset2.newTreatment,
            FollowUp: asset2.newFollowUp,
          };
          return asset;
        } else if (
          !!exists1 &&
          exists1.length > 0 &&
          !(!!exists2 && exists2.length > 0)
        ) {
          const asset1 = JSON.parse(exists1.toString());
          const asset = {
            patientId: patientId,
            firstname: asset1.firstname,
            lastname: asset1.lastname,
            age: asset1.age,
            gender: asset1.gender,
            phoneNo: asset1.phoneNo,
            dob: asset1.dob,
          };
          return asset;
        } else {
          throw new Error(`The Patient with ${patientId} does not Exist`);
        }
      } else {
        throw new Error(
          `The Doctor with ${doctorId} is not authorized to access`
        );
      }
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Doctor_queryPatientsByFirstname(ctx, firstname, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      return await this.Admin_queryPatientsByFirstname(
        ctx,
        firstname,
        key,
        value,
        MSPID
      );
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Doctor_queryPatientsByLastname(ctx, lastname, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      return await this.Admin_queryPatientsByLastname(
        ctx,
        lastname,
        key,
        value,
        MSPID
      );
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Doctor_ReadPatientReport(ctx, patientId, doctorId, key, value, MSPID) {
    const patient = this.DoctorRead_LabReq(
      ctx,
      patientId,
      doctorId,
      key,
      value,
      MSPID
    );
    return patient;
  }

  async DoctorRead_LabReq(ctx, patientId, doctorId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData("hospCollection", patientId);
      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The patient ${patientId} does not exist`);
      }
      const patient = JSON.parse(exists.toString());
      const permissionArray = patient.permissionGranted;
      const exists1 = await ctx.stub.getPrivateData("LabReportCollection", patientId);
      const check = JSON.parse(exists1.toString());
      const signedBy = check.signedBy;

      if (permissionArray.includes(doctorId) || signedBy.includes(doctorId)) {
        return check;
      } else {
        throw new Error(
          `The doctor ${doctorId} does not have permission to read the patient data with ID ${patientId}`
        );
      }
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  } 

  async Doctor_ReadMedPrescription(
    ctx,
    patientId,
    doctorId,
    key,
    value,
    MSPID
  ) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData("hospCollection", patientId);
      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The patient ${patientId} does not exist`);
      }
      const patient = JSON.parse(exists.toString());
      const permissionArray = patient.permissionGranted;
      const exists1 = await ctx.stub.getPrivateData("pharmaCollection", patientId);
      const check = JSON.parse(exists1.toString());
      const signedBy = check.signedByDoctor;

      if (permissionArray.includes(doctorId) || signedBy.includes(doctorId)) {
        return check;
      } else {
        throw new Error(
          `The doctor ${doctorId} does not have permission to read the patient data with ID ${patientId}`
        );
      }
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  



  // ================================================================================Doctor DONE================================================================================




  async BillManager_HospitalBillCreation(
    ctx,              /*changed*/
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
    MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData(`hospCollection`, patientId);
      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The patient ${patientId} does not exist`);
      }
      const currentDate = new Date();
      const currentDateTime = currentDate.toLocaleString();

      const Bill_data = {
        patientId: patientId,
        patientFirstname: exists.patientFirstname,
        patientLastname: exists.patientLastname,
        hospName: hospName,
        hospId: hospId,
        patientInsuranceNo: patientInsuranceNo,
        detailedReport: detailedReport,
        additionalDetails: additionalDetails,
        billno: billno,
        Totalamount: amount,
        billCreationDateTime: currentDateTime,
        insuranceFirmId: insuranceFirmId,
        generatedBy: generatingManager,
      };

      const buffer = Buffer.from(JSON.stringify(Bill_data));
      await ctx.stub.putPrivateData("billCollection", patientId, buffer);
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async BillManager_readBM(ctx, managerId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData("hospCollection", managerId);
      if (!exists) {
        throw new Error(`The Bill Manager ${managerId} does not exist`);
      }
      const result = JSON.parse(exists.toString());
      return result;
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }


 
  async Labadmin_createReport(
    ctx,
    patientId,
    key,
    value,
    MSPID,
    testDate,
    abnormalities,
    furtherTesting,
    interpretation,
    ClinicalComments,
    Result,
    labId,
    testsPerformed, base64str
    /*key, value, MSPID changes needed*/
  ) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData(
        "LabReportCollection",
        patientId
      );
      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The patient ${patientId} does not exist`);
      }

      const patient = JSON.parse(exists.toString());

      const Report = {
        patientId: patientId,
        patientFirstname: patient.firstname,
        patientLastname: patient.lastname,
        labId: labId,
        patientAge: patient.age,
        patientGender: patient.gender,
        patientdob: patient.dob,
        checkup: patient.checkup,
        scans: patient.scans,
        signedBy: patient.doctorId,
        testDate: testDate,
        abnormalities: abnormalities,
        furtherTesting: furtherTesting,
        interpretation: interpretation,
        ClinicalComments: ClinicalComments,
        Result: Result,
        testsPerformed: testsPerformed,
        enImages : base64str
      };
      const buffer = Buffer.from(JSON.stringify(Report));
      await ctx.stub.putPrivateData("LabReportCollection", patientId, buffer);
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async LabAdmin_readLabReq(ctx, patientId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData(
        "LabReportCollection",
        patientId
      );

      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The patient ${patientId} does not exist`);
      }
      const patient = JSON.parse(exists.toString());
      return patient;
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

 

  

  async PharmaAdmin_readPatientPrescription(ctx, patientId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData(
        "pharmaCollection",
        patientId
      );

      if (!(!!exists && exists.length > 0)) {
        throw new Error(`The patient ${patientId} does not exist`);
      }
      const patient = JSON.parse(exists.toString());
      return patient;
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }

  async Insurance_ReadHospitalBill(ctx, patientId, key, value, MSPID) {
    const result = await ctx.clientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.clientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData("billCollection", patientId);
      if (!(!!exists && exists.length > 0)) {
        throw new Error(
          `The patient Bill with patient Id: ${patientId} does not exist`
        );
      }
      const patientBill = JSON.parse(exists.toString());
      return patientBill;
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }




// async Pharma_CreateBill(ctx, patientId, amount, billno) {
  //   const result = await ctx.ClientIdentity.assertAttributeValue(
  //     `${key}`,
  //     `${value}`
  //   );
  //   const mspid = await ctx.ClientIdentity.getMSPID();
  //   if (result && mspid === MSPID) {
  //     const exists = await ctx.stub.getPrivateData(
  //       "pharmaCollection",
  //       patientId
  //     );

  //     if (!(!!exists && exists.length > 0)) {
  //       throw new Error(`The patient ${patientId} does not exist`);
  //     }
  //     const patient = JSON.parse(exists.toString());
  //     const currentDate = new Date();
  //     const currentDateTime = currentDate.toLocaleString();

  //     const medicalBill =
  //     {
  //       patientId: patientId,
  //       billno: billno,
  //       Date_Time: currentDateTime,
  //       patientId: patientId,
  //       firstname : patient.firstname,
  //       lastname : patient.lastname,
  //       drugName : drugName,
  //       drugQuantity : drugQuantity,
  //       amount: amount,
  //       paidStatus: "paid",
  //     }
  //     const buffer = Buffer.from(JSON.stringify(medicalBill));
  //     await ctx.stub.putPrivateData("pharmaCollection", patientId, buffer);

  //   } else {
  //     throw new Error(`Not Authorized to Access`);
  //   }
  // }

  // async Patient_readMedBill() {
  //   const result = await ctx.ClientIdentity.assertAttributeValue(
  //     `${key}`,
  //     `${value}`
  //   );
  //   const mspid = await ctx.ClientIdentity.getMSPID();
  //   if (result && mspid === MSPID) {
  //   } else {
  //     throw new Error(`Not Authorized to Access`);
  //   }
  // } 
 

  // async Doctor_CreateMedPrescription(ctx, patientId, doctorId, key,value, MSPID) {
  //   const result = await ctx.ClientIdentity.assertAttributeValue(
  //     `${key}`,
  //     `${value}`
  //   );
  //   const mspid = await ctx.ClientIdentity.getMSPID();
  //   if (result && mspid === MSPID) {

  //   } else {
  //     throw new Error(`Not Authorized to Access`);
  //   }
  // }

   // async labAdmin_readPatientLabReq(patientId, labId, key, value, MSPID) {
  /*
    const result = await ctx.ClientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.ClientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const exists = await ctx.stub.getPrivateData(
        "patientLabReqCollection",
        patientId
      );
      const patient = JSON.parse(exists.toString())
      
      if ((!exists)) {
        throw new Error(`The patient ${patientId} does not exists`);
      } else if (patient.permissionGranted.includes(labId)) {
        
      }
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }
*/

  // async labAdmin_patientReport(
  /*
    patientId,
    reportId,
    labId,
    diagnosis,
    detailedReport,
    attachments,
    key,
    value,
    MSPID
  ) {
    const result = await ctx.ClientIdentity.assertAttributeValue(
      `${key}`,
      `${value}`
    );
    const mspid = await ctx.ClientIdentity.getMSPID();
    if (result && mspid === MSPID) {
      const currentDate = new Date();
      const currentDateTime = currentDate.toLocaleString();

      const exists = await ctx.stub.getPrivateData("hospCollection", patientId);
      if (!(!!exists && exists.length > 0)) {
        throw new Error(
          `The requested PatientId ${patientId} doesn't exist! create one!`
        );
      } else if (exists.permissionGranted.includes(labId)) {
        const patientReport = {
          patientId: exists.patientId,
          patientFirstname: exists.firstname,
          patientLastname: exists.lastname,
          patientGender: exists.gender,
          patientAge: exists.age,
          patinetDob: exists.dob,
          reportId: reportId,
          labId: labId,
          diagnosis: diagnosis,
          detailedReport: detailedReport,
          attachments: attachments,
          signedAuthority: labId,
          reportDateTime: currentDateTime,
          createdBy: labId,
          permissionGrantedto: [labId, patientId],
        };

        const buffer = Buffer.from(JSON.stringify(patientReport));
        await ctx.stub.putPrivateData("labCollection", patientId, buffer);
      } else {
        throw new Error(
          `The ${labId} does not have access to read ${patientId}.`
        );
      }
    } else {
      throw new Error(`Not Authorized to Access`);
    }
  }
*/

}

module.exports = Agreement;
// ================================================================================================================================================================

//   async patient_RevokeAccess(ctx, patientId, accessId, key, value, MSPID) {
//     const result = await ctx.ClientIdentity.assertAttributeValue(
//       `${key}`,
//       `${value}`
//     );
//     const mspid = await ctx.ClientIdentity.getMSPID();
//     if (result && mspid === MSPID) {
//       const patient = await ctx.stub.getPrivateData("hospCollection", doctorId);
//       // Remove the doctor if existing
//       if (patient.permissionGranted.includes(accessId)) {
//         patient.permissionGranted = patient.permissionGranted.filter(
//           (temp) => temp !== accessId
//         );
//         patient.changedBy = patientId;
//       }

//       const buffer = Buffer.from(JSON.stringify(patient));
//       // Update the ledger with updated permissionGranted
//       await ctx.stub.putState(patientId, buffer);
//     } else {
//       throw new Error(`Not Authorized to Access`);
//     }
//   }
// }
