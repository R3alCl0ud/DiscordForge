const fs = require('fs');
if (!fs.existsSync('./configs')) fs.mkdirSync('./configs');

/**
 * Opens a json file and returns the data
 * @param {string} JSONFile The file to retrive data from
 * @returns {Promise<Object>}
 */
function openJSON(JSONFile) {
  return new Promise((resolve, reject) => {
    fs.readFile(JSONFile, 'utf8', (err, data) => {
      if (err) return reject(err);
      try {
        return resolve(JSON.parse(data));
      } catch (e) {
        return reject(e);
      }
    });
  });
}

/**
 * Writes a json object to a file
 * @param {string} JSONFile The file to write to
 * @param {Object} JSONObject The object to write to file
 * @returns {Promise<string>}
 */
function writeJSON(JSONFile, JSONObject) {
  return new Promise((resolve, reject) => {
    fs.writeFile(JSONFile, JSON.stringify(JSONObject, null, '\t'), 'utf8', (err) => {
      if (err) return reject(err);
      return resolve('File saved');
    });
  });
}

/**
 * Opens a json file and returns the data
 * @param {string} JSONFile The file to retrive data from
 * @returns {Object}
 */
function openJSONSync(JSONFile) {
  return JSON.parse(fs.readFileSync(JSONFile));
}

/**
 * Writes a json object to a file
 * @param {string} JSONFile The file to write to
 * @param {Object} JSONObject The object to write to file
 */
function writeJSONSync(JSONFile, JSONObject) {
  fs.writeFileSync(JSONFile, JSON.stringify(JSONObject, null, 't'));
}

function timeToMs(time) {
  var final = 0;
  var hms = time.split(':');
  for (var i = 0; i < hms.length; i++) {
    var newfinal = final + (parseInt(hms[i]) * Math.pow(60, hms.length - (i + 1)));
    final = newfinal;
  }
  var ms = final * 1000;
  return ms;
}

function hasRole(user, role) {
  if (role === '@everyone') return true;

  const roles = user.roles.array();

  for (var i = 0; i < roles.length; i++) {
    if (roles[i].name.toLowerCase() === role.toLowerCase()) return 1;
  }
  return 0;
}


function hasPerms(user, permission) {
  var roles = user.roles.array();

  for (var role in roles) {
    if (roles[role].hasPermission(permission)) return true;
  }
  return false;
}

function getSubcommands(command, levels) {
  let tabs = '    ';
  let subs = [];

  for (let level = 0; level < levels--; level++) {
    tabs += '    ';
  }

  if (command.subCommands.size > 0) {
    command.subCommands.forEach(sub => {
      subs.push(getSubcommands(sub, levels));
    });
    return subs;
  } else {
    return tabs + command.id;
  }
}

exports.getSubcommands = getSubcommands;
exports.hasPerms = hasPerms;
exports.hasRole = hasRole;
exports.timeToMs = timeToMs;
exports.writeJSON = writeJSON;
exports.openJSON = openJSON;
exports.writeJSONSync = writeJSONSync;
exports.openJSONSync = openJSONSync;
