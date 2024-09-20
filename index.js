
const { faker } = require('@faker-js/faker');const mysql = require('mysql2');
//faker helps to generate fake data automaticaaly
//mysql2 and mysql package helps to connect node with database
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require('method-override');
const {v4 : uuidv4} = require("uuid");
const port = 8080;
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
// Parse incoming request bodies (if needed)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
const connection = mysql.createConnection({
  //create connection between node and mysql
  //here connection is an object that consists various methods
    host:'localhost',
    user:'root',
    database:'delta_app',
    password:'E187@kay#'
});
let getrandomuser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};
//The connection.query method is commonly used in Node.js applications to interact with a MySQL database using the mysql or mysql2 library. This method allows you to execute SQL queries and retrieve results from the database.
//console.log(getrandomuser())
app.listen(port,(req,res)=>{
  console.log(`Listening on port no=>${port}`);
});
//update route this route updates the data been recieved into the database
app.patch("/user/:id",(req,res)=>{
      let {id} = req.params;
      //1.fetch the id of the selected user 
       let q = `Select * from users where id = '${id}'`;
       //fetch the form enetered data
       let formpass = req.body.password;
       let newusername = req.body.username;
    try{
      //based on the id fetch the database data
      connection.query(q,(err,result)=>{
        if(err)throw err;
        let user = result[0];
        //2.check if entered password is matching with database password
        if(user.password!=formpass){
          res.send("Incorrect Password!!");
        }
        else{
          //update into database
          let query2 = `update users set username = '${newusername}' where id = '${id}'`;
          connection.query(query2,(err,result)=>{
            if(err)throw err;
           //once changes are been made to the database redirect to the the main home page route.
           // res.send(result);
              res.redirect("/users");
          })
        }
        
      });
    }
    catch(err){
      console.log(err);
      res.send(`Some Error occured in DB`);
    }
});
app.get("/",(req,res)=>{
  let q = `SELECT COUNT(*) FROM users`;
  try{
     connection.query(q,(err,result)=>{
       if(err)throw err;
      let count = result[0]['COUNT(*)'];
      res.render('home',{count});
     });
  }
  catch(err){
    console.log(err);
    res.send("Some error has occured in database");
  }
  // connection.end();
});

//show route
app.get("/users",(req,res)=>{
    let q = `SELECT * FROM users`;

    try{
      connection.query(q,(err,users)=>{
        if(err)throw err;
        res.render("showusers",{users});
      });
    }
    catch(err){
      res.send("Some error has occured in database");
    }
});

//edit route this route will render the edit form
app.get("/users/:id/edit",(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM users WHERE id ='${id}'`;
    try{
      connection.query(q,(err,result)=>{
        if(err)throw err;
        else{
         
          let user = result[0];
          res.render("edit.ejs",{user})
        }
      });
    }
    catch(err){
      console.log(`Some error has occured in the database..`);;
    }
    //res.render("edit.ejs");
});
//add new user route =>renders the newuserform which collects the data of new user
app.get("/users/newuser",(req,res)=>{

     res.render('newuser.ejs');
      
});

app.post("/users/add/newuser",(req,res)=>{

       let id = uuidv4();
      //  res.send(req.body);
      //fetch the data been entered by user
       const { name, email, pass } = req.body;
       let q = 'insert into users (id,username,email,password) values (?,?,?,?)';
       let values =[]
       values.push(id);
       for(k in req.body){
          values.push(req.body[k]);
       }
       connection.query(q,values,(err,result)=>{

          try{
            if(err)throw err;
            res.send("Added Successfully!!");
          }
          catch(err){
            res.send("Encoutering some issue");
          }
       });
       
});
//delete route
app.delete("/users/:id/delete",(req,res)=>{
    let {id} = req.params;
    let q = `delete from users where id='${id}'`;
    
    connection.query(q,(err,result)=>{
      try{
        if(err)throw err;
        //req.send("Entry removed successfully from the database");
        res.redirect("/users/");
      }
    catch(err){
      console.log(err);
      res.send("Encountered some error");
    }
  })
});




//process of adding data into the db
// To run an insert query dynamically using placeholders (?,?,?,?) and an array of values in Node.js with a MySQL database (or similar databases), you typically use a database client library such as mysql2 or mysql. These libraries allow you to execute parameterized queries where placeholders are replaced by values from an array.
// let user=["123","123_newuser","abc@gmail.com","abc"];
// let f = "SELECT * FROM users";
// let data=[];
// for(let i=0;i<100;i++){
//   const user = getrandomuser(); // Get random user array
//   data.push(user);
// }
// let q = "INSERT INTO users(id,username,email,password)VALUES ?";

// try{
//   connection.query(q,[data],(err,result)=>{
//     if(err)throw err;
//     console.log(result);//here result is an array
// });
// }
// catch (err){
//   console.log(err);
