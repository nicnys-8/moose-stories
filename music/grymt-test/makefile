# TODO: Write this as an actual makefile

all: listen

compile:
	lilypond test.ly

listen: compile
	killall timidity || true
	timidity test.midi >/dev/null &

view:
	xdg-open test.pdf &
