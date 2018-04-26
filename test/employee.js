// set the environment variable
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Employee = require('../app/models/employee');

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const sinonMongoose = require('sinon-mongoose');

const server = require('../server');
const should = chai.should();


chai.use(chaiHttp);

// parent block
describe('Employees',() => {
  beforeEach((done) => { // empty db before each test
    // how will I be able to test for Mongoose dup_key errors on unique/indexed fields
    Employee.remove({},(err) => {
      if(err) console.error(err);
      done();
    });
  });
  // test the /GET route
  describe('/GET all employees', () => {
    it('it should GET all the employees', (done) => {
      chai.request(server)
          .get('/api/employees')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('employees');
            res.body.employees.should.be.a('array');
          done();
        });
    });
  });

  describe('/POST create Employee', () => {
    it('it should not POST an employee without login_number field', (done) => {
      let employee = {
        first_name: 'Jon'
      };
      chai.request(server)
          .post('/api/employees')
          .send(employee)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('errors');
            res.body.error.errors.should.have.property('login_number');
            res.body.error.errors.login_number.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST an employee without first_name field', (done) => {
      let employee = {
        login_number: 123456
      };
      chai.request(server)
          .post('/api/employees')
          .send(employee)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.be.an('object');
            res.body.should.have.property('error');
            res.body.error.should.have.property('errors');
            res.body.error.errors.should.have.property('first_name');
            res.body.error.errors.first_name.should.have.property('kind').eql('required');
          done();
        });
    });
    it('it should POST a new employee', (done) => {
      let employee = {
        first_name: 'Jon',
        login_number: 123456
      };
      chai.request(server)
          .post('/api/employees')
          .send(employee)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.an('object');
            res.body.should.have.property('msg').eql('Employee successfully added');
            res.body.should.have.property('employee');
            res.body.employee.should.have.property('first_name');
            res.body.employee.should.have.property('login_number');
          done();
        });
    });
  });
});
