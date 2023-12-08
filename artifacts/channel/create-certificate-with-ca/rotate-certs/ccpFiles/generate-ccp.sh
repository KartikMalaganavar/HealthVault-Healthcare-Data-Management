#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s/\${example}/$6/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.json
}

# function yaml_ccp {
#     local PP=$(one_line_pem $4)
#     local CP=$(one_line_pem $5)
#     sed -e "s/\${ORG}/$1/" \
#         -e "s/\${P0PORT}/$2/" \
#         -e "s/\${CAPORT}/$3/" \
#         -e "s#\${PEERPEM}#$PP#" \
#         -e "s#\${CAPEM}#$CP#" \
#         organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
# }

example=healthvault
ORG=Hospital
P0PORT=7051
CAPORT=7054
PEERPEM=peerOrganizations/hospital.healthvault.com/tlsca/tlsca.hospital.healthvault.com-cert.pem
CAPEM=peerOrganizations/hospital.healthvault.com/ca/ca.hospital.healthvault.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $example)" > connection-hospital.json
# echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > connection-hospital.yaml

ORG=Laboratory
P0PORT=7052
CAPORT=8054
PEERPEM=peerOrganizations/laboratory.healthvault.com/tlsca/tlsca.laboratory.healthvault.com-cert.pem
CAPEM=peerOrganizations/laboratory.healthvault.com/ca/ca.laboratory.healthvault.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $example)" > connection-laboratory.json
# echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > connection-laboratory.yaml


ORG=Pharmacy
P0PORT=7053
CAPORT=10054
PEERPEM=peerOrganizations/pharmacy.healthvault.com/tlsca/tlsca.pharmacy.healthvault.com-cert.pem
CAPEM=peerOrganizations/pharmacy.healthvault.com/ca/ca.pharmacy.healthvault.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $example)" > connection-pharmacy.json
# echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > connection-pahrmacy.yaml


ORG=Insurance
P0PORT=9051
CAPORT=11054
PEERPEM=peerOrganizations/insurance.healthvault.com/tlsca/tlsca.insurance.healthvault.com-cert.pem
CAPEM=peerOrganizations/insurance.healthvault.com/ca/ca.insurance.healthvault.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM $example)" > connection-insurance.json
# echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > connection-insurance.yaml
