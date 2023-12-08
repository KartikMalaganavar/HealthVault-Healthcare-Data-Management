import React, {useState} from "react";
import{Routes,Route}  from "react-router-dom";

import './App.css';
import 'bulma/css/bulma.min.css';

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/Components/Dashboards/AdminDashboard";
import PatientDashboard from "./pages/Components/Dashboards/PatientDashboard";
import DoctorDashboard from "./pages/Components/Dashboards/DoctorDashboard";
import BMDashboard from "./pages/Components/Dashboards/BillManagerDashboard";
import InsuranceDashboard from "./pages/Components/Dashboards/InsuranceAdminDashboard";
import LaboratoryDashboard from "./pages/Components/Dashboards/LabadminDashboard";
import PharmacyDashboard from "./pages/Components/Dashboards/PharmaAdminDashboard";

import CreatePatient from "./pages/Components/CreatePatient";
import CreateDoctor from "./pages/Components/CreateDoctor";
import Navbar from "./pages/Components/navbar";
import ViewPatient from "./pages/Components/ViewPatient";
import ViewDoctor from "./pages/Components/ViewDoctor";
import UpdatePatients from "./pages/Components/Patient/UpdatePatient";
import UpdateDoctors from "./pages/Components/Doctor/UpdateDoctor";
import UpdatePatientPassword from "./pages/Components/Patient/UpdatePatientPassword";
import GrantAccessToDoctor from "./pages/Components/Patient/GrantAccessToDoctor";
import RevokeAccessToDoctor from "./pages/Components/Patient/RevokeAccessToDoctor";
import UpdatePatient_medic from "./pages/Components/Doctor/UpdatePatient_medic";
import DeletePatient from "./pages/Components/DeletePatient";
import DeleteDoctor from "./pages/Components/DeleteDoctor";
import PageNotFound from "./pages/Components/PageNotFound";
import WithNav from "./pages/WithNav";
import WithoutNav from "./pages/WithoutNav";

import ViewPatientBill from "./pages/Components/Insurance/ViewPatient";
import ViewLabReq from "./pages/Components/laboratory/labreq.js";
import ViewReport from "./pages/Components/laboratory/CreatePatientReport";

import ViewPrescription from "./pages/Components/pharmacy/viewPatientPrescription";
import DoctorViewPatient from "./pages/Components/Doctor/ViewPatientDetails"

import AboutPage from "./pages/Components/aboutPage"

function App(){

  return (
    <div className="App">
      <Routes>
        <Route element={<WithoutNav />}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/about" element={<AboutPage/>} component={<AboutPage/>}/>
          <Route path="*" element={<PageNotFound/>}/>

        </Route>
        <Route element={<WithNav />}>
          <Route path="/login" element={<Login/>}/>
          <Route path="/admin" element={<AdminDashboard/>}/>
          <Route path="/patient" element={<PatientDashboard/>}/>
          <Route path="/doctor" element={<DoctorDashboard/>}/>
          <Route path="/BillManager" element={<BMDashboard/>}/>

          <Route path="/insuranceadmin/patient" element={<ViewPatientBill/>}/>
          
          <Route path="/laboratoryadmin/patient/report" element={<ViewReport/>}/>
          <Route path="/laboratoryadmin/patient/labreq" element={<ViewLabReq/>}/>

          <Route path="/pharmaadmin/patient/prescription" element={<ViewPrescription/>}/>
          
          <Route path="/insuranceadmin" element={<InsuranceDashboard/>}/>
          <Route path="/laboratoryadmin" element={<LaboratoryDashboard/>}/>
          <Route path="/phramacyadmin" element={<PharmacyDashboard/>}/>
          
          <Route path="/admin/createDoctor" element={<CreateDoctor/>}/>
          <Route path="/admin/viewDoctor" element={<ViewDoctor/>}/>
          <Route path="/admin/deleteDoctor" element={<DeleteDoctor/>}/>
          
          <Route path="/admin/createPatient" element={<CreatePatient/>}/>
          <Route path="/admin/viewPatient" element={<ViewPatient/>}/>
          <Route path="/admin/deletePatient" element={<DeletePatient/>}/>
          <Route path="/patient/updateDetails" element={<UpdatePatients/>}/>
          <Route path="/patient/updatePassword" element={<UpdatePatientPassword/>}/>
          
          <Route path="/patient/grantAccessToDoctor" element={<GrantAccessToDoctor/>}/>
          <Route path="/patient/revokeAccessToDoctor" element={<RevokeAccessToDoctor/>}/>
          <Route path="/doctor/updateDetails" element={<UpdateDoctors/>}/>
          <Route path="/doctor/updatePatient_medicalDetails" element={<UpdatePatient_medic/>}/>
          <Route path="/doctor/viewPatient" element={<DoctorViewPatient/>}/>
        </Route>
      </Routes>

    </div>
  );
}

export default App;
