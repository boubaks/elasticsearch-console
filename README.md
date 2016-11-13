# elasticsearch-console
elasticsearch-console helps you to manage more faster your datas on elasticsearch

## Installation

$> npm install -g elasticsearch-console

$> elasticsearch-console

## Launch elasticsearch-console

	$> elasticsearch-console --help
	Usage: elasticsearch-console

		-p, --port=ARG  port to connect to
		--host=ARG  server to connect to
		-h, --help      display this help
		-v, --version   show version


## How to use the elasticsearch-console
    
    elasticsearch-console> help
	 ------------------------------------------------------
	| ELASTICSEARCH-CONSOLE                     by boubaks |
	 ------------------------------------------------------

	exit :          to exit the elastic console

	ping :          show if the console is connected to ELS

	show :          show informations about ELS (indexes, clusters infos, ...)
	--------------------------------------------------------
	find :          find the data that you want
	                params : --type, --query, --index, --options
	--------------------------------------------------------
	remove :        remove the data that you want
	                params : --type, --query, --index
	--------------------------------------------------------
	update :        update the data that you want
	                params : --type, --query, --index, --object
	--------------------------------------------------------
	insert :        find the data that you want
	                params : --type, --index, --object
	--------------------------------------------------------

	elasticsearch-console> 
	elasticsearch-console> 
	elasticsearch-console> find --index user --type twitter
  
## Notes
This module use elasticsearch-query for more easier query from elasticsearch.

More information on : https://github.com/boubaks/elasticsearch-query