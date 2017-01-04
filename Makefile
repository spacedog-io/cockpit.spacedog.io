
# TODO : update for spacedog

# all: clean sass dist dog

build: clean sass dist

sass:
	gulp sass

clean:
	-rm -rf dist

dist:
	mkdir dist
	cp -R img dist/
	cp -R js dist/
	cp -R libs dist/
	cp -R styles dist/
	cp -R templates dist/
	cp index.html dist/

# dog:
	# dog sync -b suezcmdrec -l suezcmdrec -p www -s dist/
