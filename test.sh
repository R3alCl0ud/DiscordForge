#!/bin/bash
function getJsonVal () {
    python -c "import json,sys;sys.stdout.write(json.dumps(json.load(sys.stdin)$1, sort_keys=True, indent=4))";
}

cat package.json | VERSION=getJsonVal "['version']"
