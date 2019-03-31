// set the environment variable
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Menu = require('../app/models/menu.model');
const Item = require('../app/models/item.model');

const chai = require('chai');
// switching to 'expect' as it seems less clumsy
const expect = chai.expect;
const chaiHttp = require('chai-http');

const server = require('../server');

const baseItemURL = '/api/items';


chai.use(chaiHttp);

describe('Items', () => {
  beforeEach((done) => {
    Item.remove({}, (err) => {
      if(err) console.error(err);
      done();
    });
  });
  describe('/GET all the items', () => {
    it('it should GET all the items', (done) => {
      chai.request(server)
          .get(baseItemURL)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('msg').eql('Successfully retrieved all items');
            expect(res.body).to.have.property('items');
            expect(res.body.items).to.be.an('array');
            expect(res.body.items.length).to.be.eql(0);
          done();
          });
    });
    it('it should GET one item by id', (done) => {
      // there has to be a better way to write these tests
      Menu.remove({}, (err) => {
        if(err) console.error(err);
      });
      const newMenuHeading = new Menu({
        menu_heading: 'Second Breakfast',
        printer: 'Main'
      }); // menu headings are required for items
      // need to learn mocks and stubs
      newMenuHeading.save((err,newMenu) => {
        const newItem = new Item({
          name: 'Shark Bites',
          price: 14.99,
          description: 'Delicious fried chunks of shark meat.',
          menu: {
            _id: newMenu.id,
            menu_heading: newMenu.menu_heading
          }
        });

        newItem.save((err, item) => {
          chai.request(server)
              .get(`${baseItemURL}/${item.id}`)
              .end((err, res) => {

                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('msg').eql('Successfully found the item');
                expect(res.body).to.have.property('item').which.is.an('object');
                expect(res.body.item).to.have.property('name').eql(newItem.name);
                expect(res.body.item).to.have.property('price').eql(newItem.price);
                expect(res.body.item).to.have.property('description').eql(newItem.description);
                expect(res.body.item).to.have.property('menu').which.is.an('object');
                expect(res.body.item.menu).to.have.property('_id').eql(newMenu.id);
                expect(res.body.item.menu).to.have.property('menu_heading').eql(newMenu.menu_heading);
              done();
              });
        });

      });
    });
  });
  describe('/POST a new item', () => {
    it('it should POST a new item', (done) => {
      Menu.remove({}, (err) => {
        if(err) console.error(err);
        const newMenuHeading = new Menu({
          menu_heading: 'Second Breakfast',
          printer: 'Main'
        });
        newMenuHeading.save((err,newMenu) => {
          const newItem = {
            name: 'Shark Bites',
            price: 14.99,
            description: 'Delicious fried chunks of shark meat.',
            menu: {
              _id: newMenu.id,
              menu_heading: newMenu.menu_heading
            }
          };

          chai.request(server)
              .post(baseItemURL)
              .send(newItem)
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('msg').eql('Successfully created new item');
                expect(res.body).to.have.property('item').which.is.an('object');
                expect(res.body.item).to.have.property('name').eql(newItem.name);
                expect(res.body.item).to.have.property('price').eql(newItem.price);
                expect(res.body.item).to.have.property('description').eql(newItem.description);
                expect(res.body.item).to.have.property('menu').which.is.an('object');
                expect(res.body.item.menu).to.have.property('_id').eql(newMenu.id);
                expect(res.body.item.menu).to.have.property('menu_heading').eql(newMenu.menu_heading);
              done();
              });
      });

      });
    });


  });

});
