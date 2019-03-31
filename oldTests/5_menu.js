// set the environment variable
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Menu = require('../app/models/menu.model');

const chai = require('chai');
// switching to 'expect' as it seems less clumsy
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../server');

const baseMenuURL = '/api/menus';


chai.use(chaiHttp);

describe('Menus', () => {
  beforeEach((done) => {
    Menu.remove({}, (err) => {
      if(err) console.error(err);
      done();
    });
  });
  describe('/GET all the menus', () => {
    it('it should GET all the menus', (done) => {
      chai.request(server)
          .get(baseMenuURL)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('msg').eql('Successfully retrieved all menus');
            expect(res.body).to.have.property('menus');
            expect(res.body.menus).to.be.an('array');
            expect(res.body.menus.length).to.be.eql(0);
          done();
          });
    });
    it('it should GET one menu by id', (done) => {
      const newMenuHeading = new Menu({
        menu_heading: 'Second Breakfast',
        printer: 'Main'
      });
      newMenuHeading.save((err, menu) => {
        chai.request(server)
            .get(`${baseMenuURL}/${menu.id}`)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body).to.be.an('object');
              expect(res.body).to.have.property('msg').eql('Successfully found the menu');
              expect(res.body).to.have.property('menu').which.is.an('object');
              expect(res.body.menu).to.have.property('menu_heading').eql(newMenuHeading.menu_heading);
              expect(res.body.menu).to.have.property('printer').eql(newMenuHeading.printer);
            done();
            });
      });
    });
  });
  describe('/POST new menu', () => {
    it('it should POST a new menu', (done) => {
      const newMenuPostData = {
        menu_heading: 'Second Breakfast',
        printer: 'Main'
      };
      chai.request(server)
          .post(baseMenuURL)
          .send(newMenuPostData)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('msg').eql('Successfully created new menu');
            expect(res.body).to.have.property('menu');
            expect(res.body.menu).to.have.property('menu_heading').eql(newMenuPostData.menu_heading);
            expect(res.body.menu).to.have.property('printer').eql(newMenuPostData.printer);

          done();
          });
    });
  });
});
