//including npm modules
const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      mongoose = require("mongoose");
      Campground = require("./models/campground")
app.use(bodyParser.urlencoded({ extended: true }));

//Connecting database
mongoose.connect("mongodb://localhost/camping", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to DB"))
    .catch(error => console.log(error.message));

//DB Schema setup


/* Campground.create({
    name: "Rekstino miško poilsiavietė",
    image: "https://www.pamatyklietuvoje.lt/api/Photo/b72d034a-84b3-4ddc-87db-1842ac2704f5/0/2522/2214/resize",
    description: "This I know nothing about"
}, (err, person) => {
    if(err){
        console.log("something went wrong");
        console.log(err);
    } else {
        console.log(person);
    }
}); */

//adding .ejs to render commands
app.set("view engine", "ejs");

//serving images, CSS files, and JavaScript files in a directory named public
app.use(express.static("public"));

//landing page
app.get("/", (req, res) => {
    res.render("landing");
});

//INDEX route - show all campgrounds
app.get("/campgrounds", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if(err){
            console.log("something went wrong");
            console.log(err);
        } else {
            res.render("index", { campgrounds: allCampgrounds });
        }
    });
});

//CREATE route - add new campground to DB
app.post("/campgrounds", (req, res) => {
    const newCampground = { name: req.body.newCampground, image: req.body.newURL, description: req.body.description };
    
    Campground.create(newCampground, (err, campground) => {
            if(err){
                console.log("something went wrong");
                console.log(err);
            } else {
                res.redirect("/campgrounds");
            }
        }
    );
});

//NEW route - show form to create new campground
app.get("/campgrounds/new", (req, res) => {
    res.render("new");
});

//SHOW route - shows more info about one campground
app.get("/campgrounds/:id", (req, res) => {

    Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
            console.log("something went wrong");
            console.log(err);
        } else {
            res.render("show", {campground: foundCampground});
        }
    });

});

// redirect to landing page if unknown path
app.get("*", (req, res) => {
    res.redirect("/");
});

// launching server on port 3000
app.listen(3000, () => {
    console.log("CamPing server has started");
});