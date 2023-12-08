const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const fs = require("fs");
const { buildCAClient, registerAndEnrollUser } = require("./CaUtils.js");
const {
  buildCCPHospital,
  buildCCPInsurance,
  buildCCPLaboratory,
  buildCCPharmacy,
  buildWallet,
} = require("./Utils.js");

const channelName = "healthvaultchannel";
const chaincodeName = "testcc";
const mspOrg1 = "HospitalMSP";
const mspOrg2 = "LaboratoryMSP";
const mspOrg3 = "PharmacyMSP";
const mspOrg4 = "InsuranceMSP";
const walletPath = path.join(__dirname, "../wallet");

exports.ccpPath = async (req, res, org) => {
  if (org == "Hospital") {
    // if(hospitalId == 1){
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "artifacts",
      "channel",
      "ccpFiles",
      "connection-hospital.json"
    );
    return ccpPath;
  } else if (org == "Laboratory") {
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "artifacts",
      "channel",
      "ccpFiles",
      "connection-laboratory.json"
    );
    return ccpPath;
  } else if (org == "Pharmacy") {
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "artifacts",
      "channel",
      "ccpFiles",
      "connection-pharmacy.json"
    );
    return ccpPath;
  } else if (org == "Insurance") {
    const ccpPath = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "artifacts",
      "channel",
      "ccpFiles",
      "connection-insurance.json"
    );
    return ccpPath;
  } else {
    console.log("Error in connecting to network", 37);
    res.status(400).json("Unable to connect to network");
  }
};

exports.connectToNetwork = async function (
  req,
  res,
  org,
  orgId,
  DocID_PID_AdminID
) {
  const gateway = new Gateway();
  const orgId1 = parseInt(orgId);
  const ccpPath = await exports.ccpPath(req, res, org);

  const fileExists = fs.existsSync(ccpPath);
  if (!fileExists) {
    throw new Error(`no such file or directory: ${ccpPath}`);
  }
  try {
    const contents = fs.readFileSync(ccpPath, "utf8");

    // build a JSON object from the file contents
    const ccp = JSON.parse(contents);

    console.log(`Loaded the network configuration located at ${ccpPath}`);
    /*
          let walletPath;

          switch (org) {
            case "Hospital":            
                walletPath = path.join(process.cwd(), 'controllers/hospital-wallet');
                break;
            case "Laboratory":            
                walletPath = path.join(process.cwd(), 'controllers/laboratory-wallet');
                break;
            case "Insurance":             
                walletPath = path.join(process.cwd(), 'controllers/insurance-wallet');
                break;
            case "Pharmacy":             
                walletPath = path.join(process.cwd(), 'controllers/pharmacy-wallet');
                break;
            default:
                break;
        }
*/
    const walletPath = path.join(process.cwd(), "controllers/wallet");
    console.log("WALLET CHECKING");

    const wallet = await buildWallet(Wallets, walletPath);

    console.log(wallet);

    const userExists = await wallet.get(DocID_PID_AdminID);

    console.log(userExists);

    if (!userExists) {
      console.log(
        `An identity for the : ${DocID_PID_AdminID} does not exist in the wallet`
      );
      console.log(`Create the ${DocID_PID_AdminID} before retrying`);
      const response = {};
      response.error = `An identity for the user ${DocID_PID_AdminID} does not exist in the wallet. Register ${DocID_PID_AdminID} first`;
      return response;
    }

    await gateway.connect(ccp, {
      wallet,
      identity: DocID_PID_AdminID,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Build a network instance based on the channel where the smart contract is deployed
    const network = await gateway.getNetwork(channelName);

    // Get the contract from the network.
    const contract = network.getContract(chaincodeName);

    const networkObj = {
      contract: contract,
      network: network,
      gateway: gateway,
    };
    console.log("Succesfully connected to the network.");
    return networkObj;
  } catch (error) {
    console.log("Error in connecting to network", 37);
    res.status(400).json(`${error}`);
  }
};

exports.invoke = async function (networkObj, func, Data) {
  const userData = JSON.parse(Data);
  const transaction = networkObj.contract.createTransaction(func);
  const org1peer = ["peer0.hospital.healthvault.com:7051"];

  transaction.setEndorsingPeers(org1peer);
  console.log("peers found");
  let response;

  if (userData.Id === "HospitalAdmin") {
    response = await transaction.evaluate(userData.Id);
  } else {
    response = await transaction.evaluate(
      userData.Id,
      userData.key,
      userData.value,
      userData.MSPID
    );
  }
  await networkObj.gateway.disconnect();

  if (func === 'Patient_readPatient') {
    var data = JSON.parse(response);

    const numAttributes = Object.keys(data).length;
    // console.log(numAttributes);

    if (numAttributes >= 2 && numAttributes <= 3 ) {
      const {asset1} = data;
      const {asset2} = data;

      data ={...asset1, ...asset2};

    } else {
      data = response;
    }
    const result_toString = JSON.stringify(data);
    //console.log(result_toString);
    console.log(
      // `Transaction has been evaluated, result is: ${result_toString}`
      `sransaction has been evaluated, result is: ${data}`
    );

    return data;
  }
  console.log(`Transaction has been evaluated, result is: ${response}`);

  return response;
};

exports.registerUser = async function (attributes) {
  const attrs = JSON.parse(attributes);
  const orgId = parseInt(attrs.orgId1);
  const userId = attrs.userId;
  const key = attrs.key;
  const value = attrs.value;

  console.log(orgId, userId, key, value);

  if (!userId || !orgId) {
    const response = {};
    response.error =
      "Error! You need to fill all fields before you can register!";
    return response;
  }

  try {
    const wallet = await buildWallet(Wallets, walletPath);
    // TODO: Must be handled in a config file instead of using if
    if (orgId === 1) {
      const ccp = buildCCPHospital();
      const caClient = buildCAClient(
        FabricCAServices,
        ccp,
        "ca.hospital.healthvault.com"
      ); // changes required
      //console.log(caClient, wallet, mspOrg1, userId, 'HospitalAdmin', attributes, key, value);
      await registerAndEnrollUser(
        caClient,
        wallet,
        mspOrg1,
        userId,
        "HospitalAdmin",
        attributes
      );
    } else if (orgId === 2) {
      const ccp = buildCCPLaboratory();
      const caClient = buildCAClient(
        FabricCAServices,
        ccp,
        "ca.laboratory.healthvault.com"
      ); // changes required
      await registerAndEnrollUser(
        caClient,
        wallet,
        mspOrg2,
        userId,
        "LaboratoryAdmin",
        attributes
      );
    } else if (orgId === 3) {
      const ccp = buildCCPharmacy();
      const caClient = buildCAClient(
        FabricCAServices,
        ccp,
        "ca.pharmacy.healthvault.com"
      ); // changes required
      await registerAndEnrollUser(
        caClient,
        wallet,
        mspOrg3,
        userId,
        "PharmacyAdmin",
        attributes
      );
    } else if (orgId === 4) {
      const ccp = buildCCPInsurance();
      const caClient = buildCAClient(
        FabricCAServices,
        ccp,
        "ca.insurance.healthvault.com"
      ); // changes required
      await registerAndEnrollUser(
        caClient,
        wallet,
        mspOrg4,
        userId,
        "InsuranceAdmin",
        attributes
      );
    }

    console.log(`Successfully registered user: + ${userId}`);
    const response = "Successfully registered user: " + userId;
    return response;
  } catch (error) {
    console.error(`Failed to register user + ${userId} + : ${error}`);
    const response = {};
    response.error = error;
    return response;
  }
};
