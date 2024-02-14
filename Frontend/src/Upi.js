// import QRCode from 'qrcode.react';
// import Header from './Header'
// import {  useNavigate ,useLocation} from 'react-router-dom';



// function Upi(props) {

//     const navigate = useNavigate();
//     const location = useLocation();
//     const { data } = location.state || {};


//     const {selectedOption,date,paymentType,grandTotal} = data;


//     const onBack = () => {
    
//         navigate("/checkout");
    
//     }
//     const paymentCompleted=()=>{

//         const exportData={
//             selectedOption,date,paymentType,grandTotal
//         }
//         fetch('http://localhost:8083/payment', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(exportData),
//         })
//             .then(response => response.json())
//             .then(data => {
//                 console.log(data.message);

                
//                 // resetDataAndGrandTotal();
//             })
//             .catch(error => {
//                 console.error('Error to pay:', error);
//             });

//             setupishow(false)
//             setcheckoutshow(true)
//     }


//     return (
//         <>
//         <Header />
//         <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
//             <QRCode style={{height:"500px",width:"500px",marginTop:"100px"}} value={"shiva"} />
//             <button type="button" class="btn btn-info btn-lg mt-5" onClick={onBack}>Back</button>
//             <button type="button" class="btn btn-info btn-lg mt-5" onClick={paymentCompleted}>paymentCompleted</button>
//         </div>
//         </>
//     )
// }
// export default Upi