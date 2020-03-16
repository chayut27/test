var express = require('express');
var router = express.Router();
const monk = require('monk');
const { check, validationResult } = require('express-validator');

const url = 'localhost:27017/TutorialDB';
const db = monk(url);

/* GET users listing. */
router.get('/', function(req, res, next) {
  const ct = db.get('blog')
  
  ct.find({},{}).then((docs) => {
    console.log(docs); 
    res.render('blog', {blogs : docs});
  })
    

});

router.get('/add', function(req, res, next) {
  res.render("addblog"); // render view product
});

router.post('/add',[
  check('name', 'Please Input your blog name').not().isEmpty(),
  check('description', 'Please Input your description').not().isEmpty(),
  check('author', 'Please Input your author').not().isEmpty(),
], function(req, res, next) {
  const result = validationResult(req);
  var errors = result.errors;
  if (!result.isEmpty()) {
    // return res.status(422).json({ errors: errors.array() });
    res.render('addblog', {errors:errors});
  }else{
    var ct = db.get('blogs');
    ct.insert({
      name: req.body.name,
      description: req.body.description,
      author: req.body.author,
    })
    .then((docs) => {
      // docs contains the documents inserted with added **_id** fields
      // Inserted 3 documents into the document collection


      req.flash("error", "บันทึกข้อมูลสำเร็จ.");

      // res.location('/blog/add');
      res.redirect('/blog/add');
    }).catch((err) => {
      // An error happened while inserting
      res.send(err);
    }).then(() => db.close())
  }
  // console.log(req.body.name);
  // console.log(req.body.description);
  // console.log(req.body.author);
  // res.render("addblog"); // render view product
});



module.exports = router;
