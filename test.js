
const fs = require('fs');
const path = require('path');


function generate(certPath, destPath, num) {

    const cert = fs.readFileSync(`/home/kartikmm/Desktop/PatientCC/artifacts/channel/crypto-config/peerOrganizations/${certPath}/users/Admin@${certPath}/msp/signcerts/cert.pem`, 'utf-8');
    //console.log(cert);
    const pemString1 = cert.replace(/(\r\n|\n|\r)/gm, '\n');
    
    const folderPath = `/home/kartikmm/Desktop/PatientCC/artifacts/channel/crypto-config/peerOrganizations/${certPath}/users/Admin@${certPath}/msp/keystore/`;
    
    var privateKey;

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        const textFiles = files.filter(file => file.includes('_sk'));
        
        // console.log(textFiles);



        //textFiles.forEach(file => {
            privateKey = fs.readFileSync(path.join(folderPath, textFiles[0]), 'utf8')

                // console.log(privateKey);
                const pemString2 = privateKey.replace(/(\r\n|\n|\r)/gm, '\r\n');

                const idName = ['HospitalAdmin', 'InsuranceAdmin', 'LaboratoryAdmin', 'PharmacyAdmin'];
                const msps = ['HospitalMSP', 'InsuranceMSP', 'LaboratoryMSP', 'PharmacyMSP'];

                const jsonObject = {
                    credentials: {
                        certificate: pemString1,
                        privateKey: pemString2
                    },
                    mspId: `${msps[num]}`,
                    type: 'X.509',
                    version: 1
                };

                const jsonString = JSON.stringify(jsonObject);

                console.log()
                console.log(jsonString);

                fs.writeFileSync(`${destPath}/${idName[num]}.id`, jsonString, 'utf-8');
       
    });
}

const certificatePath = ['hospital.healthvault.com', 'insurance.healthvault.com', 'laboratory.healthvault.com', 'pharmacy.healthvault.com'];
const dstPath = '/home/kartikmm/Desktop/PatientCC/Server/controllers/wallet/';



for (let index = 0; index < 4; index++) {
    generate(certificatePath[index], dstPath, index);    
}





