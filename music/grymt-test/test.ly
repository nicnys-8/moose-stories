\version "2.18.2"

\header {
	title    = "Grymt Test"
	composer = "Joakim Nilsson"
}

leverHappyCreepy = 100
x = d8
y = #(define-music-function (parser location note) (ly:music?)
	(if (> leverHappyCreepy 50)
		#{ $note #} ; Add sly
		#{ $note #}
	)
)

treble = \new Staff {
	\tempo "Spela han snabbt!" 4 = 90
	\time 4/4
	\key c \major

	\relative c' {
		\set midiInstrument = #"acoustic grand"
		\clef "treble"
		c4 \x c8 c4 \x c8 |
		c4 \y e8 c8 c4 e8 c8 |
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

