export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/msp/tlscacerts/tlsca.healthvault.com-cert.pem
export PEER0_HOSPITAL_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com/tls/ca.crt
export PEER0_LABORATORY_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com/tls/ca.crt
export PEER0_PHARMACY_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com/tls/ca.crt
export PEER0_INSURANCE_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/artifacts/channel/config/

export CHANNEL_NAME=healthvaultchannel
export PRIVATE_DATA_CONFIG=/home/kartikmm/Desktop/PatientCC/artifacts/src/chaincode/collectionDef/collectionDefinitions.json


setGlobalsForOrderer() {
    export CORE_PEER_LOCALMSPID="OrdererMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/artifacts/channel/crypto-config/ordererOrganizations.healthvault.com/orderers/orderer.healthvault.com/msp/tlscacerts/tlsca.healthvault.com-cert.pem
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/ordererOrganizations.healthvault.com/users/Admin.healthvault.com/msp

}

setGlobalsForPeer0Hospital() {
    export CORE_PEER_LOCALMSPID="HospitalMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_HOSPITAL_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/hospital.healthvault.com/users/Admin@hospital.healthvault.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

setGlobalsForHospital() {
    export CORE_PEER_LOCALMSPID="HospitalMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_HOSPITAL_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/hospital.healthvault.com/users/User1@hospital.healthvault.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

setGlobalsForPeer0Laboratory() {
    export CORE_PEER_LOCALMSPID="LaboratoryMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_LABORATORY_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/laboratory.healthvault.com/users/Admin@laboratory.healthvault.com/msp
    export CORE_PEER_ADDRESS=localhost:7052
}

setGlobalsForPeer0Pharmacy(){
    export CORE_PEER_LOCALMSPID="PharmacyMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_PHARMACY_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/pharmacy.healthvault.com/users/Admin@pharmacy.healthvault.com/msp
    export CORE_PEER_ADDRESS=localhost:7053
    
}


setGlobalsForPeer0Insurance(){
    export CORE_PEER_LOCALMSPID="InsuranceMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_INSURANCE_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/insurance.healthvault.com/users/Admin@insurance.healthvault.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
}


presetup() {
    echo Installing npm packages ...
    pushd ./artifacts/src/chaincode
/patientCC
    npm install
    popd
    echo Finished installing npm dependencies
}
# presetup

CHANNEL_NAME="healthvaultchannel"
CC_RUNTIME_LANGUAGE="node"
VERSION="1"
SEQUENCE="1"
CC_SRC_PATH="./artifacts/src/chaincode/patientCC"
CC_NAME="testcc"

packageChaincode() {
    rm -rf ${CC_NAME}.tar.gz
    setGlobalsForPeer0Hospital
    peer lifecycle chaincode package ${CC_NAME}.tar.gz \
        --path ${CC_SRC_PATH} --lang ${CC_RUNTIME_LANGUAGE} \
        --label ${CC_NAME}_${VERSION}
    echo "===================== Chaincode is packaged ===================== "
}
# packageChaincode

installChaincode() {
    setGlobalsForPeer0Hospital
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Chaincode is installed on peer0.hospital ===================== "

    setGlobalsForPeer0Laboratory
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Chaincode is installed on peer0.laboratory ===================== "

    setGlobalsForPeer0Pharmacy
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Chaincode is installed on peer0.pharmacy ===================== "

    setGlobalsForPeer0Insurance
    peer lifecycle chaincode install ${CC_NAME}.tar.gz
    echo "===================== Chaincode is installed on peer0.insurance ===================== "
}

# installChaincode

queryInstalled() {
    setGlobalsForPeer0Hospital
    peer lifecycle chaincode queryinstalled >&log.txt
    cat log.txt
    PACKAGE_ID=$(sed -n "/${CC_NAME}_${VERSION}/{s/^Package ID: //; s/, Label:.*$//; p;}" log.txt)
    echo PackageID is ${PACKAGE_ID}
    echo "===================== Query installed successful on peer0.hospital on channel ===================== "
}

# queryInstalled

# --collections-config ./artifacts/private-data/collections_config.json \
#         --signature-policy "OR('HospitalMSP.member','LaboratoryMSP.member')" \

approveForMyHospital() {
    setGlobalsForPeer0Hospital
    # set -x
    peer lifecycle chaincode approveformyorg -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.healthvault.com --tls \
        --collections-config $PRIVATE_DATA_CONFIG \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
        --init-required --package-id ${PACKAGE_ID} \
        --sequence ${SEQUENCE}
    # set +x

    echo "===================== chaincode approved from hospital ===================== "

}
# queryInstalled
# approveForMyHospital

# --signature-policy "OR ('HospitalMSP.member')"
# --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_HOSPITAL_CA --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_LABORATORY_CA
# --peerAddresses peer0.hospital.healthvault.com:7051 --tlsRootCertFiles $PEER0_HOSPITAL_CA --peerAddresses peer0.laboratory.healthvault.com:9051 --tlsRootCertFiles $PEER0_LABORATORY_CA
#--channel-config-policy Channel/Application/Admins
# --signature-policy "OR ('HospitalMSP.peer','LaboratoryMSP.peer')"

checkCommitReadyness() {
    setGlobalsForPeer0Hospital
    peer lifecycle chaincode checkcommitreadiness \
        --collections-config $PRIVATE_DATA_CONFIG \
        --channelID $CHANNEL_NAME --name ${CC_NAME} --version ${VERSION} \
        --sequence ${VERSION} --output json --init-required
    echo "===================== checking commit readyness from Hospital ===================== "
}

# checkCommitReadyness

approveForMyLaboratory() {
    setGlobalsForPeer0Laboratory

    peer lifecycle chaincode approveformyorg -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.healthvault.com --tls $CORE_PEER_TLS_ENABLED \
        --collections-config $PRIVATE_DATA_CONFIG \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} \
        --version ${VERSION} --init-required --package-id ${PACKAGE_ID} \
        --sequence ${SEQUENCE}

    echo "===================== chaincode approved from Laboratory ===================== "
}

# queryInstalled
# approveForMyLaboratory

checkCommitReadyness() {

    setGlobalsForPeer0Laboratory
    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME \
        --collections-config $PRIVATE_DATA_CONFIG \
        --peerAddresses localhost:7052 --tlsRootCertFiles $PEER0_LABORATORY_CA \
        --name ${CC_NAME} --version ${VERSION} --sequence ${VERSION} --output json --init-required
    echo "===================== checking commit readyness from laboratory ===================== "
}

# checkCommitReadyness

approveForMyPharmacy() {
    setGlobalsForPeer0Pharmacy

    peer lifecycle chaincode approveformyorg -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.healthvault.com --tls $CORE_PEER_TLS_ENABLED \
        --collections-config $PRIVATE_DATA_CONFIG \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} \
        --version ${VERSION} --init-required --package-id ${PACKAGE_ID} \
        --sequence ${SEQUENCE}

    echo "===================== chaincode approved from Pharmacy ===================== "
}

# queryInstalled
# approveForMyPharmacy

checkCommitReadyness() {

    setGlobalsForPeer0Pharmacy
    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME \
        --collections-config $PRIVATE_DATA_CONFIG \
        --peerAddresses localhost:7053 --tlsRootCertFiles $PEER0_PHARMACY_CA \
        --name ${CC_NAME} --version ${VERSION} --sequence ${VERSION} --output json --init-required
    echo "===================== checking commit readyness from Pharmacy ===================== "
}


approveForMyInsurance() {
    setGlobalsForPeer0Insurance

    peer lifecycle chaincode approveformyorg -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.healthvault.com --tls $CORE_PEER_TLS_ENABLED \
        --collections-config $PRIVATE_DATA_CONFIG \
        --cafile $ORDERER_CA --channelID $CHANNEL_NAME --name ${CC_NAME} \
        --version ${VERSION} --init-required --package-id ${PACKAGE_ID} \
        --sequence ${SEQUENCE}

    echo "===================== chaincode approved from Insurance ===================== "
}

# queryInstalled
# approveForMyInsurance

checkCommitReadyness() {

    setGlobalsForPeer0Pharmacy
    peer lifecycle chaincode checkcommitreadiness --channelID $CHANNEL_NAME \
        --collections-config $PRIVATE_DATA_CONFIG \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_INSURANCE_CA \
        --name ${CC_NAME} --version ${VERSION} --sequence ${VERSION} --output json --init-required
    echo "===================== checking commit readyness from Insurance ===================== "
}


# checkCommitReadyness

commitChaincodeDefination() {
    setGlobalsForPeer0Hospital
    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.healthvault.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        --channelID $CHANNEL_NAME --name ${CC_NAME} \
        --collections-config $PRIVATE_DATA_CONFIG \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_HOSPITAL_CA \
        --peerAddresses localhost:7052 --tlsRootCertFiles $PEER0_LABORATORY_CA \
        --peerAddresses localhost:7053 --tlsRootCertFiles $PEER0_PHARMACY_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_INSURANCE_CA \
        --version ${VERSION} --sequence ${SEQUENCE} --init-required
}

# commitChaincodeDefination

queryCommitted() {
    setGlobalsForPeer0Hospital
    peer lifecycle chaincode querycommitted --channelID $CHANNEL_NAME --name ${CC_NAME}

}

# queryCommitted

chaincodeInvokeInit() {
    setGlobalsForPeer0Hospital
    peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.healthvault.com \
        --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA \
        -C $CHANNEL_NAME -n ${CC_NAME} \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_HOSPITAL_CA \
        --peerAddresses localhost:7052 --tlsRootCertFiles $PEER0_LABORATORY_CA \
        --peerAddresses localhost:7053 --tlsRootCertFiles $PEER0_PHARMACY_CA \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_INSURANCE_CA \
        --isInit -c '{"Args":[]}'
}

# chaincodeInvokeInit

chaincodeInvoke() {
    setGlobalsForPeer0Hospital

    # Create Car
    peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.healthvault.com \
        --tls $CORE_PEER_TLS_ENABLED \
        --cafile $ORDERER_CA \
        -C $CHANNEL_NAME -n ${CC_NAME}  \
        --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_HOSPITAL_CA \
        --peerAddresses localhost:7052 --tlsRootCertFiles $PEER0_LABORATORY_CA   \
        --peerAddresses localhost:7053 --tlsRootCertFiles $PEER0_PHARMACY_CA   \
        --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_INSURANCE_CA   \
        -c '{"function": "initLedger","Args":[]}'

}

# chaincodeInvoke

# chaincodeInvokeDeleteAsset() {
#     setGlobalsForPeer0Hospital

#     peer chaincode invoke -o localhost:7050 \
#         --ordererTLSHostnameOverride orderer.healthvault.com \
#         --tls $CORE_PEER_TLS_ENABLED \
#         --cafile $ORDERER_CA \
#         -C $CHANNEL_NAME -n ${CC_NAME}  \
#         --peerAddresses localhost:7051 --tlsRootCertFiles $PEER0_HOSPITAL_CA \
#         --peerAddresses localhost:7052 --tlsRootCertFiles $PEER0_LABORATORY_CA   \
#         --peerAddresses localhost:7053 --tlsRootCertFiles $PEER0_PHARMACY_CA   \
#         --peerAddresses localhost:9051 --tlsRootCertFiles $PEER0_INSURANCE_CA   \
#         -c '{"function": "DeleteCarById","Args":["2"]}'

# }

# # chaincodeInvokeDeleteAsset

# chaincodeQuery() {
#     setGlobalsForPeer0Insurance
#     # setGlobalsForHospital
#     peer chaincode query -C $CHANNEL_NAME -n ${CC_NAME} -c '{"function": "GetCarById","Args":["1"]}'
# }

# chaincodeQuery

# Run this function if you add any new dependency in chaincode

# presetup

packageChaincode
installChaincode
queryInstalled
approveForMyHospital
checkCommitReadyness
approveForMyLaboratory
checkCommitReadyness
approveForMyPharmacy
checkCommitReadyness
approveForMyInsurance
checkCommitReadyness
commitChaincodeDefination
queryCommitted
chaincodeInvokeInit
sleep 5
chaincodeInvoke
# sleep 3
# chaincodeQuery
