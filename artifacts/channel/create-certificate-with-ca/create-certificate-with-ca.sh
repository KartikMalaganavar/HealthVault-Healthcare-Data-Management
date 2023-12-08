
#==========================================================================================================================================================


createcertificatesForHospital() {
  echo
  echo "Enroll the CA admin"
  echo
  mkdir -p ../crypto-config/peerOrganizations/hospital.healthvault.com/
  export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/

   
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca.hospital.healthvault.com --tls.certfiles ${PWD}/fabric-ca/hospital/tls-cert.pem
   

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-hospital-healthvault-com.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-hospital-healthvault-com.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-hospital-healthvault-com.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-hospital-healthvault-com.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/msp/config.yaml

  echo
  echo "Register peer0"
  echo
  fabric-ca-client register --caname ca.hospital.healthvault.com --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/hospital/tls-cert.pem

  echo
  echo "Register user"
  echo
  fabric-ca-client register --caname ca.hospital.healthvault.com --id.name user1 --id.secret user1pw --id.type client  --tls.certfiles ${PWD}/fabric-ca/hospital/tls-cert.pem 

  echo
  echo "Register the org admin"
  echo
  fabric-ca-client register --caname ca.hospital.healthvault.com --id.name hospitaladmin --id.secret hospitaladminpw --id.type admin --id.attrs "HospitalAdmin=hospitaladmin:ecert" --tls.certfiles ${PWD}/fabric-ca/hospital/tls-cert.pem

  mkdir -p ../crypto-config/peerOrganizations/hospital.healthvault.com/peers
  # "-p" -> parent directory

  # -----------------------------------------------------------------------------------
  #  Peer 0
  mkdir -p ../crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com

  echo
  echo "## Generate the peer0 msp"
  echo
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca.hospital.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com/msp --csr.hosts peer0.hospital.healthvault.com --tls.certfiles ${PWD}/fabric-ca/hospital/tls-cert.pem

  cp ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates"
  echo
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca.hospital.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com/tls --enrollment.profile tls --csr.hosts peer0.hospital.healthvault.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/hospital/tls-cert.pem

  cp ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com/tls/ca.crt
  cp ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com/tls/server.crt
  cp ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com/tls/server.key

  mkdir ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/tlsca
  cp ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/tlsca/tlsca.hospital.healthvault.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/ca
  cp ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/peers/peer0.hospital.healthvault.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/ca/ca.hospital.healthvault.com-cert.pem

  # --------------------------------------------------------------------------------------------------

  mkdir -p ../crypto-config/peerOrganizations/hospital.healthvault.com/users
  mkdir -p ../crypto-config/peerOrganizations/hospital.healthvault.com/users/User1@hospital.healthvault.com

  echo
  echo "## Generate the user msp"
  echo
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca.hospital.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/users/User1@hospital.healthvault.com/msp --tls.certfiles ${PWD}/fabric-ca/hospital/tls-cert.pem 

  mkdir -p ../crypto-config/peerOrganizations/hospital.healthvault.com/users/Admin@hospital.healthvault.com

  echo
  echo "## Generate the org admin msp"
  echo
  fabric-ca-client enroll -u https://hospitaladmin:hospitaladminpw@localhost:7054 --caname ca.hospital.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/users/Admin@hospital.healthvault.com/msp --tls.certfiles ${PWD}/fabric-ca/hospital/tls-cert.pem

  cp ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/hospital.healthvault.com/users/Admin@hospital.healthvault.com/msp/config.yaml

}
#==========================================================================================================================================================


createCertificatesForLaboratory() {
  echo
  echo "Enroll the CA admin"
  echo
  mkdir -p /../crypto-config/peerOrganizations/laboratory.healthvault.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/

   
  fabric-ca-client enroll -u https://admin:adminpw@localhost:8054 --caname ca.laboratory.healthvault.com --tls.certfiles ${PWD}/fabric-ca/laboratory/tls-cert.pem
   

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-laboratory-healthvault-com.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-laboratory-healthvault-com.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-laboratory-healthvault-com.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-laboratory-healthvault-com.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/msp/config.yaml

  echo
  echo "Register peer0"
  echo
   
  fabric-ca-client register --caname ca.laboratory.healthvault.com --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/laboratory/tls-cert.pem
   

  echo
  echo "Register user"
  echo
   
  fabric-ca-client register --caname ca.laboratory.healthvault.com --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/laboratory/tls-cert.pem
   

  echo
  echo "Register the org admin"
  echo
   
  fabric-ca-client register --caname ca.laboratory.healthvault.com --id.name laboratoryadmin --id.secret laboratoryadminpw --id.type admin --id.attrs "LaboratoryAdmin=laboratoryadmin:ecert" --tls.certfiles ${PWD}/fabric-ca/laboratory/tls-cert.pem
  

  mkdir -p ../crypto-config/peerOrganizations/laboratory.healthvault.com/peers
  mkdir -p ../crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com

  # --------------------------------------------------------------
  # Peer 0
  echo
  echo "## Generate the peer0 msp"
  echo
   
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca.laboratory.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com/msp --csr.hosts peer0.laboratory.healthvault.com --tls.certfiles ${PWD}/fabric-ca/laboratory/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca.laboratory.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com/tls --enrollment.profile tls --csr.hosts peer0.laboratory.healthvault.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/laboratory/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com/tls/ca.crt
  cp ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com/tls/server.crt
  cp ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com/tls/server.key

  mkdir ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/tlsca
  cp ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/tlsca/tlsca.laboratory.healthvault.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/ca
  cp ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/peers/peer0.laboratory.healthvault.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/ca/ca.laboratory.healthvault.com-cert.pem

  # --------------------------------------------------------------------------------
 
  mkdir -p ../crypto-config/peerOrganizations/laboratory.healthvault.com/users
  mkdir -p ../crypto-config/peerOrganizations/laboratory.healthvault.com/users/User1@laboratory.healthvault.com

  echo
  echo "## Generate the user msp"
  echo
   
  fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca.laboratory.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/users/User1@laboratory.healthvault.com/msp --tls.certfiles ${PWD}/fabric-ca/laboratory/tls-cert.pem
   

  mkdir -p ../crypto-config/peerOrganizations/laboratory.healthvault.com/users/Admin@laboratory.healthvault.com

  echo
  echo "## Generate the org admin msp"
  echo
   
  fabric-ca-client enroll -u https://laboratoryadmin:laboratoryadminpw@localhost:8054 --caname ca.laboratory.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/users/Admin@laboratory.healthvault.com/msp --tls.certfiles ${PWD}/fabric-ca/laboratory/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/laboratory.healthvault.com/users/Admin@laboratory.healthvault.com/msp/config.yaml

}
#==========================================================================================================================================================


createCertificatesForPharmacy() {
  echo
  echo "Enroll the CA admin"
  echo
  mkdir -p /../crypto-config/peerOrganizations/pharmacy.healthvault.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/

   
  fabric-ca-client enroll -u https://admin:adminpw@localhost:10054 --caname ca.pharmacy.healthvault.com --tls.certfiles ${PWD}/fabric-ca/pharmacy/tls-cert.pem
   

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-pharmacy-healthvault-com.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-pharmacy-healthvault-com.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-pharmacy-healthvault-com.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-pharmacy-healthvault-com.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/msp/config.yaml

  echo
  echo "Register peer0"
  echo
   
  fabric-ca-client register --caname ca.pharmacy.healthvault.com --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/pharmacy/tls-cert.pem
   

  echo
  echo "Register user"
  echo
   
  fabric-ca-client register --caname ca.pharmacy.healthvault.com --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/pharmacy/tls-cert.pem
   

  echo
  echo "Register the org admin"
  echo
   
  fabric-ca-client register --caname ca.pharmacy.healthvault.com --id.name pharmacyadmin --id.secret pharmacyadminpw --id.type admin --id.attrs "PharmacyAdmin=pharmacyadmin:ecert" --tls.certfiles ${PWD}/fabric-ca/pharmacy/tls-cert.pem
   

  mkdir -p ../crypto-config/peerOrganizations/pharmacy.healthvault.com/peers
  mkdir -p ../crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com

  # --------------------------------------------------------------
  # Peer 0
  echo
  echo "## Generate the peer0 msp"
  echo
   
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:10054 --caname ca.pharmacy.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com/msp --csr.hosts peer0.pharmacy.healthvault.com --tls.certfiles ${PWD}/fabric-ca/pharmacy/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:10054 --caname ca.pharmacy.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com/tls --enrollment.profile tls --csr.hosts peer0.pharmacy.healthvault.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/pharmacy/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com/tls/ca.crt
  cp ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com/tls/server.crt
  cp ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com/tls/server.key

  mkdir ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/tlsca
  cp ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/tlsca/tlsca.pharmacy.healthvault.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/ca
  cp ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/peers/peer0.pharmacy.healthvault.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/ca/ca.pharmacy.healthvault.com-cert.pem

  # --------------------------------------------------------------------------------

  mkdir -p ../crypto-config/peerOrganizations/pharmacy.healthvault.com/users
  mkdir -p ../crypto-config/peerOrganizations/pharmacy.healthvault.com/users/User1@pharmacy.healthvault.com

  echo
  echo "## Generate the user msp"
  echo
   
  fabric-ca-client enroll -u https://user1:user1pw@localhost:10054 --caname ca.pharmacy.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/users/User1@pharmacy.healthvault.com/msp --tls.certfiles ${PWD}/fabric-ca/pharmacy/tls-cert.pem
   

  mkdir -p ../crypto-config/peerOrganizations/pharmacy.healthvault.com/users/Admin@pharmacy.healthvault.com

  echo
  echo "## Generate the org admin msp"
  echo
   
  fabric-ca-client enroll -u https://pharmacyadmin:pharmacyadminpw@localhost:10054 --caname ca.pharmacy.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/users/Admin@pharmacy.healthvault.com/msp --tls.certfiles ${PWD}/fabric-ca/pharmacy/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/pharmacy.healthvault.com/users/Admin@pharmacy.healthvault.com/msp/config.yaml

}
#==========================================================================================================================================================


createCertificatesForInsurance() {
  echo
  echo "Enroll the CA admin"
  echo
  mkdir -p ../crypto-config/peerOrganizations/insurance.healthvault.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/

   
  fabric-ca-client enroll -u https://admin:adminpw@localhost:11054 --caname ca.insurance.healthvault.com --tls.certfiles ${PWD}/fabric-ca/insurance/tls-cert.pem
   

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-insurance-healthvault-com.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-insurance-healthvault-com.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-insurance-healthvault-com.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-insurance-healthvault-com.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/msp/config.yaml

  echo
  echo "Register peer0"
  echo
   
  fabric-ca-client register --caname ca.insurance.healthvault.com --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/fabric-ca/insurance/tls-cert.pem
   

  echo
  echo "Register user"
  echo
   
  fabric-ca-client register --caname ca.insurance.healthvault.com --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/fabric-ca/insurance/tls-cert.pem
   

  echo
  echo "Register the org admin"
  echo
   
  fabric-ca-client register --caname ca.insurance.healthvault.com --id.name insuranceadmin --id.secret insuranceadminpw --id.type admin --id.attrs "InsuranceAdmin=insuranceadmin:ecert" --tls.certfiles ${PWD}/fabric-ca/insurance/tls-cert.pem
   

  mkdir -p ../crypto-config/peerOrganizations/insurance.healthvault.com/peers
  mkdir -p ../crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com

  # --------------------------------------------------------------
  # Peer 0
  echo
  echo "## Generate the peer0 msp"
  echo
   
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:11054 --caname ca.insurance.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com/msp --csr.hosts peer0.insurance.healthvault.com --tls.certfiles ${PWD}/fabric-ca/insurance/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com/msp/config.yaml

  echo
  echo "## Generate the peer0-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:11054 --caname ca.insurance.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com/tls --enrollment.profile tls --csr.hosts peer0.insurance.healthvault.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/insurance/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com/tls/ca.crt
  cp ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com/tls/signcerts/* ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com/tls/server.crt
  cp ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com/tls/keystore/* ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com/tls/server.key

  mkdir ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/msp/tlscacerts/ca.crt

  mkdir ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/tlsca
  cp ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/tlsca/tlsca.insurance.healthvault.com-cert.pem

  mkdir ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/ca
  cp ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/peers/peer0.insurance.healthvault.com/msp/cacerts/* ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/ca/ca.insurance.healthvault.com-cert.pem

  # --------------------------------------------------------------------------------

  mkdir -p ../crypto-config/peerOrganizations/insurance.healthvault.com/users
  mkdir -p ../crypto-config/peerOrganizations/insurance.healthvault.com/users/User1@insurance.healthvault.com

  echo
  echo "## Generate the user msp"
  echo
   
  fabric-ca-client enroll -u https://user1:user1pw@localhost:11054 --caname ca.insurance.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/users/User1@insurance.healthvault.com/msp --tls.certfiles ${PWD}/fabric-ca/insurance/tls-cert.pem
   

  mkdir -p ../crypto-config/peerOrganizations/insurance.healthvault.com/users/Admin@insurance.healthvault.com

  echo
  echo "## Generate the org admin msp"
  echo
   
  fabric-ca-client enroll -u https://insuranceadmin:insuranceadminpw@localhost:11054 --caname ca.insurance.healthvault.com -M ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/users/Admin@insurance.healthvault.com/msp --tls.certfiles ${PWD}/fabric-ca/insurance/tls-cert.pem
   

  cp ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/msp/config.yaml ${PWD}/../crypto-config/peerOrganizations/insurance.healthvault.com/users/Admin@insurance.healthvault.com/msp/config.yaml

}
#==========================================================================================================================================================


createCretificatesForOrderer() {
  echo
  echo "Enroll the CA admin"
  echo
  mkdir -p ../crypto-config/ordererOrganizations/healthvault.com

  export FABRIC_CA_CLIENT_HOME=${PWD}/../crypto-config/ordererOrganizations/healthvault.com

   
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/../crypto-config/ordererOrganizations/healthvault.com/msp/config.yaml

  echo
  echo "Register orderer"
  echo
   
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  echo
  echo "Register orderer2"
  echo
   
  fabric-ca-client register --caname ca-orderer --id.name orderer2 --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  echo
  echo "Register orderer3"
  echo
   
  fabric-ca-client register --caname ca-orderer --id.name orderer3 --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  echo
  echo "Register the orderer admin"
  echo
   
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  mkdir -p ../crypto-config/ordererOrganizations/healthvault.com/orderers
  # mkdir -p ../crypto-config/ordererOrganizations/healthvault.com/orderers/healthvault.com

  # ---------------------------------------------------------------------------
  #  Orderer

  mkdir -p ../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com

  echo
  echo "## Generate the orderer msp"
  echo
   
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/msp --csr.hosts orderer.healthvault.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/msp/config.yaml

  echo
  echo "## Generate the orderer-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/tls --enrollment.profile tls --csr.hosts orderer.healthvault.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/tls/ca.crt
  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/tls/signcerts/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/tls/server.crt
  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/tls/keystore/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/tls/server.key

  mkdir ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/msp/tlscacerts/tlsca.healthvault.com-cert.pem

  mkdir ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/msp/tlscacerts/tlsca.healthvault.com-cert.pem

  # -----------------------------------------------------------------------
  #  Orderer 2

  mkdir -p ../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer2.healthvault.com

  echo
  echo "## Generate the orderer msp"
  echo
   
  fabric-ca-client enroll -u https://orderer2:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer2.healthvault.com/msp --csr.hosts orderer2.healthvault.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer2.healthvault.com/msp/config.yaml

  echo
  echo "## Generate the orderer-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://orderer2:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer2.healthvault.com/tls --enrollment.profile tls --csr.hosts orderer2.healthvault.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer2.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer2.healthvault.com/tls/ca.crt
  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer2.healthvault.com/tls/signcerts/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer2.healthvault.com/tls/server.crt
  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer2.healthvault.com/tls/keystore/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer2.healthvault.com/tls/server.key

  mkdir ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer2.healthvault.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer2.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer2.healthvault.com/msp/tlscacerts/tlsca.healthvault.com-cert.pem

  # mkdir ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/msp/tlscacerts
  # cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer2.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/msp/tlscacerts/tlsca.healthvault.com-cert.pem

  # ---------------------------------------------------------------------------
  #  Orderer 3
  mkdir -p ../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer3.healthvault.com

  echo
  echo "## Generate the orderer msp"
  echo
   
  fabric-ca-client enroll -u https://orderer3:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer3.healthvault.com/msp --csr.hosts orderer3.healthvault.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer3.healthvault.com/msp/config.yaml

  echo
  echo "## Generate the orderer-tls certificates"
  echo
   
  fabric-ca-client enroll -u https://orderer3:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer3.healthvault.com/tls --enrollment.profile tls --csr.hosts orderer3.healthvault.com --csr.hosts localhost --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer3.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer3.healthvault.com/tls/ca.crt
  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer3.healthvault.com/tls/signcerts/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer3.healthvault.com/tls/server.crt
  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer3.healthvault.com/tls/keystore/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer3.healthvault.com/tls/server.key

  mkdir ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer3.healthvault.com/msp/tlscacerts
  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer3.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer3.healthvault.com/msp/tlscacerts/tlsca.healthvault.com-cert.pem

  # mkdir ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/msp/tlscacerts
  # cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/orderers/orderer3.healthvault.com/tls/tlscacerts/* ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/msp/tlscacerts/tlsca.healthvault.com-cert.pem

  # ---------------------------------------------------------------------------

  mkdir -p ../crypto-config/ordererOrganizations/healthvault.com/users
  mkdir -p ../crypto-config/ordererOrganizations/healthvault.com/users/Admin@healthvault.com

  echo
  echo "## Generate the admin msp"
  echo
   
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/users/Admin@healthvault.com/msp --tls.certfiles ${PWD}/fabric-ca/ordererOrg/tls-cert.pem
   

  cp ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/msp/config.yaml ${PWD}/../crypto-config/ordererOrganizations/healthvault.com/users/Admin@healthvault.com/msp/config.yaml

}
#==========================================================================================================================================================


sudo rm -rf ../crypto-config/*
# sudo rm -rf fabric-ca/*

createcertificatesForHospital

createCertificatesForLaboratory

createCertificatesForPharmacy

createCertificatesForInsurance

createCretificatesForOrderer

