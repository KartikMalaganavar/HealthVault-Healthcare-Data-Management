
# Delete existing artifacts
rm genesis.block mychannel.tx
rm -rf ../../channel-artifacts/*

#Generate Crypto artifactes for organizations
# cryptogen generate --config=./crypto-config.yaml --output=./crypto-config/



# System channel
SYS_CHANNEL="sys-channel"

# channel name defaults to "mychannel"
CHANNEL_NAME="healthvaultchannel"

echo $CHANNEL_NAME

# Generate System Genesis block
configtxgen -profile OrdererGenesis -configPath . -channelID $SYS_CHANNEL  -outputBlock ./genesis.block


# Generate channel configuration block
configtxgen -profile BasicChannel -configPath . -outputCreateChannelTx ./$CHANNEL_NAME.tx -channelID $CHANNEL_NAME

echo "#######    Generating anchor peer update for HospitalMSP  ##########"
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./HospitalMSPanchors.tx -channelID $CHANNEL_NAME -asOrg HospitalMSP

echo "#######    Generating anchor peer update for LaboratoryMSP  ##########"
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./LaboratoryMSPanchors.tx -channelID $CHANNEL_NAME -asOrg LaboratoryMSP

echo "#######    Generating anchor peer update for PharmacyMSP  ##########"
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./PharmacyMSPanchors.tx -channelID $CHANNEL_NAME -asOrg PharmacyMSP


echo "#######    Generating anchor peer update for InsuranceMSP  ##########"
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./InsuranceMSPanchors.tx -channelID $CHANNEL_NAME -asOrg InsuranceMSP