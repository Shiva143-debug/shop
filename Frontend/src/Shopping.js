import { useState, useEffect } from "react"
import axios from 'axios';

function Shopping(props) {
    const [name,setName]=useState(props.name)
    const [Data, setData] = useState([])
    const [selectedOption, setSelectedOption] = useState("select");
    const [sellingPrice, setPrice] = useState("");
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        fetch('http://localhost:8083/product')
            .then(res => res.json())
            .then(data => setData(data)

            )

    }, [])

        useEffect(() => {
        if (props.selectedRowData) {
            console.log(props.selectedRowData)
            const { productName, sellingPrice,quantity } = props.selectedRowData;
            setSelectedOption(productName);
            setPrice(sellingPrice);
            setQuantity(quantity)
        }else{
            setSelectedOption("");
            setPrice("");
            setQuantity("")
        }

    }, [props.selectedRowData]);

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        const selectedData = Data.find(d => d.productName === selectedValue);
        console.log(selectedData)
        setPrice(selectedData ? selectedData.sellingPrice : "");

    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleSubmit = (e) => {

        e.preventDefault();
        

        let values = {name:name, date:props.date, productName: selectedOption, price: sellingPrice, quantity: quantity }
        console.log(values)
        // axios.post("http://localhost:8083/addItems", values)

        if(props.selectedRowData){
            const{itemId}=props.selectedRowData
            axios.put("http://localhost:8083/addItems/"+itemId,values)
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log(err);
                });
        }else{
            axios.post("http://localhost:8083/addItems", values)
            .then(res=>{
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            });

            
        }

    }

    const popClose=()=>{
        props.close();
        props.itemsAdded()
    }




    return (
        <>

                <div className="bg-secondary rounded p-5 mx-5" style={{ width: "90%", height: "100%" }}>
                    <h2 style={{ color: "white", textAlign: "start" }} className="pb-2 mx-5">{props.selectedRowData ? "Update Items" : "Add Items"}</h2>
                    <form className=" rounded" style={{ width: "90%", height: "100%" }} onSubmit={handleSubmit}>

                    <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: "white", fontSize: '20px' }}>Name:</label>
                            </div>
                            <div class="col-9">
                                <input value={name} class=" form-control" disabled style={{backgroundColor:"black",color:"white"}}/>

                            </div>
                        </div> 
                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: "white", fontSize: '20px' }}>product Name:</label>
                            </div>
                            <div class="col-9">
                                <select id="id" class=" form-control" value={selectedOption}
                                    onChange={handleSelectChange}>
                                    <option value="select">Select</option>
                                    {Data.map((d) => (
                                        <option key={d.id} value={d.productName}>
                                            {d.productName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: "white", fontSize: '20px' }}>Price:</label>
                            </div>
                            <div class="col-9">
                                <input value={sellingPrice} class=" form-control" disabled />

                            </div>
                        </div>

                        <div className="mb-5 row">
                            <div class="col-3">
                                <label htmlFor="" className="px-5 fw-bold" style={{ color: "white", fontSize: '20px' }}>Quantity:</label>
                            </div>
                            <div class="col-9">
                                <input type="number" value={quantity} placeholder='Enter quantity' class=" form-control" onChange={handleQuantityChange} />

                            </div>
                        </div>

                        <div className="d-flex justify-content-end align-items-end">
                            <button type="submit" onClick={popClose} class="btn btn-outline-primary btn-lg mx-3">{props.selectedRowData ? "Update" : "+ Add"} </button>


                        </div>



                    </form>



                </div>


        </>
    )
}

export default Shopping