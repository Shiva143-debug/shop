import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { v4 as uuidv4 } from 'uuid';
// import axios from 'axios';

const Checkout = (props) => {
    const [checkshow, setcheckoutshow] = useState(true)
    const [upishow, setupishow] = useState(false)
    const [cashshow, setcashshow] = useState(false)
    const [isplayclick, setpay] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();
    const { orderDetails } = location.state || {};
    const [showPayButton, setShowPayButton] = useState(true)
    const [TotalAmount, setGrandTotal] = useState(0);
    const uniqueId = uuidv4();
    const [inputs, setInputs] = useState([
        { denomination: '2000 Notes', value: '' },
        { denomination: '500 Notes', value: '' },
        { denomination: '200 Notes', value: '' },
        { denomination: '100 Notes', value: '' },
        { denomination: '50 Notes', value: '' },
        { denomination: '20 Notes', value: '' },
        { denomination: '10 Notes', value: '' },
        { denomination: '5 Rupees', value: '' },
        { denomination: '2 Rupees', value: '' },
        { denomination: '1 Rupees', value: '' },



        // Add more denominations as needed
    ]);

    
    const calculateAmount = (denomination, value) => {
        switch (denomination) {
            case '1 Rupees':
                return value * 1;
            case '2 Rupees':
                return value * 2;
            case '5 Rupees':
                return value * 5;
            case '10 Notes':
                return value * 10;
            case '20 Notes':
                return value * 20;
            case '50 Notes':
                return value * 50;

            case '100 Notes':
                return value * 100;
            case '200 Notes':
                return value * 200;
            case '500 Notes':
                return value * 500;
            case '2000 Notes':
                return value * 2000;
            default:
                return 0;
        }

    };

    useEffect(() => {
        let total = 0;
        inputs.forEach(input => {
            total += calculateAmount(input.denomination, input.value);
        });
        setGrandTotal(total);
    }, [inputs]);



    console.log(orderDetails)

    if (!orderDetails || orderDetails.grandTotal === 0) {
        return <div style={{ textAlign: "center", fontSize: "50px" }}>No order details found</div>;
    }

    const { selectedOption, address, contactNo, grandTotal, items, date } = orderDetails;


    const handlePrint = () => {
        window.print();

        

        const exportData = items.map(item => ({
            selectedOption,
            date,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            total_amount: item.Total_Amount,
        }));

        

        fetch('http://localhost:8083/exportToSales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exportData),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);

                navigate("/home");
                resetDataAndGrandTotal();
            })
            .catch(error => {
                console.error('Error exporting to sales:', error);
            });
    };

    const resetDataAndGrandTotal = async () => {
        const response = await fetch(`http://localhost:8083/deleteItems/${selectedOption}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            console.log('Items deleted successfully');
        } else {
            console.error('Failed to delete items');
        }
    }


    const onBack = () => {


        orderDetails.items.forEach((item) => {
            const deductValues = {
                productName: item.productName,
                quantity: item.quantity
            };

            fetch("http://localhost:8083/addProductQuantity", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(deductValues),
            })
                .then((response) => response.json())
                .then((deductResponse) => {
                    console.log("Quantity deducted successfully:", deductResponse);
                    navigate("/home");
                })
                .catch((error) => {
                    console.error("Error deducting quantity:", error);
                });
        });



    }

    const onPay = () => {
        setpay(true)
    }
    const oncash = () => {
        setupishow(false)
        setcheckoutshow(false)
        setcashshow(true)
    }

    const onUpi = () => {
        setupishow(true)
        setcheckoutshow(false)
        setcashshow(false)
        // const data={
        //     selectedOption,
        //     date,
        //    paymentType:"upi pay",         
        //    grandTotal,

        // }

        // navigate("/upi", { state: { data } });
    }

    const paymentCompleted = () => {

        const exportData = {
            selectedOption, date, paymentType: "upi_pay", grandTotal
        }
        fetch('http://localhost:8083/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exportData),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);


                // resetDataAndGrandTotal();
            })
            .catch(error => {
                console.error('Error to pay:', error);
            });

        setupishow(false)
        setcheckoutshow(true)
        setcashshow(false)
        setShowPayButton(false)
    }



    const cashpaymentCompleted = () => {
        const data = {
            selectedOption, date, grandTotal,
            denominations: {
              '2000notes': inputs.find(input => input.denomination === '2000 Notes').value,
              '500notes': inputs.find(input => input.denomination === '500 Notes').value,
              '200notes': inputs.find(input => input.denomination === '200 Notes').value,
              '100notes': inputs.find(input => input.denomination === '100 Notes').value,
              '50notes': inputs.find(input => input.denomination === '50 Notes').value,
              '20notes': inputs.find(input => input.denomination === '20 Notes').value,
              '10notes': inputs.find(input => input.denomination === '10 Notes').value,
              '5rupees': inputs.find(input => input.denomination === '5 Rupees').value,
              '2rupees': inputs.find(input => input.denomination === '2 Rupees').value,
              '1rupees': inputs.find(input => input.denomination === '1 Rupees').value

            }
          };
        
          fetch('http://localhost:8083/cashCompleted', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          .then(response => response.json())
          .then(data => {
            console.log(data.message);
            // Handle success response
          })
          .catch(error => {
            console.error('Error completing cash payment:', error);
            // Handle error
          })


        const exportData = {
            selectedOption, date, paymentType: "cash_pay", grandTotal
        }
        fetch('http://localhost:8083/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(exportData),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);


                // resetDataAndGrandTotal();
            })
            .catch(error => {
                console.error('Error to pay:', error);
            });

        setupishow(false)
        setcheckoutshow(true)
        setcashshow(false)
        setShowPayButton(false)

    }
    const handleInputChange = (index, value) => {
        const newInputs = [...inputs];
        newInputs[index].value = value;
        setInputs(newInputs);
    };

    const remainingBalance = grandTotal - inputs.reduce((acc, curr) => acc + calculateAmount(curr.denomination, curr.value), 0);


    return (
        <>
            {checkshow && <div>

                <style>
                    {`
        @media print {
            .btn {
                display: none !important;
            }
        }
    `}
                </style>


                <div style={{ margin: "10px 10px 0px 10px", border: "1px solid gray", padding: "20px 100px 100px 100px", paddingBottom: "200px" }}>
                    <h1 style={{ textAlign: "center", color: "red", paddingBottom: "20px" }}>INVOICE {uniqueId}</h1>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ display: "flex" }}>
                            <img src="https://res.cloudinary.com/dxgbxchqm/image/upload/v1704974380/comapnylogo_gh2jvq.jpg" alt="pic" style={{ width: "50px", height: "40px" }} />
                            <h1 style={{ color: "blue", fontFamily: "sans-serif" }}>WhereSoftTechnolgies</h1>

                        </div>
                        {!showPayButton && 
                        <button onClick={handlePrint} className="btn btn-outline-success" style={{ marginTop: "20px" }}>Export / Print</button>
                        }
                        </div>
                    <p style={{ fontSize: "20px", color: "blue", paddingBottom: "30px" }}><strong>Address:</strong> pragathinagar</p>

                    <div style={{ fontSize: "20px", paddingBottom: "10px", display: "flex", justifyContent: "space-between" }}>
                        <div>
                            <p><strong>Name:</strong> {selectedOption}</p>
                            <p><strong>Address:</strong> {address}</p>
                            <p><strong>Contact No:</strong> {contactNo}</p>
                        </div>
                        <p style={{ paddingTop: "20px" }}><strong>Date:</strong> {date}</p>
                    </div>
                    {/* <h3>Items in Cart</h3> */}
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.productName}</td>
                                    <td>{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.Total_Amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    <p style={{ float: "right", fontSize: "24px" }}><strong>Grand Total:</strong> {grandTotal}</p>


                    {showPayButton && <div className='d-flex justify-content-between pt-5'>
                        <button type="button" class="btn btn-info btn-lg" onClick={onBack}>Back</button>
                        {isplayclick === false && <button type="button" class="btn btn-info btn-lg" onClick={onPay}>Pay</button>}
                        {isplayclick === true &&
                            <div className='d-flex justify-content-between'>
                                <button type="button" class="btn btn-info btn-lg mx-2" onClick={oncash}>cash</button>
                                <button type="button" class="btn btn-info btn-lg" onClick={onUpi}>upi pay</button>
                            </div>
                        }
                    </div>}

                </div>
            </div>
            }
            {upishow &&
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <QRCode style={{ height: "500px", width: "500px", marginTop: "100px" }} value={"shiva"} />
                    <div>
                    <button type="button" class="btn btn-info btn-lg mt-5 mx-5" onClick={onBack}>Back</button>
                    <button type="button" class="btn btn-info btn-lg mt-5 mx-5" onClick={paymentCompleted}>paymentCompleted</button>
                    </div>
                </div>
            }

            {
                cashshow &&
                <div class="mx-5" style={{display:"flex",flexDirection:"column",justifyContent:"center"}}>
                    <h1 class="mt-5 mb-5" style={{fontFamily:"Roboto"}}>Cash Table</h1>
                    <h3 class="mb-5">Total Amount should pay:{grandTotal}</h3>
                    <table className="table table-bordered">
                        <thead>
                            <tr >
                                <th>Denomination</th>
                                <th>Input</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inputs.map((input, index) => (
                                <tr key={index}>
                                    <td>{input.denomination}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={input.value}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            style={{border:"1px solid white"}}
                                        />
                                    </td>
                                    <td>{calculateAmount(input.denomination, input.value)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2" style={{fontWeight:"bold"}}>Grand Total</td>
                                <td style={{fontWeight:"bold"}}>{TotalAmount}</td>
                            </tr>
                        </tfoot>


                    </table>

                    <p style={{fontWeight:"bold"}}>Remaining Balance to Pay: {remainingBalance >= 0 ? remainingBalance : 0}</p>
                    {remainingBalance < 0 && <p style={{ color: 'red' }}>Amount paid exceeds the total amount.</p>}

                    {remainingBalance === 0 && 
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                    <button type="button" class="btn btn-info btn-lg mt-5" onClick={onBack}>Back</button>


                    <button type="button" class="btn btn-info btn-lg mt-5" onClick={cashpaymentCompleted}>Cash payment Completed</button>
                    
                    </div>}
                    
                    </div>
            }


        </>
    );
};

export default Checkout;
