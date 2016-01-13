#!/bin/sh

rsync -av --progress ../whatta-burger/www ../white-oak --exclude=custom --exclude=res --exclude=.DS_Store
rsync -av --progress ../whatta-burger/www ../taco-villa --exclude=custom --exclude=res --exclude=.DS_Store
