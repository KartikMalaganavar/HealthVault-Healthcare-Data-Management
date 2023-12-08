const fs  = require('fs');
const enrollAdmin = require('./controllers/enrollAdmin.js');
const registerUser = require('./controllers/registerUser.js');
require('./controllers/createAdmin_Ids.js');
// console.log('done');

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const path = require('path');


async function main(){
    await enrollAdmin.enrollHospitalAdmin();
    // await enrollAdmin.enrollLaboratoryAdmin();
    // await enrollAdmin.enrollPharmacyAdmin();
    // await enrollAdmin.enrollInsuranceAdmin();
   
    
    console.log("All organization Admin's are registered.");
}

main();