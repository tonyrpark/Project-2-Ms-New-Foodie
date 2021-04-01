const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const axios = require("axios");
const unirest = require("unirest");

router.get("/", (req, res) => {
  var restaurantData;
  var rapReq = unirest(
    "GET",
    "https://us-restaurant-menus.p.rapidapi.com/restaurants/search/geo"
  );

  rapReq.query({
    lon: "-73.992378\t",
    lat: "40.68919",
    distance: "5",
    page: "1",
  });

  rapReq.headers({
    "x-rapidapi-key": "980fbf3eb4msh7995ecf778f3f83p1f9cdejsn73478224c087",
    "x-rapidapi-host": "us-restaurant-menus.p.rapidapi.com",
    useQueryString: true,
  });

  rapReq.end(function (response) {
    if (response.error) {
      console.log(response.error);
    }

    restaurantData = response.body.result.data;
    res.render("homepage", {
      restaurantData,
      loggedIn: req.session.loggedIn,
    });
  });
});

router.get("/search/:id", (req, res) => {
  var zipCode = req.params.id;
  var restaurantData, slicedData;
  var rapReq = unirest(
    "GET",
    `https://us-restaurant-menus.p.rapidapi.com/restaurants/zip_code/${zipCode}`
  );

  rapReq.query({
    page: "1",
  });

  rapReq.headers({
    "x-rapidapi-key": "980fbf3eb4msh7995ecf778f3f83p1f9cdejsn73478224c087",
    "x-rapidapi-host": "us-restaurant-menus.p.rapidapi.com",
    useQueryString: true,
  });

  rapReq.end(function (response) {
    if (response.error) {
      console.log(response.error);
    }

    restaurantData = response.body.result.data;
    // only show top 5 results
    if (restaurantData.length > 5) {
      restaurantData = restaurantData.slice(0, 5);
    }
    res.render("homepage", {
      restaurantData,
      loggedIn: req.session.loggedIn,
    });
  });
});

router.get("/notInUse", (req, res) => {
  console.log(req.session);

  Post.findAll({
    attributes: ["id", "title", "created_at", "post_content"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username", "twitter", "github"],
        },
      },
      {
        model: User,
        attributes: ["username", "twitter", "github"],
      },
    ],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      console.log(posts);
      res.render("homepage", {
        posts,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("signup");
});

router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: ["id", "title", "created_at", "post_content"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username", "twitter", "github"],
        },
      },
      {
        model: User,
        attributes: ["username", "twitter", "github"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      // serialize the data
      const post = dbPostData.get({ plain: true });

      // pass data to template
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
