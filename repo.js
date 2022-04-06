const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/test.db');

exports.authenticate = (email, passwd) => {
  return new Promise((resolve, reject) => {
    db.get('select * from profiles where email=:email', email, (err, row) => {
      console.log(email, passwd, err, row);
      if (err || row === undefined) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
};

exports.getProfiles = () => {
  return new Promise((resolve, reject) => {
    db.all('select * from profiles', (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
};

exports.getProfile = async (id) => {
  const base = await getContact(id);
  const careers = await getCareers(id);
  const educations = await getEducations(id);
  const technicals = await getTechnicalSkills(id);
  const languages = await getLanguages(id);

  return {
    ...base,
    careers,
    educations,
    technicals,
    languages
  };
};

function getContact(id) {
  return new Promise((resolve, reject) => {
    db.get('select * from profiles where id=:id', id, (err, row) => {
      if (err || row === undefined) {
        reject(err);
        return;
      }
      resolve(row);
    });
  });
}

function getCareers(id) {
  return new Promise((resolve, reject) => {
    db.all('select * from careers where profile_id=:id', id, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

function getEducations(id) {
  return new Promise((resolve, reject) => {
    db.all('select * from educations where profile_id=:id', id, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

function getLanguages(id) {
  return new Promise((resolve, reject) => {
    db.all('select * from languages where profile_id=:id', id, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(rows);
    });
  });
}

function getTechnicalSkills(id) {
  return new Promise((resolve, reject) => {
    db.all(
      'select * from hard_skills where profile_id=:id',
      id,
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      }
    );
  });
}
