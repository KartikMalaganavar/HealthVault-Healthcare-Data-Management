
'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const {buildCAClient, enrollAdmin} = require('./Utils/CaUtils.js');
const {buildCCPHospital, buildCCPInsurance, buildCCPLaboratory, buildCCPharmacy, buildWallet} = require('./Utils/Utils.js');
const walletPath = path.join(__dirname, 'wallet');

const HospitalAdmin = 'admin';
const HospitalAdminPswd = 'adminpw';
const msp1 = 'HospitalMSP';

const LaboratoryAdmin = 'LaboratoryAdmin';
const LaboratoryAdminPswd = 'LaboratoryAdminPswd';
const msp2 = 'LaboratoryMSP';

const PharmacyAdmin = 'PharmacyAdmin';
const PharmacyAdminPswd = 'PharmacyAdminPswd';
const msp3 = 'PharmacyMSP';

const InsuranceAdmin = 'InsuranceAdmin';
const InsuranceAdminPswd = 'InsuranceAdminPswd';
const msp4 = 'InsuranceMSP';

var key ;
var value;

exports.enrollHospitalAdmin = async function() {
    try {
      // build an in memory object with the network configuration (also known as a connection profile)
      const ccp = buildCCPHospital();
  
      // build an instance of the fabric ca services client based on
      // the information in the network configuration
      const caClient = buildCAClient(FabricCAServices, ccp, 'ca.hospital.healthvault.com');
  
      // setup the wallet to hold the credentials of the application user
      const wallet = await buildWallet(Wallets, walletPath);
      key = "HospitalAdmin"
      value = "hospitaladmin";
      // to be executed and only once per hospital. Which enrolls admin and creates admin in the wallet
      await enrollAdmin(caClient, wallet, msp1, HospitalAdmin, HospitalAdminPswd, key, value);
  
      console.log('msg: Successfully enrolled admin user ' + HospitalAdmin + ' and imported it into the wallet');
    } catch (error) {
      console.error(`Failed to enroll admin user ' + ${HospitalAdmin} + : ${error}`);
      process.exit(1);
    }
  };

  exports.enrollLaboratoryAdmin = async function() {
    try {
      // build an in memory object with the network configuration (also known as a connection profile)
      const ccp = buildCCPInsurance();
  
      // build an instance of the fabric ca services client based on
      // the information in the network configuration
      const caClient = buildCAClient(FabricCAServices, ccp, 'ca.laboratory.healthvault.com');
  
      // setup the wallet to hold the credentials of the application user
      const wallet = await buildWallet(Wallets, walletPath);
      key = "LaboratoryAdmin"
      value = "laboratoryadmin";
      // to be executed and only once per hospital. Which enrolls admin and creates admin in the wallet
      await enrollAdmin(caClient, wallet, msp2, LaboratoryAdmin, LaboratoryAdminPswd, key, value);
  
      console.log('msg: Successfully enrolled admin user ' + LaboratoryAdmin + ' and imported it into the wallet');
    } catch (error) {
      console.error(`Failed to enroll admin user ' + ${LaboratoryAdmin} + : ${error}`);
      process.exit(1);
    }
  }; 

  exports.enrollPharmacyAdmin = async function() {
    try {
      // build an in memory object with the network configuration (also known as a connection profile)
      const ccp = buildCCPLaboratory();
  
      // build an instance of the fabric ca services client based on
      // the information in the network configuration
      const caClient = buildCAClient(FabricCAServices, ccp, 'ca.pharmacy.healthvault.com');
  
      // setup the wallet to hold the credentials of the application user
      const wallet = await buildWallet(Wallets, walletPath);
      key = "PharmacyAdmin"
      value = "pharmacyadmin";
      // to be executed and only once per hospital. Which enrolls admin and creates admin in the wallet
      await enrollAdmin(caClient, wallet, msp4, PharmacyAdmin, PharmacyAdminPswd, key, value);
  
      console.log('msg: Successfully enrolled admin user ' + PharmacyAdmin + ' and imported it into the wallet');
    } catch (error) {
      console.error(`Failed to enroll admin user ' + ${PharmacyAdmin} + : ${error}`);
      process.exit(1);
    }
  };

  exports.enrollInsuranceAdmin = async function() {
    try {
      // build an in memory object with the network configuration (also known as a connection profile)
      const ccp = buildCCPharmacy();
  
      // build an instance of the fabric ca services client based on
      // the information in the network configuration
      const caClient = buildCAClient(FabricCAServices, ccp, 'ca.insurance.healthvault.com');
  
      // setup the wallet to hold the credentials of the application user
      const wallet = await buildWallet(Wallets, walletPath);
      key = "InsuranceAdmin"
      value = "insuranceadmin";
      // to be executed and only once per hospital. Which enrolls admin and creates admin in the wallet
      await enrollAdmin(caClient, wallet, msp3, InsuranceAdmin, InsuranceAdminPswd, key, value);
  
      console.log('msg: Successfully enrolled admin user ' + InsuranceAdmin + ' and imported it into the wallet');
    } catch (error) {
      console.error(`Failed to enroll admin user ' + ${InsuranceAdmin} + : ${error}`);
      process.exit(1);
    }
  };

  