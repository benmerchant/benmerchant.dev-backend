// set the environment variable
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Restaurant = require('../app/models/restaurant');
const server = require('../server');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;
chai.use(chaiHttp);

// parent block
describe('Restaurant', () => {
  beforeEach((done) => {
    Restaurant.remove({},(err) => {
      if(err) console.error(err);
      done();
    });
  });
  describe('/GET the restaurant', () => {
    it('it should GET restaurant document', (done) => {
      chai.request(server)
          .get('/api/restaurant')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('msg').eql('Successfully retrieved restaurant');
            expect(res.body).to.have.property('restaurant').which.is.an('array');
            expect(res.body.restaurant.length).to.be.eql(0);
          done();
          });
    });
  });
  describe('/POST create restaurant', () => {
    it('it should POST a new restaurant', (done) => {
      const newRestaurant = {
        store_number: 1,
        name: 'Ben\'s Fine Steakery',
        state_tax: 6,
        local_tax: 1
      };
      chai.request(server)
          .post('/api/restaurant')
          .send(newRestaurant)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('msg').eql('Successfully created restaurant');
            expect(res.body).to.have.property('restaurant').which.is.an('object');
            expect(res.body.restaurant).to.have.property('store_number').eql(newRestaurant.store_number);
            expect(res.body.restaurant).to.have.property('name').eql(newRestaurant.name);
            expect(res.body.restaurant).to.have.property('state_tax').eql(newRestaurant.state_tax/100);
            expect(res.body.restaurant).to.have.property('local_tax').eql(newRestaurant.local_tax/100);
          done();
          });
    });
  });
  describe('/PUT update restaurant', () => {
    it('it should UPDATE new restaurant - add store hours (only affect desired days)', (done) => {
        const newRestaurant = new Restaurant({
          store_number: 1,
          name: 'Ben\'s Fine Steakery',
          state_tax: (6/100), // go ahead and convert to percentages here for testing purposes
          local_tax: (1/100)
        });
        newRestaurant.save((err, restaurant) => {
          chai.request(server)
              .put(`/api/restaurant/${restaurant.id}`)
              .send({store_hours: {
                monday: {start_time: 1000, end_time: 2200, open: true },
                tuesday: {start_time: 1000, end_time: 2200, open: true },
                wednesday: {start_time: 1000, end_time: 2200, open: true },
                thursday: {start_time: 1000, end_time: 2200, open: true },
                friday: {start_time: 1000, end_time: 2200, open: true },
                saturday: {start_time: 1000, end_time: 2300, open: true }
              }})
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('msg').eql('Successfully updated restaurant');
                expect(res.body).to.have.property('restaurant').which.is.an('object');
                expect(res.body.restaurant).to.have.property('store_hours').which.is.an('object');
                expect(res.body.restaurant.store_hours).to.have.property('monday').which.is.an('object');
                expect(res.body.restaurant.store_hours).to.have.property('tuesday').which.is.an('object');
                expect(res.body.restaurant.store_hours).to.have.property('wednesday').which.is.an('object');
                expect(res.body.restaurant.store_hours).to.have.property('thursday').which.is.an('object');
                expect(res.body.restaurant.store_hours).to.have.property('monday').which.is.an('object');
                expect(res.body.restaurant.store_hours).to.have.property('saturday').which.is.an('object');
                expect(res.body.restaurant.store_hours).to.have.property('sunday').which.is.an('object');
                expect(res.body.restaurant.store_hours.sunday).to.have.property('open').eql(false);
              done();
              });
        });
    });
    it('it should UPDATE store hours (only affect desired days)', (done) => {
        const newRestaurant = new Restaurant({
          store_number: 1,
          name: 'Ben\'s Fine Steakery',
          state_tax: (6/100), // go ahead and convert to percentages here for testing purposes
          local_tax: (1/100),
          store_hours: {
            monday: {start_time: 1000, end_time: 2200, open: true },
            tuesday: {start_time: 1000, end_time: 2200, open: true },
            wednesday: {start_time: 1000, end_time: 2200, open: true },
            thursday: {start_time: 1000, end_time: 2200, open: true },
            friday: {start_time: 1000, end_time: 2200, open: true },
            saturday: {start_time: 1000, end_time: 2300, open: true }
          }
        });
        newRestaurant.save((err, restaurant) => {
          chai.request(server)
              .put(`/api/restaurant/${restaurant.id}`)
              .send({store_hours: {
                monday: {open: false},
                saturday: {start_time: 0900, end_time: 2330, open: true }
              }})
              .end((err, res) => {
                //console.log(res.body.restaurant);
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('msg').eql('Successfully updated restaurant');
                expect(res.body).to.have.property('restaurant').which.is.an('object');
                expect(res.body.restaurant).to.have.property('store_hours').which.is.an('object');
                expect(res.body.restaurant.store_hours).to.have.property('monday').which.is.an('object');
                expect(res.body.restaurant.store_hours.monday).to.have.property('open').eql(false);
                expect(res.body.restaurant.store_hours).to.have.property('tuesday').which.is.an('object');
                expect(res.body.restaurant.store_hours.tuesday).to.have.property('start_time').eql(newRestaurant.store_hours.tuesday.start_time);
                expect(res.body.restaurant.store_hours.tuesday).to.have.property('end_time').eql(newRestaurant.store_hours.tuesday.end_time);
                expect(res.body.restaurant.store_hours).to.have.property('wednesday').which.is.an('object');
                expect(res.body.restaurant.store_hours).to.have.property('thursday').which.is.an('object');
                expect(res.body.restaurant.store_hours).to.have.property('monday').which.is.an('object');
                expect(res.body.restaurant.store_hours).to.have.property('saturday').which.is.an('object');
                expect(res.body.restaurant.store_hours.saturday).to.have.property('start_time').eql(0900);
                expect(res.body.restaurant.store_hours.saturday).to.have.property('end_time').eql(2330);
                expect(res.body.restaurant.store_hours).to.have.property('sunday').which.is.an('object');
              done();
              });
        });
    });
    it('it should UPDATE restaurant\'s name specified by id', (done) => {
        const newRestaurant = new Restaurant({
          store_number: 1,
          name: 'Ben\'s Fine Steakery',
          state_tax: (6/100), // go ahead and convert to percentages here for testing purposes
          local_tax: (1/100)
        });
        newRestaurant.save((err, restaurant) => {
          chai.request(server)
              .put(`/api/restaurant/${restaurant.id}`)
              .send({ name: 'Ben\'s Grille'})
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('msg').eql('Successfully updated restaurant');
                expect(res.body).to.have.property('restaurant').which.is.an('object');
                expect(res.body.restaurant).to.have.property('name').which.is.an('string').eql('Ben\'s Grille');
              done();
              });
        });
    });
    it('it should UPDATE restaurant\'s state_tax specified by id', (done) => {
        const newRestaurant = new Restaurant({
          store_number: 1,
          name: 'Ben\'s Fine Steakery',
          state_tax: (6/100), // go ahead and convert to percentages here for testing purposes
          local_tax: (1/100)
        });
        newRestaurant.save((err, restaurant) => {
          chai.request(server)
              .put(`/api/restaurant/${restaurant.id}`)
              .send({
                state_tax: 8
              })
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('msg').eql('Successfully updated restaurant');
                expect(res.body).to.have.property('restaurant').which.is.an('object');
                expect(res.body.restaurant).to.have.property('state_tax').which.is.an('number').eql(8/100);
              done();
              });
        });
    });
    it('it should UPDATE restaurant\'s local_tax specified by id', (done) => {
        const newRestaurant = new Restaurant({
          store_number: 1,
          name: 'Ben\'s Fine Steakery',
          state_tax: (6/100), // go ahead and convert to percentages here for testing purposes
          local_tax: (1/100)
        });
        newRestaurant.save((err, restaurant) => {
          chai.request(server)
              .put(`/api/restaurant/${restaurant.id}`)
              .send({
                local_tax: '1.5'
              })
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('msg').eql('Successfully updated restaurant');
                expect(res.body).to.have.property('restaurant').which.is.an('object');
                expect(res.body.restaurant).to.have.property('local_tax').which.is.an('number').eql(1.5/100);
              done();
              });
        });
    });
    it('it should not UPDATE restaurant\'s local_tax if non-numeric - Mongoose', (done) => {
        const newRestaurant = new Restaurant({
          store_number: 1,
          name: 'Ben\'s Fine Steakery',
          state_tax: (6/100), // go ahead and convert to percentages here for testing purposes
          local_tax: (1/100)
        });
        newRestaurant.save((err, restaurant) => {
          chai.request(server)
              .put(`/api/restaurant/${restaurant.id}`)
              .send({
                local_tax: 'notAnumber'
              })
              .end((err, res) => {
                expect(res).to.have.status(422);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('errors').which.is.an('object');
                expect(res.body.errors).to.have.property('path').eql('local_tax');
                expect(res.body.errors).to.have.property('kind').eql('number');
              done();
              });
        });
    });
    it('it should not UPDATE restaurant\'s state_tax if non-numeric - Mongoose', (done) => {
        const newRestaurant = new Restaurant({
          store_number: 1,
          name: 'Ben\'s Fine Steakery',
          state_tax: (6/100), // go ahead and convert to percentages here for testing purposes
          local_tax: (1/100)
        });
        newRestaurant.save((err, restaurant) => {
          chai.request(server)
              .put(`/api/restaurant/${restaurant.id}`)
              .send({
                state_tax: 'notAnumber'
              })
              .end((err, res) => {
                expect(res).to.have.status(422);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('errors').which.is.an('object');
                expect(res.body.errors).to.have.property('path').eql('state_tax');
                expect(res.body.errors).to.have.property('kind').eql('number');
              done();
              });
        });
    });
  });
});
