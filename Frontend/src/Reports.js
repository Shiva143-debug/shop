import Header from './Header'
import { useState, useEffect } from "react"
import { ProgressSpinner } from 'primereact/progressspinner';
import "./index.css"

const Reports = () => {
    const [value, setBy] = useState("Date")
    const [selectedOption, setSelectedOption] = useState("select");
    const [Data, setData] = useState([])
    const [date, setDateChange] = useState("")
    const [cashDate, setcashDateChange] = useState("")

    const [data, setdata] = useState([])
    const [grandTotal, setGrandTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [productName, setproductName] = useState("Select");
    const [payment, setPayment] = useState("Selectt");

    const [productData, setProductData] = useState([])

    // const [paymentType, setPaymentType] = useState("upi pay")
    // const [paymentData, setPaymentData] = useState([])
    const [paymentTypeData, setpaymentTypeData] = useState([])
    const [cashReportData, setCashReportData] = useState([])
    const [cashReportDataClicked, setCashReportDataClicked] = useState(false)


    const [paymentClicked, setpaymentClicked] = useState(false)
    const [datebuttonClicked,setDateButtonClicked]= useState(false)
    
    const [namebuttonClicked,setNameButtonClicked]= useState(false)
    const [productbuttonClicked,setProductButtonClicked]= useState(false)
    const [paybuttonClicked,setPayButtonClicked]= useState(false)
    const [cashbuttonClicked,setCashButtonClicked]= useState(false)
    console.log(cashReportData)




    const byDate = () => {
        setSelectedOption("select")
        setproductName("Select")
        setIsLoading(true)
        setBy("Date")
        setPayment("Selectt")
        setpaymentClicked(false)
        setCashReportDataClicked(false)
        setDateButtonClicked(true)
        setNameButtonClicked(false);
        setProductButtonClicked(false);
        setPayButtonClicked(false);
        setCashButtonClicked(false);
    }
    const byName = () => {
        setDateChange("")
        setproductName("Select")
        setIsLoading(true)
        setBy("name")
        setPayment("Selectt")
        setpaymentClicked(false)
        setCashReportDataClicked(false)
        setDateButtonClicked(false);
        setNameButtonClicked(true);
        setProductButtonClicked(false);
        setPayButtonClicked(false);
        setCashButtonClicked(false);

    }

    const byProductName = () => {
        setDateChange("")
        setSelectedOption("select")
        setIsLoading(true)
        setBy("productName")
        setPayment("Selectt")
        setpaymentClicked(false)
        setCashReportDataClicked(false)
        setDateButtonClicked(false);
        setNameButtonClicked(false);
        setProductButtonClicked(true);
        setPayButtonClicked(false);
        setCashButtonClicked(false);


    }

    const byPayementType = () => {
        setDateChange("")
        setSelectedOption("select")
        setproductName("Select")
        setIsLoading(true)
        setBy("payment")

        setpaymentClicked(true)
        setCashReportDataClicked(false)
        setDateButtonClicked(false);
        setNameButtonClicked(false);
        setProductButtonClicked(false);
        setPayButtonClicked(true);
        setCashButtonClicked(false);



    }

    const byCashReport = () => {
        setDateChange("")
        setSelectedOption("select")
        setproductName("Select")
        setIsLoading(true)
        setBy("cashReport")
        setPayment("Selectt")
        setpaymentClicked(false)
        setCashReportDataClicked(true)
        setCashButtonClicked(true)
        setDateButtonClicked(false);
        setNameButtonClicked(false);
        setProductButtonClicked(false);
        setPayButtonClicked(false);
        setCashButtonClicked(true);

    }

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
    };


    const productHandleSelectChange = (event) => {

        setproductName(event.target.value);


    };

    const handlePaymentChange = (event) => {
        setPayment(event.target.value)
    }


    useEffect(() => {
        fetch('http://localhost:8083/customer')
            .then(res => res.json())
            .then(data => setData(data)
                .catch(err => console.log(err))
            )
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        fetch('http://localhost:8083/product')
            .then(res => res.json())
            .then(data => setProductData(data)

            )

    }, [])


    useEffect(() => {
        // console.log(date)
        console.log(value)
        setIsLoading(true)
        if (date !== "" && value === "Date") {

            fetch(`http://localhost:8083/salesByDate/${date}`)
                .then((res) => res.json())
                .then((itemsData) => setdata(itemsData))
                .catch((err) => console.log(err));
            setIsLoading(false);

            let total = 0;
            data.forEach((d) => {
                total += d.Total_Amount;
            });
            setGrandTotal(total);
        } else if (selectedOption !== "select" && value === "name") {

            fetch(`http://localhost:8083/salesByName/${selectedOption}`)
                .then((res) => res.json())
                .then((itemsData) => setdata(itemsData))

                .catch((err) => console.log(err));
            setIsLoading(false);

            let total = 0;
            data.forEach((d) => {
                total += d.Total_Amount;
            });
            setGrandTotal(total);
        } else if (productName !== "select" && value === "productName") {
            fetch(`http://localhost:8083/salesByProductName/${productName}`)
                .then((res) => res.json())
                .then((itemsData) => setdata(itemsData))

                .catch((err) => console.log(err));
            setIsLoading(false);

            let total = 0;
            data.forEach((d) => {
                total += d.Total_Amount;
            });
            setGrandTotal(total);
        } else if (payment !== "Selectt" && value === "payment") {
            console.log(payment)
            fetch(`http://localhost:8083/reportBypayment/${payment}`)
                .then((res) => res.json())
                .then((itemsData) => setpaymentTypeData(itemsData))
                .catch((err) => console.log(err));
            setIsLoading(false);
        } else if (cashDate !== "" && value === "cashReport") {

            fetch(`http://localhost:8083/cashReport/${cashDate}`)
                .then((res) => res.json())
                .then((itemsData) => setCashReportData(itemsData))
                .catch((err) => console.log(err));
            setIsLoading(false);

        }


    }, [selectedOption, paymentTypeData, cashDate, payment, isLoading, data, date, productData, productName])

    return (
        <div>
            <Header />
            <div style={{ background: "linear-gradient(to bottom, white, gray)", height: "100vh" }}>
                <div style={{ display: "flex" }}>
                    <button onClick={byDate} style={{ width: "50%", border: "none", backgroundColor: datebuttonClicked ? "gray":"whitesmoke", padding: "10px",color: datebuttonClicked ? "white":"", fontWeight: "bold", borderRight: "1px solid gray" }}>Reports By Date</button>
                    <button onClick={byName} style={{ width: "50%", border: "none", backgroundColor: namebuttonClicked ? "gray":"whitesmoke", padding: "10px",color: namebuttonClicked ? "white":"", fontWeight: "bold", borderRight: "1px solid gray" }}>Reports By Name</button>
                    <button onClick={byProductName} style={{ width: "50%", border: "none", backgroundColor:productbuttonClicked ? "gray":"whitesmoke", padding: "10px",color: productbuttonClicked ? "white":"", fontWeight: "bold", borderRight: "1px solid gray" }}>Reports By productName</button>
                    <button onClick={byPayementType} style={{ width: "50%", border: "none", backgroundColor: paybuttonClicked ? "gray":"whitesmoke",color: paybuttonClicked ? "white":"",padding: "10px", fontWeight: "bold", borderRight: "1px solid gray" }}>Reports By paymentType</button>
                    <button onClick={byCashReport} style={{ width: "50%", border: "none", backgroundColor:cashbuttonClicked ? "gray":"whitesmoke",color: cashbuttonClicked ? "white":"", padding: "10px", fontWeight: "bold" }}>Cash Reports By Date</button>

                </div>
                {/* {value === "Date" ? "Select Date" : "select Name"}
            <input type={value === "Date" ? "Date" : ""} /> */}

                {value === "name" &&
                    <div className="mb-5 row mt-5 mx-5">
                        <div class="col-3">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Select Name:</label>
                        </div>
                        <div class="col-7">
                            <select id="id" class="form-control" value={selectedOption}
                                onChange={handleSelectChange}>
                                <option value="select">Select</option>
                                {Data.map((d) => (
                                    <option key={d.customerId} value={d.name}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                }
                {value === "Date" &&
                    <div className="mb-5 row mt-5 mx-5">
                        <div class="col-3">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Select Date:</label>
                        </div>
                        <div class="col-7">
                            <input type="date" className='form-control' value={date} onChange={(e) => setDateChange(e.target.value)} />
                        </div>
                    </div>
                }

                {value === "productName" &&
                    <div className="mb-5 row mt-5 mx-5">
                        <div class="col-3">
                            <label htmlFor="" className="px-5 fw-bold" style={{ color: "navy", fontSize: '20px' }}>select product Name:</label>
                        </div>
                        <div class="col-7">
                            <select id="id" class=" form-control" value={productName}
                                onChange={productHandleSelectChange}>
                                <option value="select">Select</option>
                                {productData.map((d) => (
                                    <option key={d.id} value={d.productName}>
                                        {d.productName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                }
                {value === "payment" &&
                    <div className="mb-5 row mt-5 mx-5">
                        <div class="col-3">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Select paymentType:</label>
                        </div>
                        <div class="col-7">
                            <select id="id" class="form-control" value={payment}
                                onChange={handlePaymentChange}>
                                <option value="select">Selectt</option>
                                <option value="upi_pay">upi_pay</option>
                                <option value="cash_pay">cash_pay</option>
                                {/* {paymentData.map((d) => (
                                    <option key={d.BillNo} value={d.paymentType}>
                                        {d.paymentType}
                                    </option>
                                ))} */}
                            </select>
                        </div>
                    </div>
                }


                {value === "cashReport" &&
                    <div className="mb-5 row mt-5 mx-5">
                        <div class="col-3">
                            <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Select Date:</label>
                        </div>
                        <div class="col-7">
                            <input type="date" className='form-control' value={cashDate} onChange={(e) => setcashDateChange(e.target.value)} />
                        </div>
                    </div>
                }
                {isLoading && (

                    <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                             <img
                            className="blinking"
                            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
                            alt="website logo"
                        />
                        {/* <h1 className="blinking" style={{color:"white"}} >Select The Type..... </h1> */}
                        {/* <ProgressSpinner style={{ width: '100px', height: '100px' }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" /> */}
                    </div>
                )}

                {!isLoading && cashReportDataClicked === true && paymentClicked === false && (

                    <table className="table table-bordered" style={{ minWidth: "300px" }}>
                        <thead>
                            <th>Name</th>
                            <th>2000 Notes</th>
                            <th>500 Notes</th>
                            <th>200 Notes</th>
                            <th>100 Notes</th>
                            <th>50 Notes</th>
                            <th>20 Notes</th>
                            <th>10 Notes</th>
                            <th>5 Rupees</th>
                            <th>2 Rupees</th>
                            <th>1 Rupees</th>
                            <th>Grand Total</th>



                        </thead>
                        <tbody>
                            {cashReportData.map((d, i) => (
                                <tr key={i}>

                                    <td>{d.name}</td>
                                    <td>{d.twothousandnotes}</td>
                                    <td>{d.fiveHundrednotes}</td>
                                    <td>{d.twoHundrednotes}</td>
                                    <td>{d.hundrednotes}</td>
                                    <td>{d.fiftyNotes}</td>
                                    <td>{d.twentynotes}</td>
                                    <td>{d.tenNotes}</td>
                                    <td>{d.fiverupees}</td>
                                    <td>{d.tworupees}</td>
                                    <td>{d.onerupees}</td>
                                    <td>{d.grandTotal}</td>


                                </tr>
                            ))}
                            <tr>
                                <td style={{backgroundColor:"gray"}}>Total</td>
                                <td style={{backgroundColor:"gray"}}>{cashReportData.reduce((acc, d) => acc + d.twothousandnotes, 0)}</td>
                                <td style={{backgroundColor:"gray"}}>{cashReportData.reduce((acc, d) => acc + d.fiveHundrednotes, 0)}</td>
                                <td style={{backgroundColor:"gray"}}>{cashReportData.reduce((acc, d) => acc + d.twoHundrednotes, 0)}</td>
                                <td style={{backgroundColor:"gray"}}>{cashReportData.reduce((acc, d) => acc + d.hundrednotes, 0)}</td>
                                <td style={{backgroundColor:"gray"}}>{cashReportData.reduce((acc, d) => acc + d.fiftyNotes, 0)}</td>
                                <td style={{backgroundColor:"gray"}}>{cashReportData.reduce((acc, d) => acc + d.twentynotes, 0)}</td>
                                <td style={{backgroundColor:"gray"}}>{cashReportData.reduce((acc, d) => acc + d.tenNotes, 0)}</td>
                                <td style={{backgroundColor:"gray"}}>{cashReportData.reduce((acc, d) => acc + d.fiverupees, 0)}</td>
                                <td style={{backgroundColor:"gray"}}>{cashReportData.reduce((acc, d) => acc + d.tworupees, 0)}</td>
                                <td style={{backgroundColor:"gray"}}>{cashReportData.reduce((acc, d) => acc + d.onerupees, 0)}</td>
                                <td style={{backgroundColor:"gray"}}>{cashReportData.reduce((acc, d) => acc + d.grandTotal, 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                )}

                {!isLoading && paymentClicked === true && cashReportDataClicked === false && (
                    <div style={{ width: "80%", overflowX: "auto", marginLeft: "10%" }}>

                        <table className="table table-bordered" style={{ minWidth: "300px" }}>
                            <thead>
                                <th>Bill No</th>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Amount</th>


                            </thead>
                            <tbody>
                                {paymentTypeData.map((d, i) => (
                                    <tr key={i}>


                                        <td>{d.BillNo}</td>
                                        <td>{d.Name}</td>
                                        <td>{d.Date}</td>
                                        <td>{d.Amount}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!isLoading && paymentClicked === false && cashReportDataClicked === false && (

                    <div style={{ width: "80%", overflowX: "auto", marginLeft: "10%" }}>
                        <h1 className='h1' style={{ fontFamily: "sans-serif" }}>{value === "Date" && "Bought Item Details By Date"}</h1>
                        <h1 className='h1' style={{ fontFamily: "sans-serif" }}>{value === "name" && "Bought Item Details By Name"}</h1>
                        <h1 className='h1' style={{ fontFamily: "sans-serif" }}>{value === "productName" && "Bought Item Details By productName"}</h1>
                        <table className="table table-bordered" style={{ minWidth: "300px" }}>
                            <thead>
                                {/* <th>ID</th> */}
                                {(value === "productName" || value === "name") && <th>Date</th>}
                                {(value === "productName" || value === "Date") && <th>Name</th>}
                                {(value === "name" || value === "Date") && <th>productName</th>}

                                <th>Prize</th>
                                <th>Quantity</th>
                                <th>Total_Amount</th>


                            </thead>
                            <tbody>
                                {data.map((d, i) => (
                                    <tr key={i}>
                                        {/* <td>{d.itemId}</td> */}
                                        {(value === "productName" || value === "name") && <th>{d.date}</th>}
                                        {(value === "productName" || value === "Date") && <td>{d.name}</td>}
                                        {(value === "name" || value === "Date") && <td>{d.productName}</td>}

                                        <td>{d.price}</td>
                                        <td>{d.quantity}</td>
                                        <td>{d.Total_Amount}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-end align-items-end">
                            <div style={{ color: "white", fontSize: "18px" }}>
                                <strong>Grand Total:</strong> {grandTotal}
                            </div>
                        </div>
                    </div>

                )}




            </div>
        </div>


    )
}

export default Reports