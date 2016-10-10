\version "2.18.2"

\header {
	title    = "Grymt Test"
	composer = "Joakim Nilsson"
}

\score {
	\new PianoStaff <<
		\new Staff {
			\tempo "Spela han snabbt!" 4 = 120
			\time 4/4

			\relative c' {
				\set midiInstrument = #"overdriven guitar"
				\clef "treble"
				c4 c8 c c b r4
				c4 c8 c c d r4
				c4 c8 c d c d c
				<c g'>8. <c e>16 <c g'>8. <c e>16 <c g'>8 <c e> <c g'> <c eis>
				<c g' c>1
			}
		}

		\new Staff {
			\relative c {
				\set midiInstrument = #"church organ"
				\clef "bass"
				<c e g>1
				<c eis g>4~<c e g>2.
				<c e g>1
				<c e g>1
				<c c' e g>1
			}
		}
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

