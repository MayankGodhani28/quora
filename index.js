const { faker } = require('@faker-js/faker');
const mysql=require("mysql2");
const express=require("express");
const app=express();
const path=require("path");
const methodOverride=require("method-override");

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));
// app.use(methodOverride("method-override"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password:"Mayank@281005"
  });

let getRandomUser=()=>{
    return [
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password()
    ];
  };

app.get("/",(req,res)=>{
  let data="SELECT COUNT(*) FROM USERS";
  try{
    connection.query(data,(err,result)=>{
      if(err) throw err;
      console.log(result);
      let count=result[0]["COUNT(*)"];
      res.render("home.ejs",{count});
    });
  }catch(err){
    console.log(err);
    res.send("somthing wrong in database");
  }
  
});

app.get("/users",(req,res)=>{
  let q="SELECT * FROM USERS";
  try{
    connection.query(q,(err,users)=>{
      if(err) throw err;
      res.render("showUsers.ejs",{users});
    });
  }catch(err){
    res.send("somthing wrong in database");
    console.log(err);
  }
});

app.get("/users/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM users WHERE id='${id}'`;
  try{
    connection.query(q,(err,users)=>{
      if(err) throw err;
      let user=users[0];
      res.render("edit.ejs",{user});
    });
  }catch(err){
    console.log(err);
    res.send("err in db");
  }
});

app.patch("/users/:id",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM users WHERE id='${id}'`;
  let {password:pass,username:newUser}=req.body;
  try{
    connection.query(q,(err,result)=>{
      if(err) throw err;
      let user=result[0];
      if(pass == user.password){
        let q=`UPDATE users SET username='${newUser}' WHERE id='${id}'`;
        try{
          connection.query(q,(err,result)=>{
            if(err) throw err;
            res.redirect("/users");
          });
        }catch(err){
          res.send("somthig wrong");
        }
        
      }else{
        res.send("wrongpass");
      }
      
    });
  }catch(err){
    console.log(err);
    res.send("err in db");
  }
});

app.get("/users/new",(req,res)=>{
  res.render("add.ejs");
});

app.post("/users/new",(req,res)=>{
  let {id,username,email,password}=req.body;
  let q=`INSERT INTO users (id,username,email,password) VALUES ("${id}","${username}","${email}","${password}")`;
  try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        res.redirect("/users");
      });
    }
  catch(err){
      console.log(err);
      res.send("err in db");
    }
});

app.delete("/users/:id",(req,res)=>{
  let {id}=req.params;
  let q=`DELETE FROM users WHERE id='${id}'`;
  try{
      connection.query(q,(err,result)=>{
        if(err) throw err;
        res.redirect("/users");  
      }); 
    }
  catch(err){
      console.log(err);
    }
});

app.listen("8080",()=>{
  console.log("server is listening to 8080");
});
