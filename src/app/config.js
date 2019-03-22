// use a class here and build this!
export const config = {
  'production': {
    port: process.env.PORT || 3000,
    db: 'benjaminsfuture'
  },
  'test': {
    test_port: 4000,
    db: 'bendevdottest'
  },
  'development': {
    port: 3005,
    db: 'bendevelop'
  }
};
