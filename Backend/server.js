const express =require('express');
const mysql=require('mysql');
const cors=require('cors')
const bodyParser = require('body-parser');

const twilio = require('twilio');


const app=express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());

const db= mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"",
    database:'test'
})

const accountSid = 'ACbe1cefd85043cadbae555c64b28027e4';
const authToken = 'fc627d2471903bea90356c10bf3302bb';
const client = twilio(accountSid, authToken);


const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};


app.post('/send-otp', async (req, res) => {
    const { mobileNumber } = req.body;
    console.log(mobileNumber)
    const otp = generateOTP();
  
    try {
      await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: '+12055519344',
        to: `+91${mobileNumber}`,
      });
  
      db.query('INSERT INTO otp_data (mobileNumber, otp) VALUES (?, ?)', [mobileNumber, otp], (error) => {
        if (error) {
          console.error('Error storing OTP in database:', error);
          res.status(500).send('Failed to send OTP');
        } 
        else {
          res.status(200).send('OTP sent successfully');
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Failed to send OTP');
    }
  });
  
  app.post('/verify-otp', (req, res) => {
    const { mobileNumber, enteredOTP } = req.body;
  
    db.query('SELECT otp FROM otp_data WHERE mobileNumber = ? ORDER BY id DESC LIMIT 1', [mobileNumber], (err, rows) => {
      if (err) {
        console.error('Error retrieving OTP from database:', err);
        res.status(500).send('Internal Server Error');
      }
       else if (rows.length > 0 && rows[0].otp === enteredOTP) {
        res.status(200).send('OTP verified successfully');
      } else {
        res.status(400).send('Invalid OTP');
      }
    });
  });

  



app.get('/customer',(req,res)=>{
    const sql="SELECT  * FROM customer";
    db.query(sql,(err,data)=>{
        // console.log(err);
        // console.log(data);
        if(err) return res.json(err);
        return res.json(data)
    })
})


app.get('/getpayment',(req,res)=>{
  const sql="SELECT  * FROM payment";
  db.query(sql,(err,data)=>{
      // console.log(err);
      // console.log(data);
      if(err) return res.json(err);
      return res.json(data)
  })
})


app.get('/product',(req,res)=>{
    const sql="SELECT  * FROM product";
    db.query(sql,(err,data)=>{
        // console.log(err);
        // console.log(data);
        if(err) return res.json(err);
        return res.json(data)
    })
})


// app.get('/items',(req,res)=>{
//     const name = req.params.name;
//     const sql="SELECT  * FROM items";
    
//     db.query(sql,(err,data)=>{
//         // console.log(err);
//         // console.log(data);
//         if(err) return res.json(err);
//         return res.json(data)
//     })
// })

app.get('/items/:name', (req, res) => {
  const name = req.params.name; 

  if (!name) {
      return res.status(400).json({ message: 'Name parameter is required' });
  }

  const sql = "SELECT * FROM items WHERE `name` = ?";

  db.query(sql, [name], (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
      }

      return res.json(data);
  });
});


app.get('/salesByName/:name', (req, res) => {
  const name = req.params.name; 

  if (!name) {
      return res.status(400).json({ message: 'Name parameter is required' });
  }

  const sql = "SELECT * FROM sales WHERE `name` = ?";

  db.query(sql, [name], (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
      }

      return res.json(data);
  });
});

app.get('/salesByDate/:date', (req, res) => {
  const date = req.params.date; 
  // console.log(date)

  if (!date) {
      return res.status(400).json({ message: 'Date parameter is required' });
  }

  const sql = "SELECT * FROM sales WHERE `date` = ?";

  db.query(sql, [date], (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
      }

      return res.json(data);
  });
});

app.get('/cashReport/:cashDate', (req, res) => {
  const cashDate = req.params.cashDate; 
  // console.log(cashDate)

  if (!cashDate) {
      return res.status(400).json({ message: 'Date parameter is required' });
  }

  const sql = "SELECT * FROM cashTable WHERE `date` = ?";

  db.query(sql, [cashDate], (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
      }

      return res.json(data);
  });
});



app.get('/reportBypayment/:payment', (req, res) => {
  const payment = req.params.payment; 
  // console.log(payment)

  if (!payment) {
      return res.status(400).json({ message: 'paymentType parameter is required' });
  }

  const sql = "SELECT * FROM payment WHERE `paymentType` = ?";

  db.query(sql, [payment], (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
      }

      return res.json(data);
      
  });
});


app.get('/salesByProductName/:productName', (req, res) => {
  const productName = req.params.productName; 
  // console.log(productName)

  if (!productName) {
      return res.status(400).json({ message: 'productName parameter is required' });
  }

  const sql = "SELECT * FROM sales WHERE `productName` = ?";

  db.query(sql, [productName], (err, data) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
      }

      return res.json(data);
  });
});
app.delete('/items/:id', (req, res) => {
  const itemId = parseInt(req.params.id);

  const sql="DELETE FROM items WHERE `itemId`=?";
  db.query(sql, [itemId], (err, data) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    return res.json(data);
});
  
});

app.delete('/deleteItems/:selectedOption', (req, res) => {
  const { selectedOption } = req.params;

  const sql="DELETE FROM items WHERE `name`=?";
  db.query(sql, [selectedOption], (err, data) => {
    if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    return res.json(data);
});

});

app.post("/addCustomer",(req,res)=>{
    const { name, address, contactNo } = req.body;
    const sql="INSERT INTO customer (`name`,`address`,`contactNo`) VALUES (?,?,?)";
    const values = [name, address, contactNo];

    db.query(sql,values,(err,result)=>{
        if (err) return res.json(err)
        return res.json(result)
    })
})

app.post('/createUser', (req, res) => {
    const { username, password } = req.body;
    const sql="INSERT INTO users (`username`,`password`) VALUES (?,?)";
    const values = [username, password];

    db.query(sql,values,(err,result)=>{
        if (err) return res.json(err)
        return res.json(result)
    })
   
  });


  app.post('/validate-login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    const values = [username, password];
  
    db.query(query, values, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).json({ error_msg: 'Internal Server Error' });
        return;
      }
  
      if (results.length > 0) {
        res.status(200).json({ results,message: 'Login successful', jwt_token: 'abcde' });
      } else {
        res.status(401).json({ error_msg: 'Invalid credentials' });
      }
    });
  });
  
  

app.post("/addproduct",(req,res)=>{
    const { productName, price,quantity, mfd } = req.body;
    console.log("Received data:", req.body);
    const sql="INSERT INTO product (`productName`,`price`,`quantity`,`mfd`) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)";
    const values = [productName, price,quantity, mfd];

    db.query(sql,values,(err,result)=>{
        if (err) return res.json(err)
        return res.json(result)
    })
})

app.post("/exportToSales", (req, res) => {
  const itemsArray = req.body;

  itemsArray.forEach(item => {
      const { selectedOption, date, productName, price, quantity, total_amount } = item;
      console.log("Received data:", item);

      const sql = "INSERT INTO sales (`name`, `date`, `productName`, `price`, `quantity`, `Total_Amount`) VALUES (?,?,?,?,?,?)";
      const values = [selectedOption, date, productName, price, quantity, total_amount];
      console.log(values);

      db.query(sql, values, (err, result) => {
          if (err) console.error(err);
          else console.log("Data inserted into sales table:", result);
      });
  });

  return res.json({ message: 'Data inserted into sales table successfully' });
});

app.post("/payment",(req,res)=>{
  const { selectedOption, date,paymentType, grandTotal } = req.body;
  // console.log("Received data:", req.body);
  const sql="INSERT INTO payment (`Name`,`Date`,`paymentType`,`Amount`) VALUES (?,?,?,?)";
  const values = [selectedOption, date,paymentType, grandTotal];

  db.query(sql,values,(err,result)=>{
      if (err) return res.json(err)
      return res.json(result)
  })
})

app.post('/cashCompleted', (req, res) => {
  const { selectedOption,date, grandTotal, denominations } = req.body;

  const sql = `
    INSERT INTO cashTable (name,date, grandTotal, twothousandnotes, fiveHundrednotes, twoHundrednotes, hundrednotes,fiftyNotes,twentynotes,tenNotes,fiverupees,tworupees,onerupees)
    VALUES (?,?, ?, ?, ?, ?, ?,?,?,?,?,?,?)
  `;

  const values = [selectedOption,date, grandTotal, denominations['2000notes'], denominations['500notes'], denominations['200notes'], denominations['100notes'],denominations['50notes'],denominations['20notes'],denominations['10notes'],denominations['5rupees'],denominations['2rupees'],denominations['1rupees']];
  console.log(values)
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting cash completed data:', err);
      res.status(500).json({ message: 'Error inserting cash completed data' });
      return;
    }

    console.log('Cash completed data inserted successfully');
    res.json({ message: 'Cash completed data inserted successfully' });
  });
});


app.put('/deductProductQuantity', (req, res) => {
  const { productName, quantity } = req.body;
  
  const sql='UPDATE product SET `quantity`= quantity - ? where productName=?'

  console.log(productName,quantity)
  db.query(sql,[quantity,productName],(err,result)=>{
      if(err) return res.json({Meassage:"Error inside server"});
      return res.json(result)
      
  })


});
app.put('/addProductQuantity', (req, res) => {
  const { productName, quantity } = req.body;
  
  const sql='UPDATE product SET `quantity`= quantity + ? where productName=?'

  console.log(productName,quantity)
  db.query(sql,[quantity,productName],(err,result)=>{
      if(err) return res.json({Meassage:"Error inside server"});
      return res.json(result)
      
  })


});

app.post("/addItems",(req,res)=>{
    const {name,date, productName, price, quantity } = req.body;
    let actprice = parseInt(req.body.price);
    let quant = parseInt(req.body.quantity);
    let ttl = actprice*quant;
    console.log("Received data:", req.body);


    const sql="INSERT INTO items (`name`, `date`,`productName`,`price`,`quantity`,`Total_Amount`) VALUES (?,?,?,?,?,?)";
    const values = [ name, date,productName, price, quantity,ttl ];
    console.log(values)

    db.query(sql,values,(err,result)=>{
        if (err) return res.json(err)
        return res.json(result)
    })
})

app.put("/addItems/:id",(req,res)=>{
  const sql='UPDATE items SET `name`=? , `productName`=? ,`price`=? ,`quantity`=?,`Total_Amount`=? where itemId=?'
  const id =req.params.id
  let actprice = parseInt(req.body.price);
  let quant = parseInt(req.body.quantity);
  let ttl = actprice*quant;

  console.log(req.body.name,req.body.productName,req.body.price,req.body.quantity,ttl,id)
  db.query(sql,[req.body.name,req.body.productName,req.body.price,req.body.quantity,ttl,id],(err,result)=>{
      if(err) return res.json({Meassage:"Error inside server"});
      return res.json(result)
  })
})





app.post("/addMainproduct",(req,res)=>{
    const { comapanyId, companyName, productId,productName, TechnicalName, hnc, Weight, Batch, mfg, expired, Quantity, Rate, Price, GST,invoiceNumber } = req.body;
    console.log("Received data:", req.body);
    const sql="INSERT INTO Mainproduct (`comapanyId`, `companyName`, `productId`,`productName`, `TechnicalName`, `hnc`, `Weight`, `Batch`, `mfg`, `expired`, `Quantity`, `Rate`, `Price`, `GST`,`invoiceNumber`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const values = [comapanyId, companyName, productId,productName, TechnicalName, hnc, Weight, Batch, mfg, expired, Quantity, Rate, Price, GST,invoiceNumber];

    db.query(sql,values,(err,result)=>{
        if (err) return res.json(err)
        return res.json(result)
    })
})

app.post("/addcompanies",(req,res)=>{
    const {comapanyName} = req.body;
    console.log("Received data:", req.body);
    const sql="INSERT INTO companies ( `comapanyName`) VALUES (?)";
    const values = [comapanyName];

    db.query(sql,values,(err,result)=>{
        if (err) return res.json(err)
        return res.json(result)
    })
})



app.get('/mainproducts',(req,res)=>{
    const sql="SELECT  * FROM Mainproduct";
    db.query(sql,(err,data)=>{
        // console.log(err);
        // console.log(data);
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.get('/companies',(req,res)=>{
    const sql="SELECT  * FROM companies";
    db.query(sql,(err,data)=>{
        // console.log(err);
        // console.log(data);
        if(err) return res.json(err);
        return res.json(data)
    })
})

app.listen(8083,()=>{
    console.log("listening on 8083")
})