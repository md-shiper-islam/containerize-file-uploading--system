const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
const userRouter = require("./routes/useerRouter")
const fileRoutes =require('./routes/fileRoutes');


app.use("/api/user", userRouter);
app.use("/api/auth", userRouter);
app.use("/api/files", fileRoutes);

app.get("/", (req, res) => {
    res.status(200).send("Welcome to the Authentication API");
});
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Backend is healthy'
    });
});

app.use((req,res,next)=>{
   res.status(404).json({
    success:false,
    message:"Route not found"
   })
    next()
})
// app.use((err, req, res, next) => {
//   const statusCode = err.status || 500;

//   res.status(statusCode).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//   });
// });
// Global Error Handler - এটা সব route এর পরে বসাও
app.use((err, req, res, next) => {
  console.error('❌ ERROR DETAILS:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});
 

module.exports = app;