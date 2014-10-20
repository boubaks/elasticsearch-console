exports.trimTab = function(array) {
    var i = 0;
    while (i < array.length) {
	if (!array[i] || array[i].length == 0) {
	    array.splice(i, 1);
	    i = 0;
	}
	++i;
    }
    return (array);
}

exports.trim = function(string) {
    var iterator = 0;
    var result = '';
    var inQuote = false;

    string = string.trim();
    while (iterator < string.length) {
	if ((string[iterator] == "'" || string[iterator] == '"') && inQuote == false)
	    inQuote = true;
	if ((string[iterator] == "'" || string[iterator] == '"') && inQuote == true)
	    inQuote = false;
	if (string[iterator] != ' ')
	    result += string[iterator];
	if (iterator < (string.length - 1) && string[iterator] == ' ' && string[iterator + 1] != ' ' && inQuote == false)
	    result += string[iterator];
	++iterator;
    }
    return (result);
}

exports.trimToTab = function(string) {
    var me = this;
    var matches = /'.+?'/.exec(string);
//    var matches = /".+?"/.exec(string);
//    string = string.replace(/".+?"/, "").replace(/^\s+|\s+$/g, "");
    string = string.replace(/'.+?'/, '').replace(/^\s+|\s+$/g, '');

    var astr = string.split(" ");
    if (matches) {
	for (var i = 0; i < matches.length; i++) {
//            astr.push(matches[i].replace(/"/g, ""));
            astr.push(matches[i].replace(/'/g, ''));
	}
    }
    return (me.trimTab(astr));
}
