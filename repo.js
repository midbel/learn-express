const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('data/test.db')

exports.authenticate = (email, passwd) => {
  return new Promise((resolve, reject) => {
    db.get("select * from profiles where email=:email", email, (err, row) => {
      if (err || row === undefined) {
        reject(err)
        return
      }
      resolve(row)
    })
  })
}

exports.getProfiles = () => {
  return new Promise((resolve, reject) => {
    db.all('select * from profiles', (err, rows) => {
      if (err) {
        reject(err)
        return
      }
      resolve(rows)
    })
  })
}

exports.getProfile = (id) => {
  return new Promise((resolve, reject) => {
    db.get("select * from profiles where id=:id", id, (err, row) => {
      if (err || row === undefined) {
        reject(err)
        return
      }
      resolve(row)
    })
  })
}

function getCareers(id) {

}

function getEducations(id) {

}

function getLanguages(id) {

}
