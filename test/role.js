// set the environment variable
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Role = require('../app/models/role');

const chai = require('chai');
// switching to 'expect' as it seems less clumsy
const expect = require('chai').expect;
const chaiHttp = require('chai-http');

const server = require('../server');


chai.use(chaiHttp);

describe('Roles', () => {
  beforeEach((done) => {
    Role.remove({},(err) => {
      if(err) console.error(err);
      done();
    });
  });
  // test the /GET route
  describe('/GET all roles', () => {
    it('it should GET all the roles', (done) => {
      chai.request(server)
          .get('/api/roles')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('roles');
            expect(res.body.roles).to.be.an('array');
            expect(res.body.roles.length).to.be.eql(0);
          done();
        });
    });
  });
  // test /POST route
  describe('/POST create new role', () => {
    it('it should not POST a new role without name field - Mongoose', (done) => {
      const role = {
        salaried: false,
        granular_pay: 2.50,
        manager_privileges: false
      };
      //console.log(role.name instanceof String);
      chai.request(server)
          .post('/api/roles')
          .send(role)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('name');
            expect(res.body.error.errors.name).to.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a new role without salaried field - Mongoose', (done) => {
      const role = {
        name: 'Server',
        granular_pay: 2.50,
        manager_privileges: false
      };
      //console.log(role.name instanceof String);
      chai.request(server)
          .post('/api/roles')
          .send(role)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('salaried');
            expect(res.body.error.errors.salaried).to.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a new role without granular_pay field - Mongoose', (done) => {
      const role = {
        name: 'Server',
        salaried: false,
        manager_privileges: false
      };
      //console.log(role.name instanceof String);
      chai.request(server)
          .post('/api/roles')
          .send(role)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('granular_pay');
            expect(res.body.error.errors.granular_pay).to.have.property('kind').eql('required');
          done();
        });
    });
    it('it should not POST a new role if granular_pay not a number - Mongoose', (done) => {
      const role = {
        name: 'Server',
        salaried: false,
        granular_pay: 'NaN its a String',
        manager_privileges: false
      };
      //console.log(role.name instanceof String);
      chai.request(server)
          .post('/api/roles')
          .send(role)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('granular_pay');
            expect(res.body.error.errors.granular_pay).to.have.property('kind').eql('Number');
          done();
        });
    });
    it('it should not POST a new role without manager_privileges field - Mongoose', (done) => {
      const role = {
        name: 'Server',
        salaried: false,
        granular_pay: 2.50
      };
      //console.log(role.name instanceof String);
      chai.request(server)
          .post('/api/roles')
          .send(role)
          .end((err, res) => {
            expect(res).to.have.status(422);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error');
            expect(res.body.error).to.have.property('errors');
            expect(res.body.error.errors).to.have.property('manager_privileges');
            expect(res.body.error.errors.manager_privileges).to.have.property('kind').eql('required');
          done();
        });
    });
    it('it should POST a new role', (done) => {
      const role = {
        name: 'Server',
        salaried: false,
        granular_pay: 2.50,
        manager_privileges: false
      };
      //console.log(role.name instanceof String);
      chai.request(server)
          .post('/api/roles')
          .send(role)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('msg').eql('Role successfully created');
            expect(res.body).to.have.property('role');
            expect(res.body.role).to.have.property('name');
            expect(res.body.role).to.have.property('salaried');
            expect(res.body.role).to.have.property('granular_pay');
            expect(res.body.role).to.have.property('manager_privileges');
          done();
        });
    });
  });
});
