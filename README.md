# elasticsearch-console
elasticsearch-console helps you to manage more faster your datas on elasticsearch

## Installation

$> npm install -g elasticsearch-console
==> To install every module and package that is necessary to launch elasticsearch-console
    
$> elasticsearch-console
==> To launch elasticsearch-console

## Installation
npm install mongoelastic

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
More informations on : https://github.com/boubaks/elasticsearch-query