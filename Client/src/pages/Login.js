import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    let navigate = useNavigate();
    const [Role, setRole] = React.useState("");
    const [Organization, setOrganization] = React.useState("");
    // const [HospName, setHospName] = React.useState("");
    const [Email, setEmail] = React.useState("");
    const [Password, setPassword] = React.useState("");
    const [ID, setID] = React.useState("");
    // let adminid = "";


    const Submit_Login_Value = async () => {
        var AdminID = "";
        var orgId = "";
        let Insurance_adminid = "";
        console.log("Its works post route  ")
        if (Organization === "Hospital") {
            AdminID = "HospitalAdmin";
            orgId = "1";
         }
         if (Organization === "") {
            AdminID = "";
            orgId = "";
         }
         // else if (HospName === "Vijaya") {
        //     AdminID = "hosp2vijayaadmin";
        //     orgId = "2";
        // } else if (HospName === "Stanley") {
        //     AdminID = "hospital3stanleyadmin";
        //     orgId = "3";
        // }
         else if (Organization === "Insurance") {
           AdminID = "InsuranceAdmin";
           orgId = "3";
        }
        else if (Organization === "Laboratory") {
            AdminID = "LaboratoryAdmin";
            orgId = "2";
        }
        else if (Organization === "Pharmacy") {
            AdminID = "PhramacyAdmin";
            orgId = "3";
        }


        console.log(Role, Organization, orgId, AdminID, Email, Password, ID, ID, ID);
        
        const fetchs = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // login_role: Role,
                // choose_org: Organization,
                // orgId: orgId,
                // AdminID: AdminID,
                // emailId: Email,
                // password: Password,
                // adminid: ID,
                // PID: ID,
                // DocID: ID,
                // Insurance_adminid: Insurance_adminid

                login_role: Role,
                choose_org: Organization,
                orgId: orgId,
                AdminID: AdminID,
                PID: ID,
                DocID: ID,
                BMID: ID,
                emailId: Email,
                password: Password,

            }),
        })
        console.log(fetchs);
        try {
            const data = await fetchs.json();
            console.log(data);
            if (data.auth === 'authenticated') {
                console.log("true");
                console.log("ajsbdjvsajdbsdkbnsakdbkbadkjb",data.accessToken);
                //how to set headers
                // const myheaders = new Headers();
                // myheaders.append("Authorization", "Bearer " + data.accessToken);

                document.cookie = `accessToken=${data.accessToken}`;
                if (Organization === "Hospital" && Role === 'admin') {
                    navigate(`/admin`);
                }
                else  if (Organization === "Insurance") {
                    navigate(`/insuranceadmin`);
                }
                else  if (Organization === "Laboratory") {
                    navigate(`/laboratoryadmin`);
                }
                else if (Organization === "Pharmacy") {
                    navigate(`/phramacyadmin`);
                }
                else
                {
                    navigate(`/${Role}`);
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }


    return (
        <>
            <section className="hero is-fullheight is-black">
                <div className="hero-body">
                    <div className='container'>
                        <div className='column is-half is-offset-3'>
                            <div className="box">
                                <div className="field">
                                    <label className="label">Email</label>
                                    <div className="control">
                                        <input className="input" type="email" placeholder="e.g. alex@example.com" onChange={(event) => setEmail(event.target.value)} />
                                    </div>
                                </div>

                                <div className="field">
                                    <label className="label">Password</label>
                                    <div className="control">
                                        <div className="">
                                            <input className="input" id="password-field" type="password" placeholder="********" onChange={(event) => setPassword(event.target.value)} />
                                            {/* <span toggle="#password-field" class="fa fa-fw fa-eye field-icon toggle-password"></span> */}
                                        </div>
                                    </div>
                                </div>

                                <div className='field'>
                                    <div className='control is-expanded'>
                                        <div className='select is-fullwidth'>
                                            <select value={Organization} onChange={(event) => {
                                                setOrganization(event.target.value)
                                            }}>
                                                <option value='' disabled>Organization</option>
                                                <option value='Hospital'>Hospital</option>
                                                <option value='Insurance'>Insurance</option>
                                                <option value='Pharmacy'>Pharmacy</option>
                                                <option value='Laboratory'>Laboratory</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                {(Organization === 'Hospital') ?
                                    (
                                        <div className='field'>
                                            <div className='control is-expanded'>
                                                <div className='select is-fullwidth'>
                                                    <select value = {Role} onChange={(event) => {
                                                        setRole(event.target.value)
                                                    }}>
                                                        <option value='' disabled >Role</option>
                                                        <option value='admin'>Admin</option>
                                                        <option value='doctor'>Doctor</option>
                                                        <option value='patient'>Patient</option>
                                                        <option value='BillManager'>Bill Manager</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ) :
                                    ''
                                }

                                {(Organization !== 'Hospital') ?
                                    (
                                        <div className='field'>
                                            <div className='control is-expanded'>
                                                <div className='select is-fullwidth'>
                                                    <select value = {Role} onChange={(event) => {
                                                        setRole(event.target.value)
                                                    }}>
                                                        <option value='' disabled >Role</option>
                                                        <option value='admin'>Admin</option>
                                                        
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ) :
                                    ''
                                }

                                <div className="field">
                                    <div className="control">
                                        <input className="input" type="text" placeholder={Role + "ID"} onChange={(event) => setID(event.target.value)} />
                                    </div>
                                </div>

                                <div className="buttons has-addons is-centered">
                                    <button className="button is-primary" style={{ width: "50%" }} onClick={Submit_Login_Value}>Sign in</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </>
    );
}

export default Login;
