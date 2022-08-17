#!/bin/bash -eu

mkdir -p .sunaba
mkdir -p .sunaba/bin
ln -s $(which gdb) ./.sunaba/bin/gdb
ln -s $(which gcc) ./.sunaba/bin/gcc
