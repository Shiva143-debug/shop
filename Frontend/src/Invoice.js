import Header from "./Header";
import React, { useState, useEffect, useRef } from "react";

import { Toast } from 'primereact/toast';
import axios from "axios";
import "./index.css"

// import PDFViewer from './PDFViewer';
// import PDFViewer from './PDFViewer';

import { Viewer, Worker } from "@react-pdf-viewer/core"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"

const Invoice = () => {
    const [fileurl, setFile] = useState(null);
    const [companyName, setCompanyName] = useState("");
    const [amount, setAmount] = useState("");
    const [invoice, setInvoice] = useState("");
    const [Data, setInvoiceData] = useState([])
    const [productsData, setData] = useState([])

    const [addInvoice, setAddInvoice] = useState(true);
    const [viewInvoice, setViewInvoice] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const toast = useRef(null);

    const [showPDF, setShowPDF] = useState(false);
    const [filePath, setFilePath] = useState('');






    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {

            var urlCreator = window.URL || window.webkitURL
            var pdfUrl = urlCreator.createObjectURL(selectedFile);
            setFile(pdfUrl);
            setFilePath(pdfUrl)
            // setFile(selectedFile);
            // console.log(pdfUrl)
            setShowPDF(true)


        } else {
            setFile(null);

        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        

        if (invoice === "") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter invoice Number' });
            return;
        }


        else if (amount === "") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter amount' });
            return;
        }
        else if (companyName === "") {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please enter companyName' });
            return;
        }
        else if (!fileurl) {
            toast.current.show({ severity: 'warn', summary: 'Warning', detail: 'Please select  file' });
            return;
        }
        else {

            const values={
                fileurl,companyName,amount,invoice
            }

            console.log(values)

            axios.post("http://localhost:8083/addInvoice", values)
            .then(res => {
                console.log(res);
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Invoice added successfully' });
                setCompanyName("")
                setAmount("")
                setFile("")
                setInvoice("")
               
            })
            .catch(err => {
                console.log(err);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to add Invoice' });
                
            });

        

        }
    };


    useEffect(() => {
        fetch('http://localhost:8083/getInvoice')
            .then(res => res.json())
            .then(data => setInvoiceData(data)

            )

    }, [])


    useEffect(() => {
        fetch('http://localhost:8083/getProductsFromCompanies')
            .then(res => res.json())
            .then(data => setData(data)

            )

    }, [])

    const viewPDF = (filePath) => {
      
        setFilePath(filePath);
      
        setShowPDF(true)

    };

    const add = () => {
        setAddInvoice(true)
        setViewInvoice(false)
    }


    const view = () => {
        setViewInvoice(true)
        setAddInvoice(false)
    }
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = productsData.filter((d) => {
        return (
            d.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(d.price).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(d.sellingPrice).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(d.quantity).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(d.totalAmount).toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.Date.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    let totalQuantity = 0;
    let grandTotal = 0;
    let totalPrice = 0;
    let totalSellingPrice = 0;
    filteredData.forEach((d) => {
        totalPrice += parseInt(d.price);
        totalSellingPrice += parseInt(d.sellingPrice);
        totalQuantity += parseInt(d.quantity);
        grandTotal += parseFloat(d.totalAmount);
    });


    const newplugin = defaultLayoutPlugin()

    return (
        <div style={{ background: "linear-gradient(to bottom, white, gray)", height: "100%", minHeight: "100vh" }}>



            <Header />
            <div style={{ display: "flex", marginBottom: "20px" }}>
                <button onClick={add} style={{ width: "50%", border: "none", padding: "10px", fontWeight: "bold", borderRight: "1px solid gray", backgroundColor: addInvoice ? "gray" : "whitesmoke", color: addInvoice ? "white" : "" }}>ADD INVOICE</button>
                <button onClick={view} style={{ width: "50%", border: "none", padding: "10px", fontWeight: "bold", borderRight: "1px solid gray", backgroundColor: viewInvoice ? "gray" : "whitesmoke", color: viewInvoice ? "white" : "" }}>VIEW INVOICE DETAILS</button>

            </div>

            {addInvoice &&
                <div className="d-flex justify-content-around align-items-center" >
                    <Toast ref={toast} />
                    <form onSubmit={handleSubmit} style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)", borderRadius: "8px" }} class="p-5 mt-5">
                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Invoice Number:</label>

                            </div>
                            <div class="col-7">
                                <input type="text" className="form-control mx-5"
                                    value={invoice}
                                    // onChange={onInvoiceChange}
                                    onChange={(e) => setInvoice(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Company Name:</label>

                            </div>
                            <div class="col-7">
                                <input type="text" className="form-control mx-5"
                                    value={companyName}
                                    // onChange={onCompanyNameChange}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                />
                            </div>
                        </div>


                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Amount:</label>

                            </div>
                            <div class="col-7">
                                <input type="number" className="form-control mx-5"

                                    value={amount}
                                    // onChange={onAmountChange}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Choose Invoice File:</label>

                            </div>
                            <div class="col-7">
                                <input type="file"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary btn-lg">Submit</button>

                    </form>

                    <div>
                        <table className="table table-bordered " style={{ minWidth: "800px", height: "100%" }}>
                            <thead>
                                <th>Invoice Number</th>
                                <th>companyName</th>
                                <th>Amount</th>
                                <th>Invoive</th>

                            </thead>
                            <tbody>
                                {Data.map((d, i) => (
                                    <tr key={i}>
                                        <td>{d.invoice}</td>
                                        <td>{d.companyName}</td>
                                        <td>{d.amount}</td>
                                        <td><button onClick={() => viewPDF(d.filePath)}>View PDF</button></td>


                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {/* {showPDF && <PDFViewer filePath={filePath} />} */}
                        {showPDF &&
                            <div className="pdf-container">
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                    {filePath && <>
                                        <Viewer fileUrl={filePath} plugins={[newplugin]} />
                                    </>}
                                    {!filePath && <>NO PDF</>}
                                </Worker>

                            </div>
                        }


                    </div>

                </div>
            }


            {viewInvoice &&
                <div className="mx-5 mt-5" >

                    <div className="mb-5 row">
                        <div class="col-1">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Search:</label>

                        </div>
                        <div class="col-3">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <table className="table table-bordered" style={{ minWidth: "1000px" }}>
                        <thead>
                            <th>Invoice Number</th>
                            <th>companyName</th>
                            <th>productName</th>
                            <th>price</th>
                            <th>selling Price</th>
                            <th>Quantity</th>
                            <th>Amount(price*quanity)</th>
                            <th>Purchased Date</th>


                        </thead>
                        <tbody>
                            {filteredData.map((d, i) => (
                                <tr key={i}>
                                    <td>{d.invoiceNumber}</td>
                                    <td>{d.companyName}</td>
                                    <td>{d.productName}</td>
                                    <td>{d.price}</td>
                                    <td>{d.sellingPrice}</td>
                                    <td>{d.quantity}</td>
                                    <td>{d.totalAmount}</td>
                                    <td>{d.Date}</td>


                                </tr>
                            ))}
                            <tr>
                                <td colSpan="3"></td>
                                <td>Total Price: <b>{totalPrice}</b></td>
                                <td>Total selling price: <b>{totalSellingPrice}</b></td>
                                <td>Total Quantity: <b>{totalQuantity}</b></td>
                                <td>Grand Total: <b>{grandTotal.toFixed(2)}</b></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            }





        </div>
    );
};

export default Invoice;
