const http = require('http');
const PORT = 3000;
const url = require('url');
const fs = require('fs');
const querystring = require('querystring');
const {MongoClient} = require('mongodb');

const server = http.createServer( async (req,res) => {

    let client = new MongoClient('mongodb://localhost:27017');

    async function connect(){
        try {
            await client.connect();
            console.log("Database connection established")
        } catch (error) {
            console.log("error : ",error)
        }
    }

    connect();
    let db = client.db("dms1");
    let collection = db.collection("users1")

    const req_url = req.url;
    console.log("req_url : ",req_url);

    const parsed_url = url.parse(req_url);
    console.log("parsed_url : ",parsed_url);

    if(parsed_url.pathname === '/'){
        //serve the html file on root request
    
        res.writeHead(200,{'Content-Type' : 'text/html'});
        res.end(fs.readFileSync('../client/index.html'));
    }
    
    if(parsed_url.pathname === '/adduser.html'){
        //serve the html file on root request
    
        res.writeHead(200,{'Content-Type' : 'text/html'});
        res.end(fs.readFileSync('../client/adduser.html'));
    }
    
    if(parsed_url.pathname === '/view.html'){    
        res.writeHead(200,{'Content-Type' : 'text/html'});
        res.end(fs.readFileSync('../client/view.html'));
    }
    if(parsed_url.pathname === '/images'){    
        res.writeHead(200,{'Content-Type' : 'text/images'});
        res.end(fs.readFileSync('../client/images'));
    }
    
    else if(parsed_url.pathname === '/style.css'){
        res.writeHead(200,{'Content-Type' : 'text/css'});
        res.end(fs.readFileSync('../client/style.css'));
    }
    
    else if(parsed_url.pathname === '/script.js'){
        res.writeHead(200,{'Content-Type' : 'text/javascript'});
        res.end(fs.readFileSync('../client/script.js'));
    }
    
    else if(parsed_url.pathname === '/submit'  &&  req.method === 'POST'){
        console.log("reached here");

        let body = '';

        req.on('data',(chunks)=> {
            console.log("chunks : ",chunks);
            body += chunks.toString();
        });

        req.on('end',()=>{
           
            console.log("body : ",body)
       
        
        let datas = JSON.parse(body);
        console.log("datas7 : ",datas);
         let id = datas.id;
         let title = datas.title;
         let description = datas.description;
         let category = datas.category
         let price = datas.price;
         let imageurl = datas.imageurl;
         let ratingrate = datas.ratingrate;
         let ratingcount = datas.ratingcount;

        console.log("datas :",datas.id)
        console.log("datas :",datas.title)
        console.log("datas :",datas.description)
        console.log("category : ",category)
        console.log("datas :",datas.price)
        console.log("datas :",datas.imageurl)
        console.log("datas :",datas.ratingrate)
        console.log("datas :",datas.ratingcount)

        if(!id){
            res.writeHead(400,{'Content-Type' : 'text/plain'});
            res.end("invalid id");
            return;
        }
        if(!title){
            res.writeHead(400,{'Content-Type' : 'text/plain'});
            res.end("invalid title");
            return;
        }
        if(!description){
            res.writeHead(400,{'Content-Type' : 'text/plain'});
            res.end("invalid description");
            return;
        }
        if(!category){
            res.writeHead(400,{'Content-Type' : 'text/plain'});
            res.end("invalid category");
            return;
        }
        if(!price){
            res.writeHead(400,{'Content-Type' : 'text/plain'});
            res.end("invalid price");
            return;
        }
        if(!imageurl){
            res.writeHead(400,{'Content-Type' : 'text/plain'});
            res.end("invalid imageurl");
            return;
        }
        if(!ratingrate){
            res.writeHead(400,{'Content-Type' : 'text/plain'});
            res.end("invalid ratingrate");
            return;
        }
        if(!ratingcount){
            res.writeHead(400,{'Content-Type' : 'text/plain'});
            res.end("invalid ratingcount");
            return;
        }
        collection.insertOne({
            id : datas.id,
            title : datas.title,
            description: datas.description,
            category : datas.category,
            price: datas.price,
            imageurl: datas.imageurl,
            ratingrate: datas.ratingrate,
            ratingcount: datas.ratingcount,
            
        })
        .then((message) => {
            console.log("message :",message);
            res.writeHead(201,{'COntent-Type' : "text/plain"});
            res.end("User created Succesfully");
        })
        .catch((error) => {
            console.log("error : ",error);

            res.writeHead(400,{'Content-Type' : "text/plain"});
            res.end(error.message  ? error.message : "User creation failed");
        })

    });

    }
    else if (parsed_url.pathname === '/submit' && req.method === 'GET') {
       
        // let db = client.db("dms1");
        // let collection = db.collection("users1");

        let userDatas = await  collection.find().toArray();
        console.log("userDatas : ",userDatas);

        let json_datas = JSON.stringify(userDatas);
        console.log("json_datas : ",json_datas);

        res.writeHead(200,{'Content-Type' : "text/json"});
        res.end(json_datas);
    }

})
server.listen(PORT, () =>{
    console.log(`server running at http://localhost:${PORT}`)
});