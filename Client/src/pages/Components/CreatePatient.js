import React from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from 'jwt-decode';



// function BillManagerDashboard() {
//     const [BM_details, setBM_details] = React.useState([]);
  
//     useEffect(() => {
//       Auth();
      
//       const fetch_BM_details = async () => {
//         //how to access cookie
//         const cookie = document.cookie;
//         const jwt = cookie.split("=")[1];
  
//         console.log("accessToken", jwt);
  
//         const fetchs = await fetch("http://localhost:3000/admin/queries", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + jwt,
//             query: "BillManager_readBM",
            
//           },
//         });
//         try {
//           //get data from the response and store in the usestate
//           const data = await fetchs.json();
//           console.log(data);
//           const datas = JSON.parse(data);
//           //console.log(datas);
//           setBM_details(datas);
  
//         } catch (error) {
//           console.log(error);
//         }
//       };
//       // getplayload();
//       fetch_BM_details();
//     }, []);






function CreatePatient() {

    const [status, setStatus] = React.useState(false);


    const cookie = document.cookie;
    const jwt = cookie.split("=")[1];

    const decodedToken = jwt_decode(jwt);
    // console.log(decodedToken);

    let navigate = useNavigate();
    const [formData, setFormData] = React.useState({
    patientId : '',
    emailId : '' ,
    firstname : '',
    lastname : '',
    password : '',
    address : '',
    gender : '',
    phoneNo : '',
    emergencyContactNo : '',
    age : '',
    dob : '',
      });


    const handleSubmit = async () => {
        console.log(formData);
        const fetchs = await fetch("http://localhost:3000/admin/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + jwt,
            },
            body: JSON.stringify({
               
                register : "patient",
                org : decodedToken.choose_org,
                orgId : decodedToken.orgId,
                AdminID : decodedToken.ID,
                patientId : formData.patientId,
                firstname : formData.firstname,
                lastname : formData.lastname,
                dob : formData.dob,
                age : formData.age,
                gender : formData.gender,
                address : formData.address,
                phoneNo : formData.phoneNo,
                emailId : formData.emailId,
                password : formData.password,
                emergencyContactNo : formData.emergencyContactNo

            }),
        })
        console.log(fetchs);
        try {
            const data = await fetchs.json();
            console.log(data);
            console.log(data.executed);
            if (data.executed === "successful") {
                console.log("true");
                console.log("Status : ",data.result);
                setStatus(true);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
    // const handleSubmit = () => {
    //     // Perform form submission logic using formData
    //     console.log(formData);
    // };


    return (
        <section className='hero has-background-white-bis is-fullheight-with-navbar'>
            <div className='hero-body'>
                <div className='container'>
                    <div className='columns'>
                        <div className='column is-half is-offset-3'>
                            <div className='card'>

                            <div>
                            {!status ? (
                                // Render the form
                                <form>
                                    <div className='card-header'>
                                        <p className='card-header-title'>Create Patient</p>
                                    </div>
                                    <div className='card-content'>
                                        <div className='field'>
                                            <label className='label'>FirstName</label>
                                            <div className='control'>
                                                <input className='input' type='text' name="firstname" value={formData.firstname} onChange={handleChange}/>
                                            </div>
                                        </div>

                                        <div className='field'>
                                            <label className='label'>LastName</label>
                                            <div className='control'>
                                                <input className='input' type='text' name="lastname" value={formData.lastname} onChange={handleChange}/>
                                            </div>
                                        </div>

                                        <div className='field'>
                                            <label className='label'>Age</label>
                                            <div className='control'>
                                                <input className='input' type='age' name="age" value={formData.age} onChange={handleChange}/>
                                            </div>
                                        </div>

                                        <div className='field'>
                                            <label className='label'>EmailId</label>    
                                                <div class="control has-icons-left">
                                                    <input type="email" placeholder="e.g abcd@gmail.com" class="input" required name="emailId" value={formData.emailId} onChange={handleChange}/>
                                                    <span class="icon is-small is-left">
                                                        <i class="fas fa-user"></i>
                                                    </span>
                                                </div>
                                        </div>

                                        <div className='field'>
                                            <label className='label'>New password</label>
                                            <p class="control has-icons-left">
                                                <input class="input" type="password" placeholder=" Password" name="password" value={formData.password} onChange={handleChange}/>
                                                <span class="icon is-small is-left">
                                                    <i class="fas fa-lock"></i>
                                                </span>
                                            </p>
                                        </div>

                                        <div className='field'>
                                            <label className='label'>PhoneNumber</label>
                                            <div className='control'>
                                                <input className='input' type='number' name="phoneNo" value={formData.phoneNo} onChange={handleChange}/>
                                            </div>
                                        </div>

                                        <div className='field'>
                                            <label className='label'>Emergency Contact no.</label>
                                            <div className='control'>
                                                <input className='input' type='number' name="emergencyContactNo" value={formData.emergencyContactNo} onChange={handleChange}/>
                                            </div>
                                        </div>

                                        <div className='field'>
                                            <label className='label'>Date of Birth</label>
                                            <div className='control'>
                                                <input className='input' type='date' name="dob" value={formData.dob} onChange={handleChange}/>
                                            </div>
                                        </div>

                                        <div className='field'>
                                        <label className='label'>Gender</label>
                                        <div className='control is-expanded'>
                                            <div className='select is-fullwidth'>
                                                <select name="gender" value={formData.gender} onChange={handleChange}>
                                                    <option value="" >Choose gender</option>
                                                    <option value="Male" >Male</option>
                                                    <option value="Female" >Female</option>
                                                    <option value="Others" >Others</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                        <div className='field'>
                                            <label className='label'>PatientId</label>
                                            <div className='control'>
                                                <input className='input' type='text' name="patientId" value={formData.patientId} onChange={handleChange}/>
                                            </div>
                                        </div>

                                        <div className='field'>
                                            <label className='label'>Address</label>
                                            <div className='control'>
                                                <input className='input' type='text' name="address" value={formData.address} onChange={handleChange} />
                                            </div>
                                        </div>

                                        {/* <div className='field'>
                                        <label className='label'>Type</label>
                                        <div className='control is-expanded'>
                                            <div className='select is-fullwidth'>
                                                <select>
                                                    <option>Disaster</option>
                                                    <option>Contest</option>
                                                    <option>Fundraising</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div> */}

                                        <div className='field'>
                                            <div className='control'>
                                                {/* <input type='submit' value='Submit' className='button is-primary is-outlined is-fullwidth' /> */}
                                                <button type="button" onClick={handleSubmit} className='button is-primary is-outlined is-fullwidth'>Submit</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            ) : (
        // Render the success page
                            <div>
                                    <h2>Form Submitted Successfully!</h2>
          {/* Success page content */}
                             </div>
      )}
    </div>















                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CreatePatient;