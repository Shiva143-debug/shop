import { useState, useEffect } from "react"


function ProductTable() {


    const [Data, setData] = useState([])

    useEffect(() => {
        fetch('http://localhost:8083/product')
            .then(res => res.json())
            .then(data => setData(data)

            )

    }, [])

    return (

        <div>
            <h1>Product Table</h1>
            <table className="table table-bordered" style={{ minWidth: "300px" }}>
                <thead>
                    {/* <th>productId</th> */}
                    <th>productName</th>
                    <th>Prize</th>
                    <th>Quantity</th>
                    {/* <th>ReceivedDate</th> */}
                </thead>
                <tbody>
                    {Data.map((d, i) => (
                        <tr key={i}>
                            {/* <td>{d.id}</td> */}
                            <td>{d.productName}</td>
                            <td>{d.sellingPrice}</td>
                            <td>{d.quantity}</td>
                            {/* <td>{d.Date}</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>


    );

}

export default ProductTable