const express = require("express");

const app = express();
const port = process.env.PORT || 3000;
const ejs = require("ejs");
const mysql = require('mysql');
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);
const res = require("express/lib/response");
const passport = require('passport');
const localStrategy = require('passport-local')
const facebookStrategy = require('passport-facebook')
const twitterStrategy = require('passport-twitter')
const googleStrategy = require('passport-google-oauth20')
const session = require('express-session');
const { response } = require("express");
const { status } = require("express/lib/response");
const { flash } = require('express-flash-message');
const http = require("http")
const server = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(server);


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'avto_delavnica'
})
connection.connect()


app.set('view engine', 'ejs');
app.use('/public', express.static(__dirname + "/public"));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/popper/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/socket.io/dist/')); // redirect JS jQuery

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap


app.use(express.urlencoded({
    extended: true
}))
app.use(session({
    secret: "ekipa1itk",
    resave: false,
    saveUninitialized: false
}))
app.use(flash({ sessionKeyName: 'flashMessage' }));


passport.use(new localStrategy(function verify(username, password, cb) {
    connection.query("SELECT * from users where email = ?", [username], (err, rows, fields) => {
        if (err) { return cb(err) }
        else if (rows == undefined || rows == null || rows.length == 0) { return cb(null, false, { "message": "Napačni email ali geslo." }) }
        else {
            bcrypt.compare(password, rows[0].password, (err, res) => {
                if (err) { return cb(err) }
                if (!res) { return cb(null, false, { "message": "Napačni email ali geslo" }) }
                return cb(null, rows[0])
            })
        }
    })
}))
passport.use(new facebookStrategy({
    clientID: "310956854549382",
    clientSecret: "5c31cb3a6965a927058f13422c7976b1",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        connection.query('SELECT * FROM users where facebook_id = ?', [profile.id], (err, rows, fields) => {
            if (err) { res.send(err); return }
            //if user doesn't exist in the database, create him and then log him in
            else if (rows == undefined || rows == null || rows.length == 0) {
                let data = profile.displayName.split(' ')
                let pfname = data[0]
                let plname = data[1]
                //since facebook returns only displayname and facebook id, we'll have to do with that data for auth
                console.log(pfname)
                console.log(plname)
                connection.query(`INSERT INTO users(firstname,lastname,facebook_id) VALUES ('${pfname}','${plname}','${profile.id}')`, (err, rows, fields) => {
                    if (err) { console.log(err); res.send(err); return; }
                    else {
                        let user = {
                            id: rows.insertId,
                            email: null
                        }
                        return cb(null, user)
                    }
                })
            }
            //if user exists, just log him in
            else {
                console.log('logging in')
                let user = {
                    id: rows[0].id,
                    email: rows[0].email
                }
                return cb(null, user)
            }
        })
    }
));
passport.use(new twitterStrategy({
    consumerKey: "MV9EUlFKOFhib1hRdUh4V0duanQ6MTpjaQ",
    consumerSecret: "CEewSONp88_zcOTI9-tVzj62uk267Lcvmg83ZChNFwEwN06Bar",
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
},
    function (token, tokenSecret, profile, cb) {
        console.log(profile)
    }
));
passport.use(new googleStrategy({
    clientID: "794101817159-te81vq95m1gmor1fmf7fvvjljo7qkcs1.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, cb) {
        connection.query('SELECT * FROM users where google_id = ?', [profile.id], (err, rows, fields) => {
            if (err) { res.send(err); return }
            //if user doesn't exist in the database, create him and then log him in
            else if (rows == undefined || rows == null || rows.length == 0) {
                let data = profile.displayName.split(' ')
                let pfname = data[0]
                let plname = data[1]
                //since facebook returns only displayname and facebook id, we'll have to do with that data for auth
                console.log(pfname)
                console.log(plname)
                connection.query(`INSERT INTO users(firstname,lastname,google_id) VALUES ('${pfname}','${plname}','${profile.id}')`, (err, rows, fields) => {
                    if (err) { console.log(err); res.send(err); return; }
                    else {
                        let user = {
                            id: rows.insertId,
                            email: null
                        }
                        return cb(null, user)
                    }
                })
            }
            //if user exists, just log him in
            else {
                console.log('logging in')
                let user = {
                    id: rows[0].id,
                    email: rows[0].email
                }
                return cb(null, user)
            }
        })
        console.log(profile)

        // localStorage.setItem('userID', btoa(profile.id))
        // console.log(localStorage.getItem('userID')) 
        // console.log(atob(localStorage.getItem('userID')))
    }
));
passport.serializeUser((user, cb) => {

    connection.query('SELECT * FROM users where id = ?', [user.id], (err, rows, fields) => {
        process.nextTick(() => {
            cb(null, { id: rows[0].id, firstname: rows[0].firstname, lastname: rows[0].lastname, email: rows[0].email, role_id: rows[0].role_id, car_service_id: rows[0].car_service_id })
        })
    })
})
passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user)
    })
})
app.use(passport.authenticate('session'))

app.use(function (req, res, next) {
    res.locals.active = req.url
    res.locals.user = req.user;
    res.locals.active = req.path.split('/')[1] // [0] will be empty since routes start with '/'
    next();
});
app.get('/', (req, res) => {
    if (req.user) {
        if (req.user.role_id == 1) {
            res.render('pages/index');
        }
        else if (req.user.role_id == 2) {
            res.redirect("/dealership")
        }
        else if (req.user.role_id == 3) {
            res.redirect("/moderator")
        }
        else if (req.user.role_id == 4) {
            res.redirect("/admin")
        }
        else {
            res.redirect("/mechanic")
        }
    }
    else {
        res.render('pages/index');

    }
})
app.get('/login', async (req, res) => {
    const messages = await req.consumeFlash('error')
    res.render('pages/login', { messages });
})
app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: "Napacni e-naslov ali geslo"
}))
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });
app.get('/auth/facebook', (req, res) => {
    passport.authenticate('facebook')
})
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/')
})
app.get('/auth/twitter',
    passport.authenticate('twitter'))
app.get('/auth/twitter/callback',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

app.get('/register', async (req, res) => {
    const messages = await req.consumeFlash('error')
    console.log(messages)
    res.render('pages/register', { messages });
})
app.post('/register', (req, res) => {
    let user = {
        "email": req.body.email,
        "password": req.body.password
    }
    connection.query("SELECT * FROM users where email = ?", [user.email], (err, rows, fields) => {
        if (err) {
            res.send(err)
        }
        else {
            if (rows.length != 0) {
                req.flash("error", "Uporabnik s tem naslovom ze obstaja.")
                res.redirect("/register")
            }
            else {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    connection.query("INSERT INTO users(email,password) VALUES (?,?)", [user.email, hash], (err, rows, fields) => {
                        if (err) { res.send(err); return }
                        user = {
                            id: rows.insertId,
                            email: req.body.email
                        }
                        req.login(user, function (err) {
                            if (err) { res.send(err); return }
                            res.redirect('/setup')
                        })
                    })
                })
            }
        }
    })

})
app.get("/registerDealership", async (req, res) => {
    const messages = await req.consumeFlash('error')
    console.log(messages)
    res.render('pages/registerDealership', { messages });
})
app.post("/registerDealership", (req, res) => {
    let data = req.body
    let dealership = {
        name: data.name,
        isLicenced: (data.isLicenced == "on") ? 1 : 0,
        maxCapacity: data.maxCapacity,
        phone: data.phone,
        email: data.email
    }
    let address = {
        street: data.street,
        city: data.city,
        zipcode: data.zipcode,
        country: data.country,
        street_number: data.street_number
    }
    console.log(dealership)
    console.log(address)
    let hash = bcrypt.hash(dealership.name.toLowerCase(), salt, (err, hashed) => {
        if (err) {
            console.log("error while hashing")
            console.log(err)
        }
        connection.query(`SELECT * FROM addresses
            where street = '${address.street}' AND city = '${address.city}' and zipcode = ${address.zipcode} AND country = '${address.country}' AND street_number = '${address.street_number}' `, (err, rows, fields) => {
            if (err) {
                req.flash("error", "Napaka pri iskanju naslova.")
                console.log(err)
            }
            else {
                if (rows.length > 0) {
                    console.log("address exists")
                    let address_id = rows[0].id
                    connection.query(`INSERT INTO car_services(name,isLicenced,maxCapacity,phone,email,address_id) VALUES ('${dealership.name}',${dealership.isLicenced},${dealership.maxCapacity},'${dealership.phone}','${dealership.email}',${address_id})`, (err, rows, fields) => {
                        if (err) {
                            req.flash("error", "Prislo je do napake pri ustvarjanju delanice s ze obstojecim naslovom.")
                            res.redirect("/registerDealership")
                            return
                        }
                        else {
                            connection.query(`INSERT INTO users(firstname,lastname,email,password,role_id,car_service_id)
                            VALUES('${dealership.name}','Moderator','${dealership.name.toLowerCase()}@expert.com','${hashed}',2,${rows.insertId})`, (err, rows, fields) => {
                                if (err) {
                                    req.flash("error", "Prislo je do napake pri eksperta delavnice s ze obstojecim naslovom.")
                                    res.redirect("/registerDealership")
                                    return
                                }
                                else {
                                    req.flash("message", "Uspešno ste ustvarili delavnico. Dobrodošli v sistem.")
                                    res.redirect("/dealership")
                                }
                            })
                        }
                    })
                }
                else {
                    connection.query(`INSERT INTO addresses(street,city,zipcode,country,street_number) VALUES ('${address.street}','${address.city}',${address.zipcode},'${address.country}','${address.street_number}')`, (err, rows, fields) => {
                        if (err) {
                            req.flash("error", "Prislo je do napake pri ustvarjanju naslova.")
                            res.redirect("/registerDealership")
                            return
                        }
                        else {
                            let address_id = rows.insertId
                            connection.query(`INSERT INTO car_services(name,isLicenced,maxCapacity,phone,email,address_id) VALUES ('${dealership.name}',${dealership.isLicenced},${dealership.maxCapacity},'${dealership.phone}','${dealership.email}',${address_id})`, (err, rows, fields) => {
                                if (err) {
                                    req.flash("error", "Prislo je do napake pri ustvarjanju delanice s ze obstojecim naslovom.")
                                    res.redirect("/registerDealership")
                                    return
                                }
                                else {
                                    connection.query(`INSERT INTO users(firstname,lastname,password,role_id,car_service_id)
                                VALUES('${dealership.name}','Moderator','${hashed}',2,${rows.insertId})`, (err, rows, fields) => {
                                        if (err) {
                                            req.flash("error", "Prislo je do napake pri eksperta delavnice s ze obstojecim naslovom.")
                                            res.redirect("/registerDealership")
                                            return
                                        }
                                        else {
                                            req.flash("message", "Uspešno ste ustvarili delavnico. Dobrodošli v sistem.")
                                            res.redirect("/dealership")
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
    })
})

app.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/')
    })
})


app.get('/admin', (req, res) => {
    res.render('pages/admin');
})
app.get('/setup', (req, res) => {
    res.render('pages/setup');
})
app.get("/forum", (req, res) => {
    res.render("pages/forum")
})

app.get("/posts",/* ulogovan,*/(req, res) => {
    connection.query('SELECT posts.id,posts.title,posts.created_at, users.firstname,users.lastname FROM posts INNER JOIN users on users.id = posts.user_id', (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})

app.get("/postsForum",/* ulogovan,*/(req, res) => {
    connection.query('SELECT posts.id,posts.title,posts.created_at, users.firstname,users.lastname, posts.isAdvice FROM posts INNER JOIN users on users.id = posts.user_id WHERE isAdvice = 0', (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})

app.get("/advicesForum",/* ulogovan,*/(req, res) => {
    connection.query('SELECT posts.id,posts.title,posts.created_at, users.firstname,users.lastname, posts.isAdvice FROM posts INNER JOIN users on users.id = posts.user_id WHERE isAdvice = 1', (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})

app.get("/responses/:id", (req, res) => {
    connection.query(`
    SELECT 
    responses.text, responses.created_at, users.firstname, users.lastname,users.role_id
    FROM responses
    
    INNER JOIN posts ON responses.post_id = posts.id
    INNER JOIN users ON responses.user_id = users.id 
    WHERE responses.post_id = ${req.params.id} ORDER BY responses.created_at`, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})

app.get('/cars/:id', (req, res) => {
    connection.query(`
    SELECT cars.*
    FROM cars
    WHERE id = ${req.params.id}
    `, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})

app.get("/unswPosts", (req, res) => {
    connection.query(`
    SELECT posts.title, users.firstname,users.lastname,posts.created_at,posts.id,COUNT(responses.id) as cnt  
    FROM posts 
    LEFT JOIN responses on posts.id = responses.post_id 
    INNER JOIN users ON posts.user_id = users.id 
    WHERE isAdvice = 0
    GROUP BY posts.title 
    HAVING cnt = 0;`, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})

app.get('/offeredServicesRating/:id', (req, res) => {
    connection.query(`
    SELECT ratings.offered_service_id,AVG(ratings.rating) as avg_rating FROM ratings
    where offered_service_id = ${req.params.id}
    group by offered_service_id
;
    `, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        else {
            res.send(rows[0])
        }
    }
    )
})

app.get('/avgRating', (req, res) => {
    connection.query(`
    SELECT 
         AVG(ratings.rating) as rating,
         COUNT(ratings.rating) as count
    FROM
    ratings
        INNER JOIN
    offered_services ON offered_services.id = ratings.offered_service_id
        INNER JOIN
    car_services ON car_services.id = offered_services.car_service_id
    GROUP BY car_services.id;`, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        if (rows.length == 0) res.send([])
        else res.send(rows)
    })
})
app.get('/avgRating/:id', (req, res) => {
    connection.query(`
    SELECT 
         AVG(ratings.rating) as rating,
         COUNT(ratings.rating) as count
    FROM
    ratings
        INNER JOIN
    offered_services ON offered_services.id = ratings.offered_service_id
        INNER JOIN
    car_services ON car_services.id = offered_services.car_service_id
     where car_services.id = ${req.params.id} GROUP BY car_services.id LIMIT 1;
    `, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        if (rows.length == 0) res.send([])
        else res.send(rows[0])
    })
})

app.get("/reviews/:id", (req, res) => {
    connection.query(`
    SELECT ratings.id, ratings.text, ratings.offered_service_id, ratings.rating,
    users.firstname,users.lastname,
    offered_services.description,offered_services.service_id,
    ratings.created_at, ratings.updated_at
    FROM ratings
    INNER JOIN offered_services ON ratings.offered_service_id = offered_services.id
    INNER JOIN car_services on offered_services.car_service_id = car_services.id
    INNER JOIN users on ratings.user_id = users.id
    WHERE car_services.id = ${req.params.id} ORDER BY ratings.created_at`, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})

app.get('/posts/:id', (req, res) => {
    connection.query(`SELECT posts.id,posts.title,posts.text,posts.created_at, users.firstname,users.lastname FROM posts INNER JOIN users on users.id = posts.user_id  WHERE posts.id = ${req.params.id} LIMIT 1`, [req.params.id], (err, rows, fields) => {
        if (err) res.send(err)
        if (rows.length == 0) res.send([])
        else res.send(rows[0])
    }
    )
})

app.post('/posts', (req, res) => {

    let user = req.body.user
    let title = req.body.title
    let text = req.body.text
    let question = req.body

    let response = {
        "message": "",
        "errors": [],
        "status": ""
    }

    connection.query(`INSERT INTO posts (user_id, title, text) VALUES (${req.user.id},'${title}','${text}')`, (err, rows, fields) => {
        if (err) {
            console.log(err)
            response.status = 500
            response.message = "Prišlo je do napake pri obdelavi zadev!"
            response.errors.push(err)
            res.send(response)
            return
        }
    })
    response.status = 200;
    response.message = "Vspešno dodano vprasanje."
    res.send(response)

})

app.post('/responses/:id', (req, res) => {
    let text = req.body.text

    let response = {
        "message": "",
        "errors": [],
        "status": ""
    }
    connection.query(`INSERT INTO responses (text, post_id, user_id) VALUES ('${text}',${req.params.id},${req.user.id})`, (err, rows, fields) => {
        if (err) {
            console.log(err)
            response.status = 500
            response.message = "Prišlo je do napake pri obdelavi zadev!"
            response.errors.push(err)
            res.send(response)
            return
        }
    })
    response.status = 200;
    response.message = "Vspešno objavljen odgovor!"
    res.send(response)
})

app.post("/deleteCar", (req, res) => {
    let car_id = req.body.car_id
    let response = {
        "message": "",
        "errors": [],
        "status": ""
    };
    connection.query(`DELETE FROM cars WHERE id = ${car_id}`, (err, rows, fields) => {
        if (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri brisanju avtomobila"
            response.errors.push(err)
        }
        else {
            response.status = 200
            response.message = "Vspešno izbrisan avtomobil"
        }
        res.send(response)
        return
    })
})

app.post("/deleteNasvet", (req, res) => {

    let nasvet_id = req.body.nasvet_id
    let response = {
        "message": "",
        "errors": [],
        "status": ""
    };

    connection.query(`DELETE FROM posts WHERE id = '${nasvet_id}'`, (err, rows, fields) => {
        if (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri brisanju vprašanja"
            response.errors.push(err)
        }
        else {
            response.status = 200
            response.message = "Vspešno izbrisano vprsanje"
        }
        res.send(response)
        return
    })
})


app.post("/deletePost", (req, res) => {

    let post_id = req.body.post_id
    let response = {
        "message": "",
        "errors": [],
        "status": ""
    };

    connection.query(`DELETE FROM posts WHERE id = '${post_id}'`, (err, rows, fields) => {
        if (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri brisanju vprašanja"
            response.errors.push(err)
        }
        else {
            response.status = 200
            response.message = "Vspešno izbrisano vprsanje"
        }
        res.send(response)
        return
    })
})

app.post('/advice',/*ulogovanModerator,*/(req, res) => {

    let user = req.body.user
    let title = req.body.title
    let text = req.body.text
    let question = req.body.question
    let response = {
        "message": "",
        "errors": [],
        "status": ""
    }

    connection.query(`INSERT INTO posts (user_id, title, text, isAdvice) VALUES (${req.user.id},'${title}','${text}', 1)`, (err, rows, fields) => {
        if (err) {
            console.log(err)
            response.status = 500
            response.message = "Prišlo je do napake pri obdelavi zadev!"
            response.errors.push(err)
            res.send(response)
            return
        }
    })
    response.status = 200;
    response.message = "Vspešno dodan nasvet"
    res.send(response)
})


app.get("/forumPage", (req, res) => {
    res.render("pages/forumPage")
})
app.get('/roles', (req, res) => {
    connection.query("SELECT * FROM user_roles", (err, rows) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})
app.get('/users', (req, res) => {
    let users = [];
    let response = []

    connection.query('SELECT users.id, users.created_at, users.firstname,users.lastname,users.phone,users.email, user_roles.name as role_name,addresses.city as city,addresses.street as street, addresses.country as country, addresses.zipcode as zipcode, addresses.street_number as streetnumber, car_services.name as service_name FROM users LEFT JOIN car_services on users.car_service_id = car_services.id INNER JOIN user_roles on user_roles.id = users.role_id LEFT JOIN addresses on users.address_id = addresses.id ORDER BY users.firstname,users.lastname', (err, rows, fields) => {
        if (err) res.send(err)
        res.send(rows)
    })
})
app.post('/users', (req, res) => {
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let phone = req.body.phone;
    let email = req.body.email;
    let password = req.body.password;
    let role_id = req.body.role_id;
    let city = req.body.city;
    let street = req.body.street;
    let streetnumber = req.body.streetnumber
    let zipcode = req.body.zipcode
    let country = req.body.country
    let user = req.body
    //status 200: success
    //status 500: greska na serveru
    let response = {
        "message": "",
        "errors": [],
        "status": ""
    }
    for (data in req.body) {
        if (user[data] == " " || user[data] == "") {
            response.errors.push(data + " field is required")
        }
    }
    if (response.errors.length > 0) {
        response.status = 500
        response.message = "Prišlo je do napake pri obdelavi zadev."
    }
    else {
        try {
            connection.query(`
            INSERT INTO addresses(street,street_number,zipcode,city,country)
            VALUES('${street}','${streetnumber}',${zipcode},'${city}','${country}')
        `, (err, rows, fields) => {
                if (err) {
                    throw err
                }
                else {
                    connection.query(`INSERT INTO
                     users(firstname,lastname,phone,email,password,role_id,address_id) VALUES
                     ('${firstname}','${lastname}','${phone}','${email}','${password}',${role_id},${rows.insertId})   
                     `, (err, rows, fields) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            response.status = 200;
                            response.message = "Vspešno dodan uporabnik v bazo."
                        }

                    })
                }
            })
            response.status = 200;
            response.message = "Vspešno dodan uporabnik v bazo."
        }
        catch (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri dodajanju uporabnika v bazo."
            response.errors.push(err)
        }
    }
    res.send(response)
})
app.post('/deleteUser', (req, res) => {
    let user_id = req.body.user_id
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    };
    connection.query(`DELETE FROM users where id = ${user_id}`, (err, rows, fields) => {
        if (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri brisanju uporabnika"
            response.errors.push(err)
        }
        else {
            response.status = 200
            response.message = "Vspešno izbrisan uporabnik"
        }
        res.send(response)
        return
    })
})

/*dealership middleware*/
function ulogovan(req, res, next) {
    if (!req.user) {
        res.redirect('/login')
    }
    else {
        next();
    }
}

function ulogovanAdmin(req, res, next) {
    if (!req.user & req.user.role_id != 4) {
        res.redirect('/login')
    }
    else {
        next();
    }
}

//nasveti middleware
function ulogovanModerator(req, res, next) {
    if (!req.user & req.user.role_id != 3) {
        res.redirect('/login')
    }
    else {
        next();
    }
}
app.get("/advice", ulogovan, (req, res) => {
    connection.query('SELECT * FROM posts where posts.isAdvice = 1', (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})

app.get('/carServices',/*ulogovan,*/(req, res) => {
    let condition = "WHERE car_services.isAllowed = 1"
    if ((req.user && req.user.role_id == 4) || (req.headers.referer && req.headers.referer.includes("admin"))) {
        condition = ""
    }
    connection.query(`SELECT car_services.*, addresses.city as city,addresses.street as street, addresses.country as country, addresses.zipcode as zipcode, addresses.street_number as streetnumber FROM car_services INNER JOIN addresses on car_services.address_id = addresses.id ${condition}`, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})
app.get('/isFavorite/:id', (req, res) => {
    if (req.user) {
        connection.query(`SELECT * FROM favorite_dealerships WHERE user_id = ${req.user.id} AND car_service_id = ${req.params.id}`, (err, rows, fields) => {
            if (err) {
                console.log(err)
                res.send(err)
                return
            }
            else {
                res.send({ "favorite": (rows.length > 0) ? 1 : 0 })
            }

        })
    }
    else {
        res.send({ "favorite": 0 })
    }
})

app.get('/carService/:id',/*ulogovan,*/(req, res) => {
    connection.query('SELECT car_services.*, addresses.city as city,addresses.street as street, addresses.country as country, addresses.zipcode as zipcode, addresses.street_number as streetnumber FROM car_services INNER JOIN addresses on car_services.address_id = addresses.id WHERE car_services.id = ?', [req.params.id], (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        if (rows.length == 0) res.send([])
        else res.send(rows[0])
    })
})
app.post('/allowDealership/:id', (req, res) => {
    let response = {
        "status": 0,
        "message": 0,
        "errors": []
    }
    connection.query(`UPDATE car_services set isAllowed = 1 WHERE id = ${req.params.id}`, (err, rows, fields) => {
        if (err) {
            response.status = 500;
            response.errors.push(err)
            response.message = "Prišlo je do napake pri brisanju uporabnika."
            res.send(response)
        }
        else {
            response.status = 200;
            response.message = "Uspešno spremenjen status."
            res.send(response)
        }
    })
})
app.post('/disallowDealership/:id', (req, res) => {
    let response = {
        "status": 0,
        "message": 0,
        "errors": []
    }
    connection.query(`UPDATE car_services set isAllowed = 0 WHERE id = ${req.params.id}`, (err, rows, fields) => {
        if (err) {
            response.status = 500;
            response.errors.push(err)
            response.message = "Prišlo je do napake pri brisanju uporabnika."
            res.send(response)
        }
        else {
            response.status = 200;
            response.message = "Uspešno spremenjen status."
            res.send(response)
        }
    })
})

app.post('/dealerships',/*ulogovanAdmin, */(req, res) => {
    let name = req.body.name;
    let phone = req.body.phone;
    let email = req.body.email;
    let maxCapacity = req.body.maxCapacity;
    let isLicenced = req.body.isLicenced;
    let city = req.body.city;
    let street = req.body.street;
    let streetnumber = req.body.streetnumber
    let zipcode = req.body.zipcode
    let country = req.body.country
    let dealership = req.body
    //status 200: success
    //status 500: greska na serveru
    let response = {
        "message": "",
        "errors": [],
        "status": ""
    }
    for (data in req.body) {
        if (dealership[data] == " " || dealership[data] == "") {
            response.errors.push(data + " field is required")
        }
    }
    if (response.errors.length > 0) {
        response.status = 500
        response.message = "Prišlo je do napake pri obdelavi zadev."
    }
    else {
        try {
            connection.query(`
            INSERT INTO addresses(street,street_number,zipcode,city,country)
            VALUES('${street}','${streetnumber}',${zipcode},'${city}','${country}')
        `, (err, rows, fields) => {
                if (err) {
                    throw err
                }
                else {
                    connection.query(`INSERT INTO car_services (name,isLicenced,maxCapacity,phone,email,address_id) VALUES 
                     ('${name}','${isLicenced}',${maxCapacity},'${phone}','${email}',${rows.insertId})   
                     `, (err, rows, fields) => {
                        if (err) {
                            throw err;
                        }
                        else {
                            response.status = 200;
                            response.message = "Vspešno dodana avto delavnica."
                        }

                    })
                }
            })
            response.status = 200;
            response.message = "Vspešno dodana avto delavnica."
        }
        catch (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri dodajanju avto delavnice."
            response.errors.push(err)
        }
    }
    res.send(response)
})




app.post('/dealerships/:id',/*ulogovanAdmin, */(req, res) => {
    let dealership = req.body;
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    }
    connection.query(`UPDATE car_services
        SET name = '${dealership.name}',
        isLicenced = '${dealership.isLicenced}',
        maxCapacity =  ${dealership.maxCapacity},
        phone = '${dealership.phone}',
        email = '${dealership.email}'
        WHERE id = ${dealership.id};

    `, (err, rows, fields) => {
        if (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri obdelavi zadev."
            response.errors.push(err)
            console.log(errors)
        }
        else {
            response.status = 200
            response.message = "Vspešno spremenjena avto delavnica"
        }
        res.send(response);
        return
    })
})

app.post('/deleteDealership',/*ulogovanAdmin, */(req, res) => {
    let dealership_id = req.body.dealership_id
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    };
    connection.query(`DELETE FROM car_services where id = ${dealership_id}`, (err, rows, fields) => {
        if (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri brisanju avto delavnice"
            response.errors.push(err)
        }
        else {
            response.status = 200
            response.message = "Vspešno izbrisana avto delavnica"
        }
        res.send(response)
        return
    })
})

app.post('/allowDealerships/:id',/*ulogovanAdmin, */(req, res) => {
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    }
    connection.query(`UPDATE car_services
        SET isAllowed = 1
        WHERE id = ${req.params.id};
    `, (err, rows, fields) => {
        if (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri obdelavi zadev."
            response.errors.push(err)
            console.log(errors)
        }
        else {
            response.status = 200
            response.message = "Vspešno odobrena avto delavnica"
        }
        res.send(response);
        return
    })
})

app.post('/disallowDealerships/:id',/*ulogovanAdmin, */(req, res) => {
    let dealership = req.body;
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    }
    connection.query(`UPDATE car_services
        SET isAllowed = 0
        WHERE id = ${req.params.id};
    `, (err, rows, fields) => {
        if (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri obdelavi zadev."
            response.errors.push(err)
            console.log(errors)
        }
        else {

            response.status = 200
            response.message = "Vspešno izbrisana avto delavnica"
        }
        res.send(response);
        return
    })
})


app.get('/users/:id', (req, res) => {
    connection.query('SELECT users.id, users.address_id,users.firstname,users.lastname,users.phone,users.email, user_roles.name as role_name,addresses.city as city,addresses.street as street, addresses.country as country, addresses.zipcode as zipcode, addresses.street_number as streetnumber, car_services.name as service_name FROM users LEFT JOIN car_services on users.car_service_id = car_services.id INNER JOIN user_roles on user_roles.id = users.role_id LEFT JOIN addresses on users.address_id = addresses.id WHERE users.id = ? LIMIT 1', [req.params.id], (err, rows, fields) => {
        if (err) res.send(err)
        if (rows.length == 0) res.send([])
        else res.send(rows[0])
    }
    )
})

app.get('/offeredServices', (req, res) => {
    connection.query('SELECT * FROM offered_services', (err, rows, fields) => {
        if (err) res.send(err)
        if (rows.length == 0) res.send([])
        else res.send(rows)
    }
    )
})



app.post('/users/:id', (req, res) => {
    let user = req.body;
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    }
    connection.query(`UPDATE users
        SET firstname = '${user.firstname}',
        lastname = '${user.lastname}',
        phone = '${user.phone}',
        email = '${user.email}'
        WHERE id = ${user.id};

    `, (err, rows, fields) => {
        if (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri obdelavi zadev."
            response.errors.push(err)
        }
        else {
            response.status = 200
            response.message = "Vspešno spremenjen uporabnik"
        }
        res.send(response);
        return
    })
})
app.post("/users/:id/update", (req, res) => {
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    }
    console.log(req.body)
    if (!req.user) {
        response.status = 500
        response.errors.push("Morate biti prijavljeni za dostop to tega dela aplikacije")
        res.send(response)
        return
    }

    if (req.user.id != req.body.user_id) {
        response.status = 500
        response.errors.push("Nimate dovoljenega vstopa tem delu aplikacije.")
        res.send(response)
        return
    }
    else {
        console.log('HERE 1')
        let user = req.body
        console.log(user)
        connection.query(`
            UPDATE users SET 
            firstname = '${user.firstname}',
            lastname = '${user.lastname}',
            phone = '${user.phone}'
            WHERE id = ${req.user.id}`,
            (err, rows, fields) => {
                console.log('HERE 2')
                if (err) {
                    response.status = 500
                    response.errors.push(err)
                    res.send(response)
                    return
                }
                else {
                    console.log('HERE 3')
                    console.log('HERE 3.1')
                    connection.query(`
                    SELECT addresses.id FROM users INNER JOIN addresses on users.address_id = addresses.id where users.id = ${user.user_id}
                `, (err, rows, fields) => {
                        console.log('HERE 4')
                        if (err) {
                            response.status = 500
                            response.errors.push(err)
                            res.send(response)
                            return
                        }
                        else {
                            console.log('HERE 5')
                            let query = "";
                            if (rows.length == 0) {
                                console.log('HERE 6')
                                connection.query(`INSERT INTO addresses(street,street_number,zipcode,city,country)
                             VALUES ('${user.street}','${user.streetnumber}',${user.zipcode},'${user.city}','${user.country}')`,
                                    (err, rows, fields) => {
                                        console.log('HERE 7')

                                        if (err) {
                                            response.status = 500
                                            response.errors.push(err)
                                            res.send(response)
                                            return
                                        }
                                        else {
                                            connection.query(`UPDATE USERS set address_id = ${rows.insertId} WHERE id = ${req.user.id}`, (err, rows, fields) => {
                                                console.log('HERE 6')

                                                if (err) {
                                                    response.status = 500
                                                    response.errors.push(err)
                                                }
                                                else {
                                                    response.status = 200
                                                    response.message = "Vspešno obdelana zadeva."
                                                    res.send(response)
                                                    return
                                                }
                                            })
                                        }
                                    })
                            }
                            else {
                                connection.query(`UPDATE addresses set street = '${user.street}',zipcode = ${user.zipcode},street_number = '${user.street_number}',city = '${user.city}',country = '${user.country}' where id = ${rows[0].id}`, (err, rows, fields) => {
                                    if (err) {
                                        response.status = 500
                                        response.errors.push(err)
                                        res.send(response)
                                        return
                                    }
                                    else {
                                        response.status = 200
                                        response.message = "Vspešno obdelana zadeva"
                                        res.send(response)
                                        return
                                    }
                                })
                            }

                        }

                    })

                }
            })
    }
})

app.get('/reservations', (req, res) => {
    let query = `SELECT reservations.id, reservations.reservation_date, users.firstname,users.lastname, services.name FROM reservations
    INNER JOIN users on reservations.user_id = users.id
    INNER JOIN offered_services on reservations.offered_service_id = offered_services.id
    INNER JOIN services on offered_services.service_id = services.id;`
    connection.query(query, (err, rows, fields) => {
        if (err) res.send(err)
        res.send(rows)
    })
})

app.get('/offeredServices',/*ulogovan,*/(req, res) => {
    connection.query('SELECT offered_services.id, offered_services.car_service_id, offered_services.description, car_services.name, car_services.maxCapacity FROM offered_services JOIN car_services on offered_services.car_service_id = car_services.id', (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})
app.get('/offeredServices/:id',/*ulogovan,*/(req, res) => {
    connection.query('SELECT offered_services.id, offered_services.car_service_id, offered_services.description, car_services.name, car_services.maxCapacity FROM offered_services JOIN car_services on offered_services.car_service_id = car_services.id WHERE offered_services.id = ?', [req.params.id], (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})

app.get('/ratings', (req, res) => {
    let query = `SELECT * FROM ratings`
    connection.query(query, (err, rows, fields) => {
        if (err) res.send(err)
        res.send(rows)
    })
})
app.post('/ratings', (req, res) => {
    let text = req.body.text;
    let rating = req.body.rating;
    let offered_service_id = req.body.offered_service_id;
    let user_id = req.body.user_id;

    let ocena = req.body;

    let response = {
        "message": "",
        "errors": [],
        "status": "",
        "data": []
    }
    for (data in req.body) {
        if (ocena[data] == " " || ocena[data] == "") {
            response.errors.push(data + " field is required")
        }
    }
    if (response.errors.length > 0) {
        response.status = 500
        response.message = "Prišlo je do napake pri obdelavi zadev."
    }
    else {
        try {
            connection.query(`
            INSERT INTO ratings (text,rating,offered_service_id,user_id)
            VALUES ('${text}',${rating},${offered_service_id},${user_id})
        `, (err, rows, fields) => {
                if (err) {
                    throw err
                }
            })
            response.status = 200;
            response.message = "Ocena je uspesno dodana v bazo"

        }
        catch (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri dodajanju ocena."
            response.errors.push(err)
        }
    }
    console.log(data)
    res.send(response)
})

app.post("/deleteRatings", (req, res) => {
    let rating_id = req.body.rating_id
    let response = {
        "message": "",
        "errors": [],
        "status": ""
    };
    connection.query(`DELETE FROM ratings WHERE id = ${rating_id}`, (err, rows, fields) => {
        if (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri brisanju ocene"
            response.errors.push(err)
        }
        else {
            response.status = 200
            response.message = "Vspešno izbrisana ocena"
        }
        res.send(response)
        return
    })
})


app.post('/reservations', (req, res) => {
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    }
    if (!req.user) {
        response.status = 500
        response.message = "Morate biti prijavljeni za dostop to tega dela aplikacije"
        res.send(response)
        return
    }
    else {
        let offered_service_id = req.body.offered_service_id
        let user_id = req.user.id
        let reservation_date = req.body.reservation_date
        connection.query(`SELECT car_services.* FROM offered_services INNER JOIN car_services on car_services.id = offered_services.car_service_id WHERE offered_services.id = ${offered_service_id}`, (err, rows, fields) => {
            if (err) {
                console.log("car services error")
                response.status = 500
                response.errors.push(err)
                response.message = "Prišlo je do napake pri obdelavi zadeve"
                res.send(response)
                return
            }
            else {
                let car_service = rows[0]
                connection.query(`SELECT * FROM reservations inner join offered_services on offered_services.id = reservations.offered_service_id INNER JOIN car_services on car_services.id = offered_services.car_service_id WHERE car_services.id = ${car_service.id}`, (err, rows, fields) => {
                    if (err) {
                        console.log("reservations error")
                        response.status = 500
                        response.errors.push(err)
                        response.message = "Prišlo je do napake pri obdelavi zadeve"
                        res.send(response)
                    }
                    else {
                        let reservations = rows
                        if (reservations.length > car_service.maxCapacity) {
                            response.status = 500
                            response.message = "Na tem servisu je že prekoračeno maksimalno število rezervacij"
                            res.send(response)
                        }
                        else {
                            connection.query(`SELECT * FROM reservations WHERE reservation_date = '${reservation_date}'`, (err, rows, fields) => {
                                if (err) {
                                    console.log("reservations error 2")
                                    response.status = 500
                                    response.errors.push(err)
                                    response.message = "Prišlo je do napake pri obdelavi zadeve"
                                    res.send(response)
                                }
                                else {
                                    let reservations = rows
                                    if (reservations.length > 0) {
                                        response.status = 500
                                        response.message = "Na tem servisu je izabrani datum že zaseden!"
                                        res.send(response)
                                    }
                                    else {
                                        connection.query(`INSERT INTO reservations(offered_service_id,user_id,reservation_date) VALUES (${offered_service_id},${user_id},'${reservation_date}')`, (err, rows, fields) => {
                                            if (err) {
                                                console.log("reservations error 3")
                                                response.status = 500
                                                response.errors.push(err)
                                                response.message = "Prišlo je do napake pri obdelavi zadeve"
                                                res.send(response)
                                            }
                                            else {
                                                response.status = 200
                                                response.message = "Vspešno obdelana zadeva."
                                                res.send(response)
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
    }

})

app.post('/reservations/:id/update', (req, res) => {
    let reservation_date = req.body.reservation_date;
    let user_id = req.body.user_id;
    let offered_service_id = req.body.offered_service_id;
    let reservation_id = req.body.reservation_id;
    let reservation = req.body

    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    }
    connection.query(`UPDATE reservations SET reservation_date = '${reservation_date}',
        user_id = ${user_id},
        offered_service_id = ${offered_service_id}
        WHERE id = ${reservation_id};
    `, (err, rows, fields) => {
        if (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri obdelavi zadev."
            response.errors.push(err)

        }
        else {
            response.status = 200
            response.message = "Vspešno spremenjena rezervacija"
        }
        res.send(response);
        return
    })
})

app.get('/manufacturers', (req, res) => {
    connection.query('SELECT manufacturers.id, manufacturers.name from manufacturers', (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    }
    )
})

app.get('/cars', (req, res) => {
    connection.query('SELECT cars.id, cars.model, cars.manufactured_year, cars.manufacturer_id, cars.user_id from cars ', (err, rows, fields) => {

        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    }
    )
})

app.post('/cars', (req, res) => {

    let manufactured_year = req.body.manufactured_year
    let manufacturer_id = req.body.manufacturer_id
    let model = req.body.model
    let user_id = req.body.user_id
    let car = req.body

    let response = {
        "message": "",
        "errors": [],
        "status": ""
    }
    connection.query(`INSERT INTO cars (model, manufactured_year, manufacturer_id,user_id) VALUES('${model}',${manufactured_year},'${manufacturer_id}',${user_id})`, (err, rows, fields) => {
        if (err) {
            console.log(err)
            response.status = 500
            response.message = "Prišlo je do napake pri obdelavi zadev!"

            return
        }
    })
    response.status = 200;
    response.message = "Vspešno dodan automobil."
    res.send(response)

})



app.post('/updateReservation', (req, res) => {

    let reservation_date = req.body.reservation_date
    let reservation_id = req.body.reservation_id

    let reservation = req.body.reservation
    let response = {
        "message": "",
        "errors": [],
        "status": ""
    }


    connection.query(`UPDATE reservations SET reservation_date = '${reservation_date}' WHERE id = ${reservation_id};`, (err, rows, fields) => {
        if (err) {
            console.log(err)
            response.status = 500
            response.message = "Prislo je do napake pri obdelavi zadev!"

            return
        }
    })
    response.status = 200;
    response.message = "Vspesno spremenjena rezervacija."
    res.send(response)

})



app.post('/updateRating', (req, res) => {

    let rating_id = req.body.rating_id
    let text = req.body.text
    let rating = req.body.rating

    console.log(rating_id)


    let response = {
        "message": "",
        "errors": [],
        "status": ""
    }

    connection.query(`UPDATE ratings SET text = "${text}", rating = ${rating} WHERE id = ${rating_id};`, (err, rows, fields) => {
        if (err) {
            console.log(err)
            response.status = 500
            response.message = "Prišlo je do napake pri obdelavi zadev!"

            return
        }
    })
    response.status = 200;
    response.message = "Vspešno spremenjena ocena."
    res.send(response)

})



app.post('/updateCars/:id', (req, res) => {

    let manufactured_year = req.body.manufactured_year
    let manufacturer_id = req.body.manufacturer_id
    let model = req.body.model
    let user_id = req.body.user_id
    let car = req.body
    let car_id = req.body.id

    let response = {
        "message": "",
        "errors": [],
        "status": ""
    }

    connection.query(`UPDATE cars SET model = "${model}",
         manufactured_year = '${manufactured_year}',
         manufacturer_id = ${manufacturer_id}
         WHERE id = ${car_id};`, (err, rows, fields) => {
        if (err) {
            console.log(err)
            response.status = 500
            response.message = "Prišlo je do napake pri obdelavi zadev!"

            return
        }
    })
    response.status = 200;
    response.message = "Vspešno spremenjen automobil."
    res.send(response)

})


app.get('/reservations/:id', (req, res) => {
    connection.query('SELECT reservations.*,car_services.name as dealership FROM reservations INNER JOIN offered_services on offered_services.id= reservations.offered_service_id INNER JON car_services on offered_services.car_service_id = car_services.id WHERE reservations.id = ? LIMIT 1', [req.params.id], (err, rows, fields) => {
        if (err) res.send(err)
        if (rows.length == 0) res.send([])
        else res.send(rows[0])
    }
    )
})

app.post('/deleteReservation', (req, res) => {
    let reservation_id = req.body.reservation_id
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    };
    connection.query(`DELETE FROM reservations WHERE reservations.id = ${reservation_id}`, (err, rows, fields) => {
        if (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri brisanju rezervacije"
            response.errors.push(err)
        }
        else {
            response.status = 200
            response.message = "Vspešno izbrisana rezervacija"
        }
        res.send(response)
        return
    })
})







app.post('/reservations', (req, res) => {
    let reservation_date = req.body.reservation_date;
    let user_id = req.body.user_id;
    let offered_service_id = req.body.offered_service_id;

    let reservation = req.body

    let response = {
        "message": "",
        "errors": [],
        "status": "",
        "data": []
    }
    for (data in req.body) {
        console.log(data)
        if (reservation[data] == " " || reservation[data] == "") {
            response.errors.push(data + " field is required")
        }
    }
    if (response.errors.length > 0) {
        response.status = 500
        response.message = "Prišlo je do napake pri obdelavi zadev."
    }
    else {
        try {
            connection.query(`
            INSERT INTO reservations (reservation_date,user_id,offered_service_id)
            VALUES('${reservation_date}',${user_id},${offered_service_id})
        `, (err, rows, fields) => {
                if (err) {
                    throw err
                }
                else {
                    response.status = 200;
                    response.message = "Rezervacija je uspešno dodana v bazo"
                }

            })
            response.status = 200;
            response.message = "Rezervacija je uspešno dodana v bazo"
        }
        catch (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri dodajanju rezervacijo v bazo."
            response.errors.push(err)
        }
    }
    res.send(response)
})

app.post('/ratings', (req, res) => {
    let text = req.body.text;
    let rating = req.body.rating;
    let offered_service_id = req.body.offered_service_id;
    let user_id = req.body.user_id;

    let ocena = req.body;

    let response = {
        "message": "",
        "errors": [],
        "status": "",
        "data": []
    }
    for (data in req.body) {
        if (ocena[data] == " " || ocena[data] == "") {
            response.errors.push(data + " field is required")
        }
    }
    if (response.errors.length > 0) {
        response.status = 500
        response.message = "Prišlo je do napake pri obdelavi zadev."
    }
    else {
        try {
            connection.query(`
            INSERT INTO ratings (text,rating,offered_service_id,user_id)
            VALUES ('${text}',${rating},${offered_service_id},${user_id})
        `, (err, rows, fields) => {
                if (err) {
                    throw err
                }
            })
            response.status = 200;
            response.message = "Ocena je uspešno dodana."

        }
        catch (err) {
            response.status = 500
            response.message = "Prišlo je do napake pri dodajanju ocene."
            response.errors.push(err)
        }
    }
    console.log(data)
    res.send(response)
})

app.get('/user/cars', (req, res) => {
    let response = {
        "status": 0,
        "message": "",
        "errors": []
    }
    if (!req.user) {
        response.status = 500;
        response.message = "Morate biti prijavljeni za dostop do te funkcionalnosti"
        res.send(response)
        return
    }
    else {
        connection.query(`SELECT cars.id, cars.model,cars.manufactured_year,cars.manufacturer_id,cars.user_id FROM cars
        WHERE cars.user_id = ${req.user.id}`, (err, rows, fields) => {
            if (err) {
                response.status = 500
                response.message = "Prišlo je do napake pri prikazu avtomobila"
                response.errors.push(err.text)
                res.send(response)
                return
            }
            else {
                response.data = rows
                response.status = 200
                response.message = "Ok"
                res.send(response)
            }
        })
    }
})





app.get('/user/reservations', (req, res) => {
    let response = {
        "status": 0,
        "message": "",
        "errors": []
    }
    if (!req.user) {
        response.status = 500;
        response.message = "Morate biti prijavljeni za dostop do te funkcionalnosti"
        res.send(response)
        return
    }
    else {
        connection.query(`SELECT 
        reservations.id,
        reservations.reservation_date,
        users.firstname,
        users.lastname,
        services.name,
        car_services.name AS dealership,
        reservations.offered_service_id AS offered_service,
        COUNT(ratings.id) AS 'isReviewed'
    FROM
        reservations
            INNER JOIN
        users ON reservations.user_id = users.id
            INNER JOIN
        offered_services ON reservations.offered_service_id = offered_services.id
            INNER JOIN
        services ON offered_services.service_id = services.id
            INNER JOIN
        car_services ON offered_services.car_service_id = car_services.id
            LEFT JOIN
        ratings ON ratings.offered_service_id = offered_services.id
    WHERE
        users.id = ${req.user.id}
    GROUP BY reservations.id , reservations.reservation_date , users.firstname , users.lastname , services.name , car_services.name, offered_service;`, (err, rows, fields) => {
            if (err) {
                response.status = 500
                response.message = "Prišlo je do napake pri odbelav rezervacija"
                response.errors.push(err.text)
                res.send(response)
                return
            }
            else {
                response.data = rows
                response.status = 200
                response.message = "Ok"
                res.send(response)
            }
        })
    }
})
app.get('/user/reviews', (req, res) => {
    let response = {
        status: 0,
        message: "",
        errors: [],
        data: []
    }
    if (!req.user) {
        response.status = 500,
            response.message = "Morate biti prijavljeni za dostop do te funkcionalnosti aplikacije"
        res.send(response)
    }
    else {
        connection.query(`SELECT ratings.id, ratings.text, ratings.offered_service_id, ratings.rating,
        users.firstname,users.lastname,
        offered_services.description,offered_services.service_id,
        ratings.created_at, ratings.updated_at,car_services.name dname,services.name sname, ratings.id as rating_id
        FROM ratings
        INNER JOIN offered_services ON ratings.offered_service_id = offered_services.id
        INNER JOIN car_services on offered_services.car_service_id = car_services.id
        INNER JOIN services on offered_services.service_id = services.id
        INNER JOIN users on ratings.user_id = users.id
        WHERE users.id = ${req.user.id} ORDER BY ratings.created_at`, (err, rows, fields) => {
            if (err) {
                response.status = 500
                response.message = "Prišlo je do napake pri obdelavi zadeva"
                response.errors.push(err)
                res.send(response)
                return
            }
            else {
                response.status = 200
                response.message = "Ok"
                response.data = rows
                res.send(response)
                return
            }
        })
    }

})

app.get('/nasveti', /*ulogovanModerator,*/(req, res) => {
    let response = {
        status: 0,
        errors: [],
        message: "",
        data: []
    }
    connection.query(`SELECT posts.id, posts.title, posts.text, posts.isAdvice, posts.user_id, users.firstname, users.lastname from posts
    JOIN users on user_id = users.id
     where isAdvice = 1;`, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})

app.get('/nasveti/:id', /*ulogovanModerator,*/(req, res) => {
    let response = {
        status: 0,
        errors: [],
        message: "",
        data: []
    }
    connection.query(`SELECT posts.id, posts.title, posts.text, posts.isAdvice, posts.user_id, users.firstname, users.lastname from posts
    JOIN users on user_id = users.id
     where isAdvice = 1 AND posts.id =${req.params.id};`, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})


app.post('/nasveti/:id', /*ulogovanModerator,*/(req, res) => {

    let title = req.body.title;
    let text = req.body.text;
    let nasvet = req.body;

    console.log(nasvet)

    let response = {
        "status": 0,
        "message": 0,
        "errors": []
    }
    connection.query(`UPDATE posts SET 
    title ='${title}',
    text ='${text}'
    WHERE id = ${req.params.id};`, (err, rows, fields) => {
        if (err) {
            response.status = 500;
            response.errors.push(err)
            response.message = "Prišlo je do napake pri urejenju nasveta."
            res.send(response)
        }
        else {
            response.status = 200;
            response.message = "Uspešno spremenjen nasvet."
            res.send(response)
        }
    })
})




app.get('/user/posts', (req, res) => {
    let response = {
        status: 0,
        errors: [],
        message: "",
        data: []
    }
    if (!req.user) {
        response.status = 500
        response.message = "Morate biti prijavljeni za dostop do te funkcionalnosti aplikacije",
            res.send(response)
        return
    }
    else {

        connection.query(`SELECT posts.id,posts.title,posts.text,posts.created_at, posts.isAdvice, users.firstname,users.lastname FROM posts INNER JOIN users on users.id = posts.user_id WHERE users.id = ${req.user.id} AND isAdvice = 0`, (err, rows, fields) => {
            if (err) {
                response.status = 500
                response.message = "Prišlo je do napake pri obdelavi zadeve"
                response.errors.push(err.text)
                res.send(response)
                return
            }
            else {
                response.status = 200
                response.message = "Ok"
                response.data = rows
                res.send(response)
                return
            }
        })
    }

})

app.get('/user/favorites', (req, res) => {
    let response = {
        status: 0,
        errors: [],
        message: "",
        data: []
    }
    if (!req.user) {
        response.status = 500
        response.message = "Morate biti prijavljeni za dostop do te funkcionalnosti"
        res.send(response)
        return
    }
    else {
        connection.query(`SELECT car_services.id as cid, car_services.*,addresses.* FROM favorite_dealerships inner join car_services on car_services.id = favorite_dealerships.car_service_id inner join addresses on car_services.address_id = addresses.id where favorite_dealerships.user_id = ${req.user.id}`, (err, rows, fields) => {
            if (err) {
                console.log(err)
                response.status = 500
                response.message = "Prišlo je do napake pri obdelavi zadev"
                response.errors.push(err)
                res.send(response)
                return
            }
            else {
                response.status = 200
                response.message = "ok"
                response.data = rows
                res.send(response)
                return
            }
        })
    }
})


app.get('/search', (req, res) => {
    console.log(req.query)
    let data = req.query
    if (data.type == 'users') {
        let roles = "1,2,3,4"
        if (data.hasOwnProperty('roles') && data.roles.length > 0) {
            roles = data.roles
        }
        console.log(roles)
        let query = `SELECT
        users.id, users.created_at,
        users.firstname,users.lastname,
        users.phone,users.email,
        user_roles.name as role_name,addresses.city as city, addresses.street as street,
        addresses.country as country, addresses.zipcode as zipcode,
        addresses.street_number as streetnumber,
        car_services.name as service_name 
        FROM users
        LEFT JOIN car_services on users.car_service_id = car_services.id
        INNER JOIN user_roles on user_roles.id = users.role_id
        LEFT JOIN addresses on users.address_id = addresses.id
        WHERE (users.firstname LIKE '%${data.text}%'
        OR users.lastname LIKE '%${data.text}%'
        OR users.phone LIKE '%${data.text}%'
        OR users.email LIKE '%${data.text}%')
        AND users.role_id in (${roles})
        ORDER BY users.firstname,users.lastname`
        connection.query(query, (err, rows, fields) => {
            console.log(rows)
            if (err) res.send(err)
            res.send(rows)
        })
    }
    else if (data.type == 'dealerships') {
        let query = `SELECT
        car_services.id,
        car_services.name,
        car_services.phone,
        car_services.email,
        car_services.isLicenced,
        car_services.maxCapacity,
        car_services.created_at,
        car_services.isAllowed,
        addresses.city as city,
        addresses.street as street,
        addresses.country as country,
        addresses.zipcode as zipcode,
        addresses.street_number as streetnumber
        FROM car_services
        INNER JOIN addresses on car_services.address_id = addresses.id
        WHERE (car_services.name LIKE '%${data.text}%'
        OR car_services.phone LIKE '%${data.text}%'
        OR car_services.email LIKE '%${data.text}%')
        ORDER BY car_services.name`
        connection.query(query, (err, rows, fields) => {
            if (err) { res.send(err); return; }
            res.send(rows)
        })
    }
    else if (data.type == 'services') {
    }
    else if (data.type == 'groupedServices') {
        connection.query(`
    SELECT 
        services.id,
        services.name,
        COUNT(offered_services.service_id) as count
    FROM
        services
    INNER JOIN
        offered_services ON offered_services.service_id = services.id
    WHERE services.name LIKE '%${data.text}%'
    GROUP BY services.id , services.name;`, (err, rows, fields) => {
            if (err) {
                res.send(err)
                return
            }
            res.send(rows)
        })
    }
})


app.get('/carService/:id/services', (req, res) => {
    connection.query(`
    SELECT 
        services.name,
        offered_services.car_service_id,
        offered_services.description,
        offered_services.id as id,
        prices.price
    FROM
        offered_services
    INNER JOIN
        services ON services.id = offered_services.service_id
    INNER JOIN
        prices on prices.offered_service_id = offered_services.id
    WHERE
        offered_services.car_service_id = ${req.params.id}
	AND 
    (prices.valid_to IS NULL OR prices.valid_to > curdate());`, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        if (rows.length == 0) res.send(false)
        else res.send(rows)
    })
})
app.get('/services', (req, res) => {
    connection.query(`
    SELECT 
        services.id,
        services.name,
        COUNT(offered_services.service_id) as count
    FROM
        services
    INNER JOIN
        offered_services ON offered_services.service_id = services.id
    GROUP BY services.id , services.name;`, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})
app.get('/services/:id', (req, res) => {
    connection.query(`
    SELECT 
        offered_services.id as offered_service_id,
        car_services.name,
        offered_services.car_service_id,
        offered_services.description,
        prices.price
    FROM
        offered_services
    INNER JOIN
        services ON services.id = offered_services.service_id
    INNER JOIN
        prices on prices.offered_service_id = offered_services.id
    INNER JOIN
        car_services on car_services.id = offered_services.car_service_id
    WHERE
        offered_services.service_id = ${req.params.id}
	AND 
    (prices.valid_to IS NULL OR prices.valid_to > curdate())
    ORDER BY prices.price DESC;
    `, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        if (rows.length == 0) res.send([])
        else res.send(rows)
    })
})

app.get('/forum', (req, res) => {

})
app.get('/dealership', (req, res) => {
    res.render('pages/dealership')
})
app.get('/serviceDisplay', (req, res) => {
    res.render('pages/serviceDisplay')
})

app.get('/updatePasswords', (req, res) => {
    connection.query("SELECT * FROM users", (err, rows, fields) => {
        rows.forEach(element => {
            let hash = bcrypt.hash(element.firstname + element.lastname, salt, (err, hashed) => {
                connection.query(`UPDATE users SET password = '${hashed}' WHERE id = ${element.id}`, (err, rows, fields) => {
                })
            })
        });
        res.send('all good')
    })
})
app.get('/isLoggedIn', (req, res) => {
    if (req.user) {
        console.log("isLoggedIn")
        console.log(req.user)
        res.send(true)
    }
    else {
        res.send(false)
    }
})
app.get('/getUserId', (req, res) => {
    console.log('ovde smo za user id ')
    console.log(req.user['id'])
    data = { id: req.user.id, username: req.user.firstname }
    res.json(200, data)
    // if (req.user) {
    //     res.send(req.user['id'])
    // }
    // else {
    // res.send(false)
    // }
})
app.get('/addReservationUser/:id', (req, res) => {
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    }
    if (!req.user) {
        response.message = "Morate biti prijavljeni za uporabo te funkcionalnosti."
        response.status = 500
        res.send(response)
        return
    }
    else {
        connection.query(`INSERT INTO user_reservations(user_id,reservation_id) VALUES(${req.user.id},${req.params.id})`, (err, rows, fields) => {
            if (err) {
                response.message = "Prišlo je do napake kreiranju rezervacije."
                response.errors.push(err)
                response.status = 500
                res.send(response)
                return
            }
            else {
                response.message = "Vspešno dodana rezervacija"
                response.status = 200
                res.send(response)
            }
        })

    }
})

app.post('/addFavoriteDealership/:id', (req, res) => {
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    }
    if (!req.user) {
        response.message = "Morate biti prijavljeni za uporabo te funkcionalnosti."
        response.status = 500
        res.send(response)
        return
    }
    else {
        connection.query("SELECT * FROM favorite_dealerships WHERE user_id = " + req.user.id + " AND car_service_id = " + req.params.id, (err, rows, fields) => {
            if (err) {
                response.message = "Prišlo je do napake pri kreiranju rezervacije."
                response.errors.push(err)
                response.status = 500
                res.send(response)
                return
            }
            else if (rows.length > 0) {
                response.message = "Ta delavnica je že med vašimi poljubnimi delavnicami."
                response.status = 200
                res.send(response)
                return
            }
            else {
                connection.query(`INSERT INTO favorite_dealerships(user_id,car_service_id) VALUES(${req.user.id},${req.params.id})`, (err, rows, fields) => {
                    if (err) {
                        response.message = "Prišlo je do napake pri dodajanju delavnice v poljubljene."
                        response.errors.push(err)
                        response.status = 500
                        res.send(response)
                        return
                    }
                    else {
                        response.message = "Vspešno dodan servis v prilljubljene"
                        response.status = 200
                        res.send(response)
                    }
                })
            }
        })

    }
})
app.post('/removeFavoriteDealership/:id', (req, res) => {
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    }
    if (!req.user) {
        response.message = "Morate biti prijavljeni za uporabo te funkcionalnosti."
        response.status = 500
        res.send(response)
        return
    }
    else {
        connection.query(`DELETE FROM favorite_dealerships WHERE car_service_id = ${req.params.id} and user_id = ${req.user.id}`, (err, rows, fields) => {
            if (err) {
                response.message = "Prišlo je do napake pri brisanju delavnice iz poljubljenih."
                response.errors.push(err)
                response.status = 500
                res.send(response)
                return
            }
            else {
                response.message = "Vspešno izbrisan servis iz priljubljenih"
                response.status = 200
                res.send(response)
            }
        })

    }
})
app.get('/favouriteDealerships', (req, res) => {
    connection.query(`Select * FROM favorite_dealerships WHERE user_id = ${req.user.id}`, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        res.send(rows)
    })
})

app.get('/dashboard', (req, res) => {
    res.render('pages/dashboard')
})
app.get("/user", (req, res) => {
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    }
    if (!req.user) {
        response.message = "Morate biti prijavljeni za pristop temu delu aplikacije"
        response.status = 500
        res.send(response)
    }
    else {
        res.redirect('/users/' + req.user.id)
    }
})
app.get("/moderator", (req, res) => {
    res.render("pages/moderator")
})
app.get("/map", (req, res) => {
    res.render("pages/map")
})
app.get("/dealership/services", (req, res) => {
    connection.query(`
    SELECT 
        services.name,
        offered_services.car_service_id,
        offered_services.description,
        offered_services.id as id,
        prices.price
    FROM
        offered_services
    INNER JOIN
        services ON services.id = offered_services.service_id
    INNER JOIN
        prices on prices.offered_service_id = offered_services.id
    WHERE
        offered_services.car_service_id = ${req.user.car_service_id}
	AND 
    (prices.valid_to IS NULL OR prices.valid_to > curdate());`, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        if (rows.length == 0) res.send(false)
        else res.send(rows)
    })
})
app.post("/dealership/services", (req, res) => {
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    }
    if (!req.user) {
        response.message = "Morate biti prijavljeni za uporabu te funkcionalnosti."
        response.status = 500
        res.send(response)
        return
    }
    else {
        connection.query(`INSERT INTO offered_services(car_service_id,service_id,description) VALUES(${req.user.car_service_id},${req.body.service_id},'${req.body.description}')`, (err, rows, fields) => {
            if (err) {
                response.message = "Prislo je do napake pri dodajanju servisa."
                response.errors.push(err)
                response.status = 500
                res.send(response)
                return
            }
            else {
                connection.query(`INSERT INTO prices(offered_service_id, price, valid_from) VALUES (${rows.insertId},${req.body.price},curdate())`, (err, rows, fields) => {
                    if (err) {
                        response.status = 500
                        response.errors = err.message
                        res.send(response)
                    }
                    else {
                        response.message = "Vspesno dodan servis"
                        response.status = 200
                        res.send(response)
                    }
                })

            }
        })

    }
})
app.get("/dealership/reviews", (req, res) => {
    connection.query(`
    SELECT ratings.id, ratings.text, ratings.offered_service_id, ratings.rating,
    users.firstname,users.lastname,
    offered_services.description,offered_services.service_id,
    ratings.created_at, ratings.updated_at
    FROM ratings
    INNER JOIN offered_services ON ratings.offered_service_id = offered_services.id
    INNER JOIN car_services on offered_services.car_service_id = car_services.id
    INNER JOIN users on ratings.user_id = users.id
    WHERE car_services.id = ${req.user.car_service_id} ORDER BY ratings.created_at`, (err, rows, fields) => {
        if (err) {
            res.send(err)
            return
        }
        if (rows.length == 0) { res.send(false) }
        else { res.send(rows) }
    })
})
app.get("/dealership/reservations", (req, res) => {
    let query = `SELECT reservations.id, reservations.reservation_date, users.firstname,users.lastname, services.name FROM reservations
    INNER JOIN users on reservations.user_id = users.id
    INNER JOIN offered_services on reservations.offered_service_id = offered_services.id
    INNER JOIN services on offered_services.service_id = services.id
    WHERE offered_services.car_service_id = ${req.user.car_service_id};`
    connection.query(query, (err, rows, fields) => {
        if (err) { res.send(err); return; }
        if (rows.length == 0) { res.send(false); return; }
        res.send(rows)
    })
})
app.delete("/dealership/reservations/:id", (req, res) => {
    connection.query(`DELETE FROM reservations WHERE id = ${req.params.id}`, (err, rows, fields) => {
        if (err) { res.send(err); return; }
        res.send(rows)
    })
})
app.get("/dealership/offeredServices/:id", (req, res) => {
    connection.query(`SELECT services.name,offered_services.description, prices.price FROM offered_services INNER JOIN services on services.id = offered_services.service_id INNER JOIN prices on prices.offered_service_id = offered_services.id WHERE car_service_id = ${req.user.car_service_id} AND offered_services.id = ${req.params.id} AND (prices.valid_to IS NULL OR prices.valid_to > curdate())`, (err, rows, fields) => {
        if (err) { res.send(err); return; }
        if (rows.length == 0) { res.send(false); return; }
        res.send(rows[0])
    })
})
app.post("/dealership/offeredServices/:id", (req, res) => {
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    }
    if (!req.user) {
        response.message = "Morate biti prijavljeni za pristup temu delu aplikacije"
        response.status = 500
        res.send(response)
    }
    else {
        connection.query(`UPDATE offered_services SET description = '${req.body.description}' WHERE id = ${req.params.id}`, (err, rows, fields) => {
            if (err) {
                response.message = "Prislo je do napake pri posodabljanju opisa servisa"
                response.errors.push(err)
                response.status = 500
                res.send(response)
                return
            }
            else {
                connection.query(`SELECT * FROM prices where offered_service_id = ${req.body.id} AND (prices.valid_to IS NULL OR prices.valid_to > curdate())`, (err, rows, fields) => {
                    if (err) {
                        response.message = "Prislo je do napake pri posodabljanju cene"
                        response.errors.push(err)
                        response.status = 500
                        res.send(response)
                        return
                    }
                    else {
                        if (rows.length == 0) {
                            connection.query(`INSERT INTO prices (offered_service_id,price) VALUES (${req.body.id},${req.body.price})`, (err, rows, fields) => {
                                if (err) {
                                    response.message = "Prislo je do napake pri posodabljanju cene"
                                    response.errors.push(err)
                                    response.status = 500
                                    res.send(response)
                                    return
                                }
                                else {
                                    response.message = "Vspesno posodobljeno"
                                    response.status = 200
                                    res.send(response)
                                    return
                                }
                            })
                        }
                        else {
                            connection.query(`UPDATE prices SET price = ${req.body.price} WHERE offered_service_id = ${req.body.id} AND (prices.valid_to IS NULL OR prices.valid_to > curdate())`, (err, rows, fields) => {
                                if (err) {
                                    response.message = "Prislo je do napake pri posodabljanju cene"
                                    response.errors.push(err)
                                    response.status = 500
                                    res.send(response)
                                    return
                                }
                                else {
                                    response.message = "Vspesno posodobljeno"
                                    response.status = 200
                                    res.send(response)
                                    return
                                }
                            })
                        }
                    }
                })
            }
        })
    }
})
app.delete("/dealership/offeredServices/:id", (req, res) => {
    let response = {
        "status": 0,
        "errors": [],
        "message": ""
    }
    if (!req.user) {
        response.message = "Morate biti prijavljeni za pristup temu delu aplikacije"
        response.status = 500
        res.send(response)
    }
    else {
        connection.query(`DELETE FROM offered_services WHERE id = ${req.params.id}`, (err, rows, fields) => {
            if (err) {
                response.message = "Prislo je do napake pri brisanju servisa"
                response.errors.push(err)
                response.status = 500
                res.send(response)
                return
            }
            else {
                response.message = "Vspesno izbrisano"
                response.status = 200
                res.send(response)
                return
            }
        })
    }
})
app.get("/mechanic", (req, res) => {
    res.render("pages/mechanic")
})
app.get("/mechanic/bookings", (req, res) => {
    let response = {
        status: 0,
        message: "",
        errors: [],
        data: []
    }
    if (!req.user) {
        response.status = 500
        response.message = "Nimate dostopa do tega dela aplikacije"
    }
    else {
        connection.query(`SELECT mechanic_bookings.id, mechanic_bookings.booking_status_id, mechanic_bookings.booking_latitude,mechanic_bookings.booking_longitude,users.firstname,users.lastname,users.phone,users.email,mechanic_bookings.created_at FROM mechanic_bookings INNER JOIN users on users.id = mechanic_bookings.user_id WHERE mechanic_id  = ${req.user.id}`, (err, rows, fields) => {
            if (err) {
                response.status = 500
                response.message = "Prislo je do napake pri obdelavi zadeve"
                response.errors.push(err)
            }
            else {
                response.status = 200
                response.message = "ok"
                response.data = rows
            }
            res.send(response)
        })
    }
})
app.get("/mechanic/bookings/available", (req, res) => {
    let response = {
        status: 0,
        message: "",
        errors: [],
        data: []
    }
    if (!req.user) {
        response.status = 500
        response.message = "Nimate dostopa do tega dela aplikacije"
        res.send(response)
    }
    else {
        connection.query(`SELECT mechanic_bookings.id, mechanic_bookings.booking_status_id, mechanic_bookings.booking_latitude,mechanic_bookings.booking_longitude,users.firstname,users.lastname,users.phone,users.email,mechanic_bookings.created_at FROM mechanic_bookings INNER JOIN users on users.id = mechanic_bookings.user_id WHERE mechanic_id is null`, (err, rows, fields) => {
            if (err) {
                response.status = 500
                response.message = "Prislo je do napake pri obdelavi zadeve"
                response.errors.push(err)
            }
            else {
                response.status = 200
                response.message = "ok"
                response.data = rows
            }
            res.send(response)
        })
    }
})
app.post("/bookMechanic", (req, res) => {
    let response = {
        status: 0,
        message: "",
        errors: []
    }
    if (!req.user) {
        response.status = 500
        response.message = "Nimate dostopa do tega dela aplikacije"
        res.send(response)
        return
    }
    connection.query(`INSERT INTO mechanic_bookings(user_id,booking_date,booking_longitude,booking_latitude,booking_status_id)
        VALUES(${req.user.id},curdate(),${req.body.longitude},${req.body.latitude},1)
    `, (err, rows, fields) => {
        if (err) {
            response.status = 500
            response.message = "Prislo je do napake pri iskanju mehanika"
            response.errors.push(err)
        } else {
            response.status = 200
            response.message = "Vspesno poslan zadev za mehanika. Kdaj en mehanik sprejme zahtevo, boste obveščeni"
        }
        res.send(response)
    })
})
app.post("/acceptBooking/:id", (req, res) => {
    let response = {
        status: 0,
        message: "",
        errors: [],
        data: []
    }
    if (!req.user) {
        response.status = 500
        response.message = "Nimate dostopa do tega dela aplikacije"
        res.send(response)
    }
    else {
        connection.query(`UPDATE mechanic_bookings SET booking_status_id = 2, mechanic_id = ${req.user.id} WHERE id = ${req.params.id}`, (err, rows, fields) => {
            if (err) {
                response.status = 500
                response.message = "Prislo je do napake pri obdelavi zadeve"
                response.errors.push(err)
            }
            else {
                response.status = 200
                response.message = "ok"
                response.data = []
            }
            res.send(response)
        })
    }
})
app.post("/finishBooking/:id", (req, res) => {
    let response = {
        status: 0,
        message: "",
        errors: [],
        data: []
    }
    if (!req.user) {
        response.status = 500
        response.message = "Nimate dostopa do tega dela aplikacije"
        res.send(response)
    }
    else {
        connection.query(`UPDATE mechanic_bookings SET booking_status_id = 4,mechanic_id = ${req.user.id} WHERE id = ${req.params.id}`, (err, rows, fields) => {
            if (err) {
                response.status = 500
                response.message = "Prislo je do napake pri obdelavi zadeve"
                response.errors.push(err)
            }
            else {
                response.status = 200
                response.message = "ok"
                response.data = []
            }
            res.send(response)
        })
    }
})
app.get("/cancelBooking/:id", (req, res) => {
    let response = {
        status: 0,
        message: "",
        errors: [],
        data: []
    }
    if (!req.user) {
        response.status = 500
        response.message = "Nimate dostopa do tega dela aplikacije"
        res.send(response)
    }
    else {
        connection.query(`UPDATE mechanic_bookings SET booking_status_id = 3,mechanic_id = ${req.user.id} WHERE id = ${req.params.id}`, (err, rows, fields) => {
            if (err) {
                response.status = 500
                response.message = "Prislo je do napake pri obdelavi zadeve"
                response.errors.push(err)
            }
            else {
                response.status = 200
                response.message = "ok"
                response.data = []
            }
            res.send(response)
        })
    }
})


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("join", function (room) {
        console.log("room number " + room)
        socket.join(room)
    })
    socket.on('bookMechanic', (data) => {
        console.log("booking a mechanic")
        console.log(data)
        socket.to(5).emit("newBooking", "new booking incoming")
    })
    socket.on('bookingAccepted', (booking_id) => {
        socket.to(1).emit("bookingAccepted", "Vaš zahtevek je sprejet. Mehanik bo prišel na zahtevo")
    })
});

server.listen(port, () => {
    console.log('server is running');
})
