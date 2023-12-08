/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const {buildCAClient, registerAndEnrollUser} = require('./Utils/CaUtils.js');
const {buildCCPHospital, buildCCPInsurance, buildCCPLaboratory, buildCCPharmacy, buildWallet} = require('./Utils/Utils.js');
const walletPath = path.join(__dirname, 'wallet');

let mspOrg;
let adminUserId;
let caClient;



exports.enrollRegisterUser = async function(orgId, userId, attributes) {
    try {
      // setup the wallet to hold the credentials of the application user
      const wallet = await buildWallet(Wallets, walletPath);
      orgId = parseInt(orgId);
  
      if (orgId === 1) {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = buildCCPHospital();
  
        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital.healthvault.com');
  
        mspOrg = 'HospitalMSP';
        adminUserId = 'HospitalAdmin';
      }else if (orgId === 2) {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = buildCCPLaboratory();
  
        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        caClient = buildCAClient(FabricCAServices, ccp, 'ca.laboratory.healthvault.com');
  
        mspOrg = 'LaboratoryMSP';
        adminUserId = 'LaboratoryAdmin';
      }else if (orgId === 3) {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = buildCCPharmacy();
  
        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        caClient = buildCAClient(FabricCAServices, ccp, 'ca.pharmacy.healthvault.com');
  
        mspOrg = 'PharmacyMSP';
        adminUserId = 'PharmacyAdmin';
      }else if (orgId === 4) {
        // build an in memory object with the network configuration (also known as a connection profile)
        const ccp = buildCCPInsurance();
  
        // build an instance of the fabric ca services client based on
        // the information in the network configuration
        caClient = buildCAClient(FabricCAServices, ccp, 'ca.insurance.healthvault.com');
  
        mspOrg = 'InsuranceMSP';
        adminUserId = 'InsuranceAdmin';
      }
      // enrolls users to Hospital 1 and adds the user to the wallet
      await registerAndEnrollUser(caClient, wallet, mspOrg, userId, adminUserId, attributes);
      console.log('msg: Successfully enrolled user ' + userId + ' and imported it into the wallet');
    } catch (error) {
      console.error(`Failed to register user "${userId}": ${error}`);
      process.exit(1);
    }
  };
  