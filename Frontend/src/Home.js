
import Header from './Header'
import "./Home.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";

import Shopping from './Shopping';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';

function Home() {
    const [Data, setData] = useState([])
    const [selectedOption, setSelectedOption] = useState("select");
    const [address, setAddress] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [date, setDateChange] =useState(new Date().toISOString().split('T')[0]);
    const [grandTotal, setGrandTotal] = useState(0);

    const [data, setdata] = useState([])
    const [visible, setVisible] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRowData, setSelectedRowData] = useState(null);


    const productbuttonClcik = () => {
        setVisible(true)
    }



    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        const selectedData = Data.find(d => d.name === selectedValue);
        console.log(selectedData)
        setAddress(selectedData ? selectedData.address : "");
        setContactNo(selectedData ? selectedData.contactNo : "");
    };

    const onHide = () => {
        setVisible(false)
        setVisibleEdit(false)
    }

    const itemsAddedToCart = () => {
        setIsLoading(true);
    }

    const handleDelete = (itemId) => {

        setIsLoading(true);
        fetch(`http://localhost:8083/items/${parseInt(itemId)}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                if (response.ok) {
                    fetch(`http://localhost:8083/items/${selectedOption}`)
                    setIsLoading(false);

                }
            })
            .catch((error) => {
                console.error('Error during item deletion:', error);
            });
    };

    useEffect(() => {
        fetch('http://localhost:8083/customer')
            .then(res => res.json())
            .then(data => setData(data)
                .catch(err => console.log(err))
            )
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {

        if (selectedOption !== "select") {
            fetch(`http://localhost:8083/items/${selectedOption}`)
                .then((res) => res.json())
                .then((itemsData) => setdata(itemsData))
                .catch((err) => console.log(err));
            setIsLoading(false);
            
            let total = 0;
            data.forEach((d) => {
                total += d.Total_Amount;
            });
            setGrandTotal(total);
        } 

    }, [selectedOption, isLoading,data])


    const handleEdit = (rowData) => {
        setSelectedRowData(rowData);
        setVisibleEdit(true);
    }


    const navigate = useNavigate();
    const proceedToBuy = () => {
        const orderDetails = {
            selectedOption,
            address,
            contactNo,
            grandTotal,
            items: data,
            date
        };

        orderDetails.items.forEach((item) => {
            const deductValues = {
                productName: item.productName,
                quantity: item.quantity
            };
    
            fetch("http://localhost:8083/deductProductQuantity", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deductValues),
            })
            .then((response) => response.json())
            .then((deductResponse) => {
                console.log("Quantity deducted successfully:", deductResponse);
            })
            .catch((error) => {
                console.error("Error deducting quantity:", error);
            });
        });
        
        navigate("/checkout", { state: { orderDetails } });
        

    };

    // const resetDataAndGrandTotal = () => {
    //     setdata([]);
    //     setGrandTotal(0);
    //   };

    return (
        <>
            <Header />
            

            <div className="p-5" style={{ background: "linear-gradient(to top, black, gray)", height: "100%" }}>                 
               <h2 style={{ color: "white", textAlign: "start" }} className="heading pb-2">Customer Shopping</h2>
                    <form className="rounded p-5 mb-5" style={{ width: "100%", height: "100vh",backgroundColor:"white" }} >
                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Name:</label>
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

                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Address:</label>
                            </div>
                            <div class="col-7">
                                <p>{address}</p>
                                <hr />
                            </div>
                        </div>

                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>contact No:</label>
                            </div>
                            <div class="col-7">
                                <p>{contactNo}</p>
                                <hr />
                            </div>
                        </div>
                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="fw-bold" style={{ color: "navy", fontSize: '20px' }}>Date:</label>
                            </div>
                            <div class="col-7">
                                <input type="date" className='form-control' value={date} onChange={(e) => setDateChange(e.target.value)} />
                            </div>
                        </div>

                        <div className='addButtons d-flex justify-content-end mt-3 mb-5 mx-3 d-none d-md-flex'>
                            <button type="button" onClick={productbuttonClcik} class="btn btn-outline-primary btn-lg mx-3">ADD Items+</button>
                        </div>

                        {isLoading && (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s" />
                            </div>
                        )}
                        {!isLoading && (

                            <div className="mobile-table bg-light rounded" style={{ width: "100%", overflowX: "auto" }}>
                                <h1 className='h1'>Products in Cart</h1>
                                <table className="table table-bordered" style={{ minWidth: "300px" }}>
                                    <thead>
                                        {/* <th>ID</th> */}
                                        {/* <th>Name</th> */}
                                        <th>productName</th>
                                        <th>Prize</th>
                                        <th>Quantity</th>
                                        <th>Total_Amount</th>
                                        <th>Actions</th>
                                    </thead>
                                    <tbody>
                                        {data.map((d, i) => (
                                            <tr key={i}>
                                                {/* <td>{d.itemId}</td> */}
                                                {/* <td>{d.name}</td> */}
                                                <td>{d.productName}</td>
                                                <td>{d.price}</td>
                                                <td>{d.quantity}</td>
                                                <td>{d.Total_Amount}</td>
                                                <td>

                                                    <button
                                                        type="button"
                                                        className="btn btn-danger"
                                                        onClick={() => handleDelete(d.itemId)}
                                                    >
                                                        Delete
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-warning mx-2"
                                                        onClick={() => handleEdit(d)}
                                                    >
                                                        Update
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="d-flex justify-content-end align-items-end">
                                    <div>
                                        <strong>Grand Total:</strong> {grandTotal}
                                    </div>
                                </div>
                            </div>
                        )}
                        <button type="button" style={{float:"right"}} onClick={proceedToBuy} className="btn btn-success btn-lg mb-5">
                            Proceed to Buy
                        </button>
                    </form>


                </div>
                <Dialog visible={visible} style={{ width: '50vw' }} onHide={onHide} >
                    <Shopping close={onHide} name={selectedOption} date={date} itemsAdded={itemsAddedToCart} />
                </Dialog>
                <Dialog visible={visibleEdit} style={{ width: '50vw' }} onHide={onHide} >
                    <Shopping close={onHide} name={selectedOption} itemsAdded={itemsAddedToCart} selectedRowData={selectedRowData} />
                </Dialog>

           
        </>

    )
}

export default Home