const express = require("express");
const app = express();
const path = require("path");
const exphbs = require("express-handlebars"); // templates for html
const methodOverride = require("method-override"); // Poder enviar por metodos PUT y DELETE desde formularios html
const session = require("express-session");
const flash = require("connect-flash"); // send msg al usuario
const passport = require("passport"); // manejo de inicio de sesiones y validacion
require("./database");
require("./config/passport");

// settings

app.set("port", process.env.PORT || 3000);
    // configuracion de templates
app.set("views", path.join(__dirname, 'views'));
app.engine(".hbs",  exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get("views"), 'layouts'),
    partialsDir: path.join(app.get("views"), 'partials'),
    extname: '.hbs'
}));
app.set("view engine", ".hbs");

// middlewares

app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// global variables

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

// routes

app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

// static files

app.use(express.static(path.join(__dirname, 'public'))); // definir archivos publicos

// server listening...

app.listen(app.get("port"), () => {
    console.log("Server on port", app.get("port"));
});
