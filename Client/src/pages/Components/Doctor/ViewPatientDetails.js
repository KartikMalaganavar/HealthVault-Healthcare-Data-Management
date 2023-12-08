import React, { useEffect } from "react";
import Auth from "../Auth";

function ViewPatient() {
    const [query, setquery] = React.useState("Patient-ID");

    useEffect(async() => {
        Auth();
    }, []);

    const queryfucntion = (query) => {
        if (query === "Patient-ID") {
            document.getElementById("Patient-ID").className = "is-active";
            document.getElementById("Patient-Report").className = "a";
            document.getElementById("Patient-Med-Prescription").className = "a";
            document.getElementById("Patient-Lab-Requisition").className = "a";
            setquery("Patient-ID");

        } else if (query === "Patient-Report") {
            document.getElementById("Patient-ID").className = "a";
            document.getElementById("Patient-Report").className = "is-active";
            document.getElementById("Patient-Med-Prescription").className = "a";
            document.getElementById("Patient-Lab-Requisition").className = "a";
            setquery("Patient-Report");

        } else if (query === "Patient-Med-Prescription") {
            document.getElementById("Patient-ID").className = "a";
            document.getElementById("Patient-Report").className = "a";
            document.getElementById("Patient-Med-Prescription").className = "is-active";
            document.getElementById("Patient-Lab-Requisition").className = "a";
            setquery("Patient-Med-Prescription");
        }
        else if (query === "Patient-Lab-Requisition") {
            document.getElementById("Patient-ID").className = "a";
            document.getElementById("Patient-Report").className = "a";
            document.getElementById("Patient-Med-Prescription").className = "a";
            document.getElementById("Patient-Lab-Requisition").className = "is-active";
            setquery("Patient-Lab-Requisition");
    }
}

    return (
        <section className="hero is-fullheight-with-navbar">
            <div className="hero-start">
                <div className="mt-3 ml-3">
                    <div className="tabs is-boxed">
                        <ul>
                            <li className="is-active" id="Patient-ID">
                                <a onClick={() => { queryfucntion("Patient-ID") }}>
                                    <span className="icon is-small"><i className="fas fa-image" aria-hidden="true"></i></span>
                                    <span>Patient-ID</span>
                                </a>
                            </li>
                            <li id="Patient-Report">
                                <a onClick={() => { queryfucntion("Patient-Report") }}>
                                    <span className="icon is-small"><i className="fas fa-image" aria-hidden="true"></i></span>
                                    <span>Patient-Report</span>
                                </a>
                            </li>
                            <li id="Patient-Med-Prescription">
                                <a onClick={() => { queryfucntion("Patient-Med-Prescription") }}>
                                    <span className="icon is-small"><i className="fas fa-image" aria-hidden="true"></i></span>
                                    <span>Patient-Med-Prescription</span>
                                </a>
                            </li>
                            <li id="Patient-Lab-Requisition">
                                <a onClick={() => { queryfucntion("Patient-Lab-Requisition") }}>
                                    <span className="icon is-small"><i className="fas fa-image" aria-hidden="true"></i></span>
                                    <span>Patient-Lab-Requisition</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="card">
                        <div className="card-content">
                            <div className="columns is-align-items-flex-end" >
                                <div className="column is-four-fifths">
                                    <label className="label">Query by {query}</label>
                                    <input className="input is-success" type="text" placeholder={query}></input>
                                </div>
                                <div className="column">
                                    <button className="button is-info">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ViewPatient;