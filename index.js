const express=require("express");
const app=express();
const port=8080;
const path=require("path");
const { v4: uuidv4 } = require('uuid');
const methodOverride=require("method-override");


app.use(express.urlencoded(path.join(__dirname,"public")));
app.use(express.json());
app.use(methodOverride('_method'));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"public")));

let posts=[
    {
        id:uuidv4(),
        username:"mayank",
        content:"I am study in Ms university"
    },
    {
        id:uuidv4(),
        username:"krish",
        content:"My father have a steel shop"
    },
    {
        id:uuidv4(),
        username:"abhai",
        content:"I have a 40 vigha land in keshiya"
    },
];

app.get("/posts",(req,res)=>{
    res.render("index.ejs",{posts});
});

app.get("/posts/new",(req,res)=>{
    res.render("form.ejs");
});


app.get("/posts/:id",(req,res)=>{
    let {id}=req.params;
    let post=posts.find((p)=>id===p.id);
    res.render("id.ejs",{post});
});
2
app.patch("/posts/:id",(req,res)=>{
    let {id}=req.params;
    let newcontent=req.body.content;
    let post=posts.find((p)=>id===p.id);
    post.content=newcontent;
    res.redirect("/posts");
});

app.delete("/posts/:id",(req,res)=>{
    let {id}=req.params;
    posts=posts.filter((p)=>id !=p.id);
    res.redirect("/posts");
    
});

app.get("/posts/:id/edit",(req,res)=>{
    let {id}=req.params;
    let post=posts.find((p)=>id===p.id);
    res.render("edit.ejs",{post});
});

app.post("/posts",(req,res)=>{
    let {username,content}=req.body;
    let id=uuidv4();
    posts.push({id,username,content});
    res.redirect("/posts");
});

app.listen(port,()=>{
    console.log(`listening to port ${8080}`);
});