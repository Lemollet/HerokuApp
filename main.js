const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const mongoURL = 'mongodb+srv://Moy1234:Moy1234@firstdb-5axkr.mongodb.net/test?retryWrites=true&w=majority';
const {User} = require('./models/user');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

mongoose.connect(mongoURL, {useNewUrlParser: true}, (err) => {
    if (!err) {
        console.log('todo chido en mongo...!!');  
    } 
});
//const URL = 'http://68.183.153.133:1919/parse/classes'

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('<h1> Heroku APP </h1>');
})

// app.get(`/Campaign/${id}`, (req, res) => {

// })

app.get('/users', (req, res) => {
    User.find().exec((err, user) => {
        if(err) {
            return res.status(404).json({message: 'Usuarios no encontrados'});
        } else {
            return res.status(200).json({user});
        }
    })
});

app.post('/new/user', (req, res) => {
    const params = req.body;
    if (params.email && params.userName && params.password) {
        User.findOne({ email: params.email }).exec((err, user) => {
            if (err) {
                return res.status(500).json({ err: 'Ocurrio un error' })
            } else if (user) {
                return res.status(200).json({ message: 'el email esta en uso' })
            } else {
                let newUser = User({
                    userName: params.userName,
                    email: params.email,
                    password: params.password
                });
                newUser.save((err, user) => {
                    if (err) {
                        res.status(500).json({ message: 'Ocurrio un error' });
                    } else if (user) {
                        res.status(201).send({ data: params });
                    }
                });
            }
        });
    } else {
        res.status(400).json({ message: ' eres tonto ?' })
    }
});

app.post('/login', (req, res) => {
    let params = req.body
    if( params.email && params.password) {
        User.findOne({email: params.email}).exec((err, user) => {
            if (err) {
                console.log(err);
                res.send(err);
            } if (user) {
                if(user.password === params.password){
                    console.log('Encontro usuario', user);
                    res.send(user);
                } else {
                    res.status(404).send({message: 'Usuario o contraseña incorrectos'});
                }
            } else {
                res.status(404).json({message: 'no se encontro el email'});
            }
        });
    } else {
        res.status(404).json({message: 'no enviaste datos'});
    }
});


app.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`); 
});