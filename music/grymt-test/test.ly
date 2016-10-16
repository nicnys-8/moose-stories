\version "2.18.2"

\header {
	title    = "Grymt Test"
	composer = "Joakim Nilsson"
}

noteA = {ees8}

treble = \new Staff {
	\tempo "Spela han snabbt!" 4 = 90
	\time 4/4
	\key c \major

	\relative c' {
		\set midiInstrument = #"acoustic grand"
		\clef "treble"
		c4 d8   c c4 d8   c |
		c4 \noteA c c4 \noteA |
	}
}

bass = \new Staff {
	\set midiInstrument = #"french horn"
	\clef "bass"
	\key c \major

	\relative c {
		<c e   g>1 |
		<c ees g>1 |
	}
}

\score {
	\new PianoStaff <<
		\treble
		\bass
	>>

	\layout {}
	\midi {
		\context {
			\Staff
			\remove "Staff_performer"
		}
		\context {
			\Voice
			\consists "Staff_performer"
		}
	}
}

