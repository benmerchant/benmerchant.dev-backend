const config = {
  port: process.env.PORT || 3005,
  db: 'mongodb://localhost/startpos',
  test_port: 4000,
  test_db: 'mongodb://localhost/startpos_test'
}

module.exports = config;
