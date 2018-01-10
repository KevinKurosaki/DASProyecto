var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var method_override = require("method-override");
var web_password = "kevin"

var web = express();

mongoose.connect("mongodb://localhost/seriesdb");

web.use(bodyParser.json());
web.use(bodyParser.urlencoded({extended: true}));
web.use(method_override("_method"));

var esquemadb = {
	titulo:String,
	descrip:String,
	imagenUrl:String,
	nota:Number
}

var Producto = mongoose.model("Producto", esquemadb);

web.set("view engine","jade");

web.use(express.static("public"));

/*web.get("/", function(req,res){
	
	res.render("index");
});
*/

web.post('/', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	if (username == null || password == null || (username != null && password != web_password))
		res.redirect('/')
	else
		res.render('index', { username: username, password:password });
});

web.get('/', function(req, res) {
	var username = req.param("username");
	var password = req.param(web_password);
	if (username == null || password == null || (username != null && password != web_password))
		res.redirect('/')
	else
		res.render('index', { username: username, password:password });
});

web.get("/menu",function(req,res){
	Producto.find(function(error,doc){
		if(error){console.log(error);}
		res.render("menu/index",{productos: doc})
	});
});

web.get("/menu/edit/:id",function(req,res){
	var id_producto = req.params.id;
	Producto.findOne({_id: id_producto},function(error,product){
		console.log(product);
		res.render("menu/edit",{producto: product});
	});
});

web.put("/menu/:id",function(req,res){
	if(req.body.password == web_password){
		var data={
		titulo: req.body.titulo,
		descrip: req.body.descrip,
		nota: req.body.nota
		};
		Producto.update({"_id": req.params.id},data,function(producto){
		res.redirect("/menu");
	})
	}else{
		res.redirect("/");
	}
});

web.get("/admin",function(req,res){
	res.render("admin/formulario")
});

web.post("/admin",function(req,res){
	if(req.body.password == web_password){
		Producto.find(function(error,doc){
		if(error){console.log(error);}
		res.render("admin/index",{productos: doc})
	});
	}else{
		res.redirect("/");
	}
});


web.post("/menu",function(req,res){
	//console.log(req.bodyParser);
	if(req.body.password == web_password){
	
	var data={
		titulo: req.body.titulo,
		descrip: req.body.descrip,
		nota: req.body.nota
	}
	
	var producto = new Producto(data);
	
	producto.save(function(err){
		console.log(producto);
		res.render("index");
	});

	//res.render("menu/new");
	}else{
	res.render("menu/new");
	}
});

web.get("/menu/delete/:id",function(req,res){
	var id= req.params.id;
	Producto.findOne({"_id": id},function(error,producto){
		res.render("menu/delete",{producto: producto})
	});
});

web.delete("/menu/:id",function(req,res){
	var id= req.params.id;
	if(req.body.password == web_password){
		Producto.remove({"_id": id},function(error){
			if(error){console.log(error);}
			res.redirect("/menu");
		});
	}else{
		res.redirect("/menu");
	}
});

web.get("/menu/new",function(req,res){
	res.render("menu/new");
});

web.listen(3000);