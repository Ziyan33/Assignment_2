//contact route; when I type url contact.list, 
//it will be able to view all the contacts in the database
  
let express=require('express');
let router=express.Router();
let mongoose=require('mongoose');
const { render } = require('../config/app');

let jwt=require('jsonwebtoken');

let passport=require('passport');

/* *this is happening in the login site
//connect to our Contact Model
let Contact=require('../models/contact');
*/

let contactController=require('../controllers/contact');

//helper function for guard purpose
function requireAuth(req,res,next)
{
    //check if the user is logged in
    if(!req.isAuthenticated())
    {
        return res.redirect('/login');
    }
    next();//allow us to go to next call
}

/*Get Route for the Contact List page - READ OPeration */
router.get('/',contactController.displayContactList);

/*Get Route for displaying Add page - CREATE OPeration */
router.get('/add',requireAuth, contactController.displayAddPage);


/*POST Route for processing the Add page - CREATE OPeration */
router.post('/add',requireAuth, contactController.processAddPage);


/*Get Route for displaying Edit page - UPDATE OPeration */
//":id" means search for particular id from the parameter
//pass the information from the contactlist into thee edit page

router.get('/edit/:id',requireAuth, contactController.displayEditPage);

/*POST Route for processing the Edit page - UPDATE OPeration */
router.post('/edit/:id',requireAuth, contactController.processEditPage);

/*Get to perform Deletion - DELETE OPeration */
router.get('/delete/:id',requireAuth, contactController.performDelete);

module.exports=router;