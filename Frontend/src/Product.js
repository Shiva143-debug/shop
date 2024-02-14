import { useState,useRef } from "react"
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ProductTable from "./ProductTable";
import Header from './Header'
import "./Home.css"
import { Toast } from 'primereact/toast';

function Product() {
    const [values, setValues] = useState({
        productName: "",
        price: "",
        quantity:"",
        mfd: ""
    })
    const navigate = useNavigate();
    const toast = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!values.productName) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please enter productName' });
            return;
        }

        else if (!values.price) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please enter price' });
            return;
        }

        else if (!values.quantity) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Please enter quantity' });
            return;
        }
        axios.post("http://localhost:8083/addproduct", values)
            .then(res => {
                console.log(res);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Customer added successfully' });
                navigate("/home");
            })
            .catch(err => {
                console.log(err);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to add customer' });
                
            });
    };



    const onBack=()=>{
        navigate("/home")
    }


    return (
        <>
            <Header />
            <Toast ref={toast} />
            <div className="d-flex flex-column justify-content-center align-items-center vw-100 bg-dark p-5">
                <div className="d-flex flex-column justify-content-center align-items-center bg-secondary rounded p-5 mx-5" style={{ width: "90%", height: "100%" }}>
                    <h2 style={{ color: "white", textAlign: "start" }} className="pb-2 mx-5">Add Product</h2>
                    <form className="bg-light rounded p-5 mx-5 mb-5" style={{ width: "100%", height: "50%" }} onSubmit={handleSubmit}>

                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Product Name:</label>
                            </div>
                            <div class="col-7">
                                <input type="text" placeholder="Enter Name" className="form-control mx-5"
                                    onChange={e => setValues({ ...values, productName: e.target.value })} />
                            </div>
                        </div>
                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>price:</label>

                            </div>
                            <div class="col-7">
                                <input type="number" placeholder="Enter price" className="form-control mx-5"
                                    onChange={e => setValues({ ...values, price: e.target.value })} />
                            </div>
                        </div>
                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Quantity:</label>

                            </div>
                            <div class="col-7">
                                <input type="number" placeholder="Enter quantity" className="form-control mx-5"
                                    onChange={e => setValues({ ...values, quantity: e.target.value })} />
                            </div>
                        </div>
                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Manufacture Date:</label>

                            </div>
                            <div class="col-7">
                                <input type="date" placeholder="Enter date" className="form-control mx-5"
                                    onChange={e => setValues({ ...values, mfd: e.target.value })} />
                            </div>
                        </div>
                        <div className="mb-5 mt-5 d-flex justify-content-around ">
                            <button type="button" class="btn btn-info btn-lg" onClick={onBack}>Back</button>
                            <button type="submit" class="btn btn-primary btn-lg">ADD</button>
                        </div>
                    </form>
                    <div className="mobile-table bg-light rounded" style={{ width: "100%",overflowX: "auto" }}>
                        <ProductTable />

                    </div>
                </div>


            </div>

        </>
    );

}

export default Product