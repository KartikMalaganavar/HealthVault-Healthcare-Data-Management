require('dotenv').config();
const network = require('./network.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const express = require('express');
const console = require('console');



let caClient
let isLoggedIn;
const app = express()
app.use(cookieParser())

function generatejwttoken(res,req,emailId,choose_org,orgId,ID,adminid,PID,DocID,Insurance_adminid){
    console.log({
        emailId : emailId,
        choose_org : choose_org,
        orgId : orgId,
        ID : ID     
    });
    let payload = {
        emailId : emailId,
        choose_org : choose_org,
        orgId : orgId,
        ID : ID
    }
    console.log(process.env.JWT_SECRET);
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '30m'},{ algorithm : 'HS256'} );
    console.log("27 login server side page accessToken",accessToken);
    // set the cookie as the token string, with a similar max age as the token
    // here, the max age is in milliseconds, so we multiply by 1000
    


    
    // localStorage.setItem('accessToken',accessToken);
    // const st =  sessionStorage.setItem("test1", "Lorem ipsum");
    // console.log("sessionStorage",st);
    
    // if(PID !== null){
    //     console.log("PID",PID);
    //     cookieset(PID);
    // }else if(DocID !== null){
    //     console.log("DocID",DocID);
    //     cookieset(DocID);
    // }else if(Insurance_adminid !== null){
    //     console.log("Insurance_adminid",Insurance_adminid);
    //     cookieset(Insurance_adminid);
    // }else if(AdminID !== null){
    //     console.log("AdminID",AdminID);
    //     cookieset(AdminID);
    // }
    
    // const cookieset = async (name) => {
    // }
    
    
    res.cookie(`accessToken`, accessToken, { maxAge: 90000000, httpOnly: true });
    console.log("cookie set successfully");
    
    // if(PID !== "" || DocID !== ""  || Insurance_adminid !== "" || AdminID !== ""){
    //     console.log(PID,DocID,Insurance_adminid,AdminID);    
    //     res.cookie(`jwt-${DocID}`, accessToken, { maxAge: 3600000 });
    //     console.log("jwt",res.cookie);
    // }

    // res.setHeader("set-cookie",[`JWT_TOKEN=${accessToken}; httponly; samesite=lax`]);
    // console.log("set-cookie",res.setHeader);
    
    return accessToken;
}

exports.auth = async(res,req,auth_check_res,password,emailId,choose_org,orgId,ID/*AdminID,adminid*/,PID,DocID,Insurance_adminid) => {
    try{
        //console.log("Kartik-----------------------------------------------");
        const result =  JSON.parse(auth_check_res);
        const mailId = result.emailId;
        const en_pass = result.password;
        const pass = crypto.createHash('sha256').update(password).digest('hex');
        const isLoggedIn = false;
        
        if((password == en_pass || pass == en_pass )&& emailId == mailId){
            accessToken = generatejwttoken(res,req,emailId,choose_org,orgId,ID/*,adminid*/);
            console.log("accessToken",accessToken);
            console.log("Authenticated");
            await res.status(200).json({
                auth : "authenticated",
                accessToken : accessToken
            });
            //does the below return statemnt work?

            return accessToken;

            
        }else{
            if(password !== en_pass){
                console.log("Error in password");
                console.log(password + " " + en_pass);
                await res.status(500).json("Check your password or Internal server error");
                return (isLoggedIn == false);
            }
            if(emailId !== mailId){
                console.log("Error in email");
                console.log(emailId + " " + mailId);
                await res.status(500).json("Check your email or Internal server error")
                return (isLoggedIn == false);
            }
            console.log("Declined");
            await res.status(500).json("Check your credentials or Internal server error")
            return (isLoggedIn == false);
        }
    }catch(error){
        //if res.status already sent to client then don't send it again
        if(res.headersSent){
            console.log(error);
            console.log("-----------------------------------------------------------------------------------------------------")
        }else{
            res.status(500).json(auth_check_res);
        }
    }
}




exports.doctorLogin = async (res,req,choose_org,orgId,DocID,emailId,password) => {
    console.log("-----------------------------------------------------------------------------------------------------------------")
    console.log(`"choose_org:${choose_org}" ,orgId:${orgId} ,DocID:${DocID} ,emailId:${emailId} ,password:${password}`);
    console.log("-----------------------------------------------------------------------------------------------------------------")
    const networkObj =  await network.connectToNetwork(req,res,choose_org,orgId,DocID); 
    
    const doctorData = JSON.stringify({ Id: DocID, key: "Doctor", value: "true", MSPID : "HospitalMSP"});
    
    const auth_check_res =  await network.invoke(networkObj,'Admin_readDoctor',doctorData);

    exports.auth(res,req,auth_check_res,password,emailId,choose_org,orgId,DocID);
    

}

exports.patientLogin = async (res,req,choose_org,orgId,PID,emailId,password) => {
    console.log("-----------------------------------------------------------------------------------------------------------------")
    console.log(`"choose_org:${choose_org}", orgId:${orgId}, PID:${PID}, emailId:${emailId} ,password:${password}`);
    console.log("-----------------------------------------------------------------------------------------------------------------")
    const networkObj =  await network.connectToNetwork(req,res,choose_org,orgId,PID);    
    
    const patiendData = JSON.stringify({ Id: PID, key: "patient", value: "true", MSPID : "HospitalMSP"});
    
    const auth_check_res =  await network.invoke(networkObj,'Patient_readPatient', patiendData);

    exports.auth(res,req,auth_check_res,password,emailId,choose_org,orgId,PID);
}

exports.BillManagerLogin = async (res,req,choose_org,orgId,BMID,emailId,password) => {
    console.log("-----------------------------------------------------------------------------------------------------------------")
    console.log(`"choose_org:${choose_org}", orgId:${orgId}, BMID:${BMID}, emailId:${emailId} ,password:${password}`);
    console.log("-----------------------------------------------------------------------------------------------------------------")
    const networkObj =  await network.connectToNetwork(req,res,choose_org,orgId,BMID);    
    
    const BMData = JSON.stringify({ Id: BMID, key: "BillManager", value: "true", MSPID : "HospitalMSP"});
    
    const auth_check_res =  await network.invoke(networkObj,'Admin_readBillManager', BMData);

    exports.auth(res,req,auth_check_res,password,emailId,choose_org,orgId,BMID);
}


// changes needed here
exports.adminLogin = async (res,req,choose_org,orgId,AdminID,emailId,password) => {
    console.log("-----------------------------------------------------------------------------------------------------------------")
    console.log(`"choose_org:${choose_org}" ,orgId:${orgId} ,AdminID:${AdminID}, emailId:${emailId}, password:${password}`);
    console.log("-----------------------------------------------------------------------------------------------------------------")
    const networkObj =  await network.connectToNetwork(req,res,choose_org,orgId,'admin');
    // const args =     
    const adminData = JSON.stringify({ Id: AdminID, key: "HospitalAdmin", value: "hospitaladmin", MSPID : "HospitalMSP"});

    const auth_check_res =  await network.invoke(networkObj,'readAdminDetails', adminData);

    exports.auth(res,req,auth_check_res,password,emailId,choose_org,orgId,AdminID);    
}


//Other logins


exports.LabAdminLogin = async (res,req,choose_org,orgId,AdminID,emailId,password) => {
    console.log("-----------------------------------------------------------------------------------------------------------------")
    console.log(`"choose_org:${choose_org}" ,orgId:${orgId} ,AdminID:${AdminID}, emailId:${emailId}, password:${password}`);
    console.log("-----------------------------------------------------------------------------------------------------------------")
    
    const emailId1 = process.env.LAB_EMAILID;
    const password1 = process.env.LAB_PSWD;
    console.log(emailId1, password1);

    const auth_check_res = JSON.stringify({ Id: AdminID, emailId : emailId1, password : password1 ,key: "LaboratoryAdmin", value: "laboratoryadmin", MSPID : "LaboratoryMSP"});

    exports.auth(res,req,auth_check_res,password,emailId,choose_org,orgId,AdminID);    
}


exports.PharmaAdminLogin = async (res,req,choose_org,orgId,AdminID,emailId,password) => {
    console.log("-----------------------------------------------------------------------------------------------------------------")
    console.log(`"choose_org:${choose_org}" ,orgId:${orgId} ,AdminID:${AdminID}, emailId:${emailId}, password:${password}`);
    console.log("-----------------------------------------------------------------------------------------------------------------")
    
    const emailId1 = process.env.PHARMA_EMAILID;
    const password1 = process.env.PHARMA_PSWD;

    const auth_check_res = JSON.stringify({ Id: AdminID, emailId : emailId1, password : password1 ,key: "PharamcyAdmin", value: "pharmacyadmin", MSPID : "PharmacyMSP"});

    exports.auth(res,req,auth_check_res,password,emailId,choose_org,orgId,AdminID);    
}


exports.InsuranceAdminLogin = async (res,req,choose_org,orgId,AdminID,emailId,password) => {
    console.log("-----------------------------------------------------------------------------------------------------------------")
    console.log(`"choose_org:${choose_org}" ,orgId:${orgId} ,AdminID:${AdminID}, emailId:${emailId}, password:${password}`);
    console.log("-----------------------------------------------------------------------------------------------------------------")
    
    const emailId1 = process.env.INSURANCE_EMAILID;
    const password1 = process.env.INSURANCE_PSWD;

    const auth_check_res = JSON.stringify({ Id: AdminID, emailId : emailId1, password : password1 ,key: "InsuranceAdmin", value: "insuranceadmin", MSPID : "InsuranceMSP"});

    exports.auth(res,req,auth_check_res,password,emailId,choose_org,orgId,AdminID);    
}








