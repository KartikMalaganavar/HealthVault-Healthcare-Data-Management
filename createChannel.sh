export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/msp/tlscacerts/tlsca.healthvault.com-cert.pem
export PEER0_HOSPITAL_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com/tls/ca.crt
export PEER0_LABORATORY_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com/tls/ca.crt
export PEER0_PHARMACY_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com/tls/ca.crt
export PEER0_INSURANCE_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/artifacts/channel/config/

export CHANNEL_NAME=healthvaultchannel

setGlobalsForPeer0Hospital(){
    export CORE_PEER_LOCALMSPID="HospitalMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_HOSPITAL_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/hospital.healthvault.com/users/Admin@hospital.healthvault.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

setGlobalsForPeer0Laboratory(){
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

createChannel(){
    rm -rf ./channel-artifacts/*
    setGlobalsForPeer0Hospital
    
    peer channel create -o localhost:7050 -c $CHANNEL_NAME \
    --ordererTLSHostnameOverride orderer.healthvault.com \
    -f ./artifacts/channel/${CHANNEL_NAME}.tx --outputBlock ./channel-artifacts/${CHANNEL_NAME}.block \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
}

removeOldCrypto(){
    rm -rf ./api-2.0/hospital-wallet/*
    rm -rf ./api-2.0/laboratory-wallet/*
    rm -rf ./api-2.0/pharmacy-wallet/*
    rm -rf ./api-2.0/insurance-wallet/*
}

joinChannel(){
    setGlobalsForPeer0Hospital
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
       
    setGlobalsForPeer0Laboratory
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
    setGlobalsForPeer0Pharmacy
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
    setGlobalsForPeer0Insurance
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
}

updateAnchorPeers(){
    setGlobalsForPeer0Hospital
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.healthvault.com -c $CHANNEL_NAME -f ./artifacts/channel/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
    
    setGlobalsForPeer0Laboratory
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.healthvault.com -c $CHANNEL_NAME -f ./artifacts/channel/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA

    setGlobalsForPeer0Pharmacy
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.healthvault.com -c $CHANNEL_NAME -f ./artifacts/channel/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
    
    setGlobalsForPeer0Insurance
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.healthvault.com -c $CHANNEL_NAME -f ./artifacts/channel/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
    
}


removeOldCrypto
createChannel
joinChannel
updateAnchorPeers