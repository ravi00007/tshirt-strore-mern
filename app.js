require("dotenv").config();
const express =  require('express');
const mongooose =  require('mongoose');
const bodyParser =  require('body-parser');
const cookieParser =  require('cookie-parser');
const cors =  require('cors');
const PORT = 8000;
const app =  express();
const authRoute =  require('./routes/auth')
const userRoute =  require('./routes/user');


mongooose.connect(process.env.DATABASE,{
useNewUrlParser: true,
useUnifiedTopology:true,
useCreateIndex: true
})
.then(()=>{
    console.log('Database Connected')
})
.catch((e)=>{
    console.log(e)
})
// middleware
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json())

//my routes

app.use('/api',authRoute)
app.use('/api',userRoute)

app.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`)
})

