import { useState,useRef } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import CustomerTable from "./CustomerTable";
import Header from './Header'
import { Toast } from 'primereact/toast';

function Customer() {
    const [values, setValues] = useState({
        name: "",
        address: "",
        contactNo: ""
    })
    const toast = useRef(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!values.name) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter name' });
            return;
        }

        else if (!values.contactNo) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter contact number' });
            return;
        }
        else{
        axios.post("http://localhost:8083/addCustomer", values)
            .then(res => {
                console.log(res);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Customer added successfully' });
                setTimeout(()=>{
                    navigate("/home")
                },1000)
               
            })
            .catch(err => {
                console.log(err);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to add customer' });
                
            });
        }
    };

    const onBack=()=>{
        navigate("/home")
    }


    return (
        <>
            <Header />
            <Toast ref={toast} />
            
                <div className="p-5" style={{ background: "linear-gradient(to top, black, gray)", height: "100%" }}>
                    <h2 style={{ color: "white", textAlign: "start" }} className="pb-2 mx-5">Add Customer</h2>
                    <form className="bg-light rounded p-5 mx-5 mb-5" style={{ width: "90%", height: "50%" }} onSubmit={handleSubmit}>

                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>Name:</label>
                            </div>
                            <div class="col-7">
                                <input type="text" placeholder="Enter Name" className="form-control "
                                    onChange={e => setValues({ ...values, name: e.target.value })} />
                            </div>
                        </div>
                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>Address:</label>
                            </div>
                            <div class="col-7">
                                <input type="text" placeholder="Enter Address" className="form-control"
                                    onChange={e => setValues({ ...values, address: e.target.value })} />
                            </div>
                        </div>
                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="px-4 fw-bold" style={{ color: "navy", fontSize: '20px' }}>Contact No:</label>
                            </div>
                            <div class="col-7">
                                <input type="number" placeholder="Enter contact no" className="form-control"
                                    onChange={e => setValues({ ...values, contactNo: e.target.value })} />
                            </div>
                        </div>
                        <div className="mb-5 mt-5 d-flex justify-content-between mx-5">
                            <button type="button" onClick={onBack} class="btn btn-info btn-lg">Back</button>
                            <button type="submit" class="btn btn-primary btn-lg">ADD</button>
                        </div>
                    </form>
                    <div className="bg-light rounded p-5 mx-5" style={{ width: "90%" }}>
                        <CustomerTable />

                    </div>
                </div>


         

        </>
    );

}

export default Customer