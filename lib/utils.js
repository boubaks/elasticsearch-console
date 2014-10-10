exports.trim = function(string) {
    var iterator = 0;
    var result = '';
 
    string = string.trim();
    while (iterator < string.length) {
	if (string[iterator] != ' ')
	    result += string[iterator];
	if (iterator < (string.length - 1) && string[iterator] == ' ' && string[iterator + 1] != ' ')
	    result += string[iterator];
	++iterator;
    }
    return (result);
}