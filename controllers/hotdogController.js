const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Hotdog = mongoose.model('Hotdog');

router.get('/', (req, res) => {
    res.render("hotdog/addOrEdit", {
        viewTitle: "Add Hotdog"
    });
});
router.post('/', (req, res) => {
    if (req.body._id == '')
        insertRecord(req, res);
        else
        updateRecord(req, res);
    });

    function insertRecord(req, res){
        var hotdog = new Hotdog();
        hotdog.Name = req.body.Name;
        hotdog.ID = req.body.ID;
        hotdog.save((err, doc) => {
            if (!err)
            res.redirect('hotdog/list');
            else {
                if(err.name == 'ValidationError') {
                    handleValidationError(err, req.body);
                    res.render("hotdog/addOrEdit", {
                        viewTitle: "Add Hotdog",
                        hotdog: req.body
                    });
                }
                else
                console.log('Error during record adding : ' + err);
            }
        });
    }
    function updateRecord(req, res) {
        Hotdog.findOneAndUpdate({ _id: req.body._id}, req.body, { new: true, useFindAndModify: false }, (err, doc) => {
            if (!err) { res.redirect('hotdog/list');}
            else {
                if (err.name == 'ValidationError') {
                    handleValidationError(err, req.body);
                    res.render("hotdog/addOrEdit", {
                        viewTitle: 'Update hotdog',
                        hotdog: req.body
                  });
                }
                else
                console.log('Error during record update : ' + err);
            }
        });
    }
router.get('/list', (req, res) => {
  Hotdog.find((err, docs) => {
  if (!err) {
      res.render("hotdog/list", {
          list: docs
      });
  }
  else {
      console.log('Error in retrieving hotdog list :' + err);
  }
 });
});
function handleValidationError(err, body) {
   for(field in err.errors) {
       switch (err.errors[field].path) {
           case 'Name': 
           body['NameError'] = err.errors[field].message;
           break;
           case 'ID':
               body['IDError'] = err.errors[field].message;
               break;
      }
   }
}
router.get('/:id', (req, res) => {
 Hotdog.findById(req.params.id, (err, doc) => {
     if (!err) {
         res.render("hotdog/addOrEdit", {
             viewTitle: "Update hotdog",
             hotdog: doc
         });
     }
 });
});
router.get('/delete/:id', (req, res) => {
    Hotdog.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/hotdog/list');
        }
        else { console.log ('Error in hotdog delete :' + err);}
    });
});
module.exports = router;