"use strict"
const Restaurant = require('../models/restaurant');

// GET restaurant
// this will only ever return one document
// can't think of a better way to store this info
exports.getRestaurant = (req,res,next) => {
  Restaurant.find({}).exec((err, restaurant) => {
    if(err) res.status(500).json({error: err});
    else return res.status(200).json({msg: 'Successfully retrieved restaurant', restaurant: restaurant});
  });
};

// POST new restaurant
exports.createRestaurant = (req, res, next) => {
  // in the view, we will have the manager enter taxes as integers
  // and handle the conversion to percentages here
  const newRestaurant = new Restaurant({
    name: req.body.name,
    store_number: req.body.store_number,
    state_tax: req.body.state_tax/100,
    local_tax: req.body.local_tax/100
  });
  newRestaurant.save((err, restaurant) => {
    if(err) res.status(422).json({error: err});
    else res.status(200).json({msg: 'Successfully created restaurant', restaurant: restaurant});
  });
};

// PUT restaurant updates
// if updating hours: must be wrapped in 'store_hours: {}'
// req.body should only contain days to be updated formatted as such :
// {store_hours:
//  {
//       monday: { open: false },
//       saturday: {start_time: 0900, end_time: 2330, open: true }
//  }
// }
// function will replace the entire day with whatever it says
// so if normally the store is open and we want to close that day
// we only need to send { open: false } and the start and end times will overwritten
//
// if updating tax, the fn will convert to a percentage before saving to db
exports.updateRestaurant = (req, res, next) => {
  let updateObj = {};
  if(req.body.hasOwnProperty('store_hours')){
    let daysToUpdate = [];
    // get the days we actually want to update from the req.body.store_hours
    for(let key in req.body.store_hours){
      daysToUpdate.push(key);
    }
    // build an update object for Mongoose
    daysToUpdate.forEach(function(day){
      updateObj[`store_hours.${day}`] = req.body.store_hours[day];
    });
  } else if(req.body.hasOwnProperty('state_tax')){
    updateObj = { state_tax: (req.body.state_tax/100) };
  } else if(req.body.hasOwnProperty('local_tax')){
    updateObj = { local_tax: (req.body.local_tax/100) };
  } else{
    updateObj = req.body;
  }

  Restaurant.findByIdAndUpdate(
    req.params.id,
    {$set: updateObj},
    {new: true},
    (err, restaurant) => {
      if(err) res.status(422).json({errors: err});
      else res.status(200).json({msg: 'Successfully updated restaurant', restaurant: restaurant});
    }
  );
};

exports.addDiningArea = (req,res,next) => {

  Restaurant.findByIdAndUpdate(
    req.params.restaurantID,
    {$push: {dining_areas: {name: req.body.new_dining_area}}},
    {new: true, safe: true},
    (err, restaurant) => {
      if(err) res.status(422).json({errors: err});
      else res.status(200).json({msg: 'Successfully added dining area', restaurant: restaurant});
    }
  );
};
