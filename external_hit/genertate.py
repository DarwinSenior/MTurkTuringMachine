#!/usr/bin/env python3

import os

paths = [
    "ILSVRC2015_val_00006005",
    "ILSVRC2015_val_00007001",
    "ILSVRC2015_val_00011001",
    "ILSVRC2015_val_00021004",
    "ILSVRC2015_val_00029000",
    "ILSVRC2015_val_00035015",
    "ILSVRC2015_val_00037002",
    "ILSVRC2015_val_00041010",
    "ILSVRC2015_val_00044010",
    "ILSVRC2015_val_00048003",
]

def chunks(l, n):
    """Yield successive n-sized chunks from l."""
    l = list(l)
    for i in range(0, len(l), n):
        yield l[i:i + n]

def getlist(start, step, _id):
    directory = os.path.abspath("../resources/%s/bbox" % _id)
    end = len(os.listdir(directory))
    return map(str, range(start, end, step))

inputfile = open('hit.input', 'w+')
inputfile.write('vid\n')
for path in paths:
    for chunk in chunks(getlist(1, 10, path), 5):
        inputfile.write('resources/%s/,%s\n' %
                        (path, ",".join(chunk)))
inputfile.close()
