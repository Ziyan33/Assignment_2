let express=require('express');
let router=express.Router();
let mongoose=require('mongoose');

let jwt = require('jsonwebtoken');

//create a reference to the model
let Contact=require('../models/contact');

module.exports.displayContactList=(req,res,next)=>{
  Contact.find((err,contactList)=>{
        if(err)
        {
            return console.error(err);
        }
        else
        {
            //console.log(ContactList);
            res.render('contact/list',
            {title: 'Contact-List',
            ContactList: contactList,
            displayName: req.user?req.user.displayName:''});
        }
    });
}

module.exports.displayAddPage=(req,res,next)=>{
    res.render('contact/add',
    {title:'Add Contact',
    displayName:req.user?req.user.displayName:''});
}

module.exports.processAddPage=(req,res,next)=>{
    let newContact=Contact({
        "name":req.body.name,//get the name from the form
        "contactNum":req.body.contactNum,
        "email":req.body.email
    });

    Contact.create(newContact,(err,Contact)=>{
        if(err)
        {
            console.log(err);
            res.end(err);
        }
        else
        {
            //refresh the contact list
            res.redirect('/contact-list');
        }
    });
}

module.exports.displayEditPage=(req,res,next)=>{
    let id = req.params.id; //id of actual object

    Contact.findById(id, (err, contactToEdit) => {
      if (err) 
      {
        console.log(err);
        res.end(err);
      } 
      else 
      {
        //show the edit view
        res.render('contact/edit', 
        { title: "Edit Contact", 
        contact: contactToEdit,
        displayName: req.user?req.user.displayName:'' });
      }
    });
}

module.exports.processEditPage=(req,res,next)=>{
    let id = req.params.id; //id of actual object

    let updatedContact=Contact({
        "_id":id, //keep the same id to overwrite it
        "name":req.body.name,//get the name from the form
        "contactNum":req.body.contactNum,
        "email":req.body.email
    });

    Contact.updateOne({_id: id }, updatedContact, (err) => {
        if (err) 
        {
          console.log(err);
          res.end(err);
        } 
        else 
        {
          //refresh the contact list
          res.redirect("/contact-list");
        }
      });
}

module.exports.performDelete=(req,res,next)=>{
    let id = req.params.id;
    
    Contact.remove({_id: id }, (err) => {
        if (err) 
        {
          console.log(err);
          res.end(err);
        } 
        else 
        {
          //refresh the Contact list
          res.redirect("/contact-list");
        }
      });
}