const express = require("express");
const app = express();
const port = 3000;
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const multer = require('multer');


const adminRoutes = require('./controllers/src/admin-routes.js');
const doctorRoutes = require('./controllers/src/doctor-routes.js');
const patientRoutes = require('./controllers/src/patient-routes.js');
const BMRoutes = require('./controllers/src/BillManager-routes.js');
const insuranceadminRoutes = require('./controllers/src/insuranceadmin-routes.js');
const LabadminRoutes = require('./controllers/src/Labadmin-routes.js');
const pharmaadminRoutes = require('./controllers/src/pharmaadmin-routes.js');

const auth = require('./controllers/Utils/login.js');

async function main() {

    app.use(cors())
    app.use(express.json())
    app.options('*', cors());  
    app.use(express.urlencoded ({
    extended: false
    }));
    app.use(cookieParser())

    app.get('/authentication',async (req, res) => {
        //how to access cookie in express
        
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader && authHeader.split(' ')[1]
        console.log("32 /authentication route accessToken",accessToken);
        if(accessToken == null) return res.sendStatus(401);
        jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
            if(err) {
                console.log("37 /authentication route err",err);
                return res.sendStatus(403);
            }else{
                console.log("40 /authentication route user",user);
                return res.json(user);
            }
        });
    });


    const authentication = async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        console.log("auth 43",token);
        if (token == null) {
            console.log("auth 45",token);
            return res.sendStatus(401)
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            console.log("entered jwt verify");
            if (err){
                console.log("auth 50",err);
                return res.sendStatus(403)
            }
            req.user = user
            next()
        })
    }

    
    app.post('/login',async (req,res) => {

        const{login_role,choose_org,orgId,AdminID,Insurance_adminid,PID,BMID,DocID,adminid,emailId,password} = req.body
        let isLoggedIn=false;
        if(choose_org === 'Hospital')
            switch (login_role){
                case 'admin':
                    const authentication_admin = auth.adminLogin(res,req,choose_org,orgId,AdminID/*,adminid*/,emailId,password);
                    // console.log(authentication_admin);
                    isLoggedIn = authentication_admin;
                    console.log(isLoggedIn);
                    break;

                case 'doctor':
                    const authentication_doctor = auth.doctorLogin(res,req,choose_org,orgId,DocID,emailId,password);
                    isLoggedIn = authentication_doctor;
                    break;   
                    
                case 'patient':
                    const authentication_patient = auth.patientLogin(res,req,choose_org,orgId,PID,emailId,password);
                    isLoggedIn = authentication_patient;
                    break;

                case 'BillManager':
                    const authentication_BM = auth.BillManagerLogin(res,req,choose_org,orgId,BMID,emailId,password);
                    isLoggedIn = authentication_BM;
                    break;

        }else if(choose_org === 'Laboratory')
        {
            switch (login_role){
                case 'admin':
                    const authentication_admin = auth.LabAdminLogin(res,req,choose_org,orgId,AdminID/*,adminid*/,emailId,password);
                    // console.log(authentication_admin);
                    isLoggedIn = authentication_admin;
                    //console.log(isLoggedIn);
                    break;
        }
    }
        else if(choose_org === 'Insurance')
        {
            switch (login_role){
                case 'admin':
                    const authentication_admin = auth.InsuranceAdminLogin(res,req,choose_org,orgId,AdminID/*,adminid*/,emailId,password);
                    // console.log(authentication_admin);
                    isLoggedIn = authentication_admin;
                    //console.log(isLoggedIn);
                    break;
            
        }}
        else if(choose_org === 'Pharmacy')
        {
            switch (login_role){
                case 'admin':
                    const authentication_admin = auth.PharmaAdminLogin(res,req,choose_org,orgId,AdminID/*,adminid*/,emailId,password);
                    // console.log(authentication_admin);
                    isLoggedIn = authentication_admin;
                    //console.log(isLoggedIn);
                    break;
            
        }}
        
        else{
            console.log("------------------jhgjhgcdjgced--------------------");

            //Insurance login
            // const authentication_Insurance_admin = auth.InsuranceAdminLogin(req,res,choose_org,adminid,Insurance_adminid,emailId,password);
            // isLoggedIn = authentication_Insurance_admin;
        }        
        return isLoggedIn;
    })

     
    app.post('/admin/register', (req,res) => {
    
    const register = req.body.register;
    const org = req.body.org;
    const orgId = req.body.orgId;
    const AdminID = req.body.AdminID;
    
    console.log("Its works post route  ")
    console.log(register)
    console.log(orgId,AdminID);
    if(register === "doctor"){
         adminRoutes.createDoctor(req,res,org,orgId,AdminID)
        console.log("Doctor is Created")
     }else if(register === "patient"){
         adminRoutes.createPatient(req,res,org,orgId,AdminID)
        console.log("Patient is Created")
     }else if(register === "BillManager"){
        adminRoutes.createBillManager(req,res,org,orgId,AdminID)
       console.log("Bill Manager is Created")
    }else{
        console.log("nothing is created")
    }
    });

    app.post('/admin',authentication,(req,res) =>{
        const deleteRecord = req.body.delete;
        // const org = req.body.org;
        // const hospid = req.body.hospid;
        // const AdminID = req.body.AdminID;

        // console.log(req.body);

        const org = req.user.choose_org;
        const orgId = req.user.orgId;
        const AdminID = req.user.ID;

        console.log(req.user);

        if(deleteRecord === "deleteDoctor"){
            adminRoutes.deleteDoctor(req,res,org,orgId,AdminID);
        }else if(deleteRecord == "deletePatient"){
            adminRoutes.deletePatient(req,res,org,orgId,AdminID);
        }else if(deleteRecord == "deleteBillManager"){
            adminRoutes.deleteBillManager(req,res,org,orgId,AdminID);
        }else{
            res.status(300).send("Wrong input");
        }
    })

    

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './upload/');
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + '-' + file.originalname);
        }
      });
      
      // Create an instance of the multer middleware with the defined storage settings
      const upload = multer({ storage: storage });
      
      


    app.post('/labadmin', authentication, upload.single('image'), (req,res) =>{
        // console.log(req.file);
        const func = req.body.fun_name;
        // const org = req.body.org;
        // const hospid = req.body.hospid;
        // const AdminID = req.body.AdminID;

        // console.log(req.body);

        const org = req.user.choose_org;
        const orgId = req.user.orgId;
        const AdminID = req.user.ID;

        console.log(req.body);

        if(func === "Labadmin_createReport"){
            LabadminRoutes.createReport(req,res,org,orgId,AdminID);
        }/*else if(func === "LabAdmin_readLabReq"){
            LabadminRoutes.LabAdmin_readLabReq(req,res,org,orgId,AdminID);
        }else if(func == "deleteBillManager"){
            adminRoutes.deleteBillManager(req,res,org,orgId,AdminID);
        }*/else{
            res.status(300).send("Wrong input");
        }
    })
    

    app.get('/labadmin/queries',authentication,(req,res) =>{
        const func = req.body.fun_name;
        // const org = req.body.org;
        // const hospid = req.body.hospid;
        // const AdminID = req.body.AdminID;

        // console.log(req.body);

        const org = req.user.choose_org;
        const orgId = req.user.orgId;
        const AdminID = req.user.ID;

        console.log(req.user);

        if(func === "LabAdmin_readLabReq"){
            LabadminRoutes.LabAdmin_readLabReq(req,res,org,orgId,AdminID);
        }/*else if(func === "LabAdmin_readLabReq"){
            LabadminRoutes.LabAdmin_readLabReq(req,res,org,orgId,AdminID);
        }else if(func == "deleteBillManager"){
            adminRoutes.deleteBillManager(req,res,org,orgId,AdminID);
        }*/else{
            res.status(300).send("Wrong input");
        }
    })

    app.get('/pharmaadmin',authentication,(req,res) =>{
        const func = req.body.fun_name;
        // const org = req.body.org;
        // const hospid = req.body.hospid;
        // const AdminID = req.body.AdminID;

        // console.log(req.body);

        const org = req.user.choose_org;
        const orgId = req.user.orgId;
        const AdminID = req.user.ID;

        console.log(req.user);

        if(func === "PharmaAdmin_readPatientPrescription"){
            pharmaadminRoutes.PharmaAdminQuery(req,res,org,orgId,AdminID);
        }/*else if(func === "LabAdmin_readLabReq"){
            LabadminRoutes.LabAdmin_readLabReq(req,res,org,orgId,AdminID);
        }else if(func == "deleteBillManager"){
            adminRoutes.deleteBillManager(req,res,org,orgId,AdminID);
        }*/else{
            res.status(300).send("Wrong input");
        }
    })


    app.get('/insuranceadmin',authentication,(req,res) =>{
        const func = req.body.fun_name;
        // const org = req.body.org;
        // const hospid = req.body.hospid;
        // const AdminID = req.body.AdminID;

        // console.log(req.body);

        const org = req.user.choose_org;
        const orgId = req.user.orgId;
        const AdminID = req.user.ID;

        console.log(req.user);

        if(func === "Insurance_ReadHospitalBill"){
            insuranceadminRoutes.InsuranceAdminQuery(req,res,org,orgId,AdminID);
        }/*else if(func === "LabAdmin_readLabReq"){
            LabadminRoutes.LabAdmin_readLabReq(req,res,org,orgId,AdminID);
        }else if(func == "deleteBillManager"){
            adminRoutes.deleteBillManager(req,res,org,orgId,AdminID);
        }*/else{
            res.status(300).send("Wrong input");
        }
    })


    app.get('/admin/queries',authentication,(req,res) => {
        //how to get the return value from middleware
        console.log("req.user",req.user);
        
        console.log("choose_org",req.user.choose_org);
        console.log("orgId",req.user.orgId);
        console.log("AdminID",req.user.ID);
        const org = req.user.choose_org;
        const orgId = req.user.orgId;
        const AdminID = req.user.ID;
        // const org = req.body.org;
        // const hospid = req.body.hospid;
        // const AdminID = req.body.AdminID;
        const result = adminRoutes.Admin_query(req,res,org,orgId,AdminID)
        console.log("Queried result:",result);
    })


    app.post('/doctor', (req,res) => {
        const org = req.body.org;
        const orgId = req.body.orgId;
        const DocID = req.body.DocID;
        const result = doctorRoutes.Doctor_submit_transcations(req,res,org,orgId,DocID);
        console.log("Submitted result:",result);
    })

    app.get('/doctor/queries',authentication,(req,res) => {
        console.log("req.user",req.user);
        
        console.log("choose_org",req.user.choose_org);
        console.log("hospid",req.user.orgId);
        console.log("AdminID",req.user.ID);
        const org = req.user.choose_org;
        const orgId = req.user.orgId;
        const connectID = req.user.ID;

        // const org = req.body.org;
        // const hospid = req.body.hospid;
        // const AdminID = req.body.AdminID;
        const result = doctorRoutes.Doctor_query(req,res,org,orgId,connectID)
        console.log("Queried result:",result);
    })

    app.post('/patient',(req,res) =>{
        const org = req.body.org;
        const orgId = req.body.orgId;
        const connectID = req.body.patientId;
        const result = patientRoutes.Patient_Submit_transcations(req,res,org,orgId,connectID)
        console.log("Queried result:",result);
    })

    app.get('/patient/queries',authentication,(req,res) =>{
        console.log("req.user",req.user);
        
        console.log("choose_org",req.user.choose_org);
        console.log("orgId",req.user.orgId);
        console.log("PID",req.user.ID);
        const org = req.user.choose_org;
        const orgId = req.user.orgId;
        const connectID = req.user.ID;

        // const org = req.body.org;
        // const hospid = req.body.hospid;
        // const AdminID = req.body.AdminID;
        const result = patientRoutes.Patient_query(req,res,org,orgId,connectID)
        console.log("Queried result:",result);
    })

    app.post('/billmanager',(req,res) =>{
        const org = req.body.org;
        const orgId = req.body.orgId;
        const connectID = req.body.BMID;
        const result = BMRoutes.BillManager_submit_transcations(req,res,org,orgId,connectID)
        console.log("Queried result:",result);
    })

    app.post('/billmanager/queries',(req,res) =>{
        const org = req.body.org;
        const orgId = req.body.orgId;
        const connectID = req.body.BMID;
        const result = BMRoutes.BillManager_submit_transcations(req,res,org,orgId,connectID)
        console.log("Queried result:",result);
    })


    app.listen(port, () => {
        console.log("Server is listening")
    })
}


main();
