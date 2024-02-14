import { useState, useEffect } from "react"
// import axios from 'axios';
// import { useNavigate } from "react-router-dom";

function CustomerTable() {


    const [Data, setData] = useState([])

    useEffect(() => {
        fetch('http://localhost:8083/customer')
            .then(res => res.json())
            .then(data => setData(data)

            )

    }, [])

    return (

        <div className="container" style={{ marginLeft: "200px", width: "1000px" }}>
            <h1>Customer Table</h1>
            <table className="table table-bordered">
                <thead>
                    <th>customerId</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>contactNo</th>
                </thead>
                <tbody>
                    {Data.map((d, i) => (
                        <tr key={i}>
                            <td>{d.customerId}</td>
                            <td>{d.name}</td>
                            <td>{d.address}</td>
                            <td>{d.contactNo}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>


    );

}

export default CustomerTable