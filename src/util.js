const fs = require('fs');

function openJSON(JSONFile) {
  if (fs.existsSync(JSONFile)) {
    var jason = JSON.parse(fs.readFileSync(JSONFile.toString()));
    return jason;
  } else {
    return null;
  }
}

function writeJSON(JSONFile, jsonOb) {
  fs.writeFileSync(JSONFile, JSON.stringify(jsonOb, null, '\t'));
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
