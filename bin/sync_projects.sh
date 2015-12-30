#!/bin/sh

rsync -av --progress ../whatta-burger/www ../white-oak --exclude=custom --exclude=res --exclude=.DS_Store
