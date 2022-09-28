let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');
const req = require('express/lib/request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//homepage route
app.get('/',(req,res) => {
    return res.send({
        error: false,
        message: 'Welcome to RESTful RUD API with NodeJS, Epress, MySQL',
        written_by: 'Athasart',
        publicshed_on: 'https://milerdev.dev'
    })
})

//connection to MySQL database

let dbCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_api'
});
dbCon.connect();

//retrieve all books
app.get('/books', (req, res) => {
    dbCon.query('SELECT * FROM books', (error, results, fields) => {
        if(error) throw error;

        let message = "";
        if(results === undefined || results.length == 0) {
            message = "Book table is empty";
        } else {
            message = "Successfully retrieved all books";
        }
        return res.send({error: false, data: results, message: message})
    })
});

//Retieve books by id
app.get('/book/:id', (req, res) => {
    let id = req.params.id;

    if(!id){
        return res.status(400).send({error: true, message: "Please privide book id"});
    } else {
        dbCon.query('SELECT * FROM books WHERE id = ?', id, (error, results, fields) => {
            if(error) throw error;

            let message = "";
            if(results === undefined || results.length == 0) {
                message = "Book not found";
            } else {
                message = "Successfully retrieved book data";
            }
            return res.send({error: false, data: results[0], message: message})
        })
    }   
});

//Update book with id

app.put('/book', (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let author = req.body.author;

    //Validation
    if (!id || !name || !author){
        return res.status(400).send({error: true, message: "Please provide book id, name and author."});
    } else {
        dbCon.query('UPDATE books SET name = ?, author = ? WHERE id = ?', [name, author, id], (error, results, fields) => {
            if(error) throw error;

            let message ="";
            if (results.changeRows === 0){
                message = "Book not found or data ars same";
            } else {
                message = "Book successfully updated";
            }
            return res.send({error: false, data: results, message: "Book successfully added"})
        })
    }
});

//Add a new book
app.post('/book', (req, res) => {
    let name = req.body.name;
    let author = req.body.author;

    //validation
    if (!name || !author){
        return res.status(400).send({error: true, message: "Please provide book name and author."});
    } else {
        dbCon.query('INSERT INTO books (name, author) VALUE(?, ?)', [name, author], (error, results, fields) => {
            if(error) throw error;
            return res.send({error: false, data: results, message: "Book successfully added"})
        })
    }
});

//Delete book by id
app.delete('/book', (req, res) => {
    let id = req.body.id;

    if(!id){
        return res.status(400).send({error: true, message: "Please provide book id"});
    } else {
        dbCon.query('DELETE FROM books WHERE id = ?', [id], (error, results, fields) => {
            if(error) throw error;

            let message = "";
            if(results.affectedRows === 0){
                message = "Book not found";
            } else{
                message = "Book successfully deleted";
            }
            return res.send({error:false, data: results, message: message})
        })
    }
});


app.listen(3000, () => {
    console.log('Node App is Running on Port 3000');
});

module.exports = app;
