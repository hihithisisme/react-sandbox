# Sandbox

This is my Front-end sandbox where I just dump stuff.

## Tic-tac-toe

So for tic-tac-toe, I built something up and I learnt some about CSS grids and a bit on layouts. There are a few
interesting variants that I do want to implement in the future.

### Vs AI [Done]

Player plays with an AI that uses the minimax algorithm. So far, there hasn't been a need for heuristics yet due to the
simplistic nature of the game. Interestingly, it seems like it is much simpler to obtain a draw for 4x4 and larger
boards.

Hopefully, one of the other variants can introduce significant depth that it is worth trying to implement a heuristic
into the minimax algorithm.

### Online 2-player

I want to implement an online version of the game with rooms that allow two users to join and play against each other in
real-time. This would open up for the more complicated variants of the tic-tac-toe games.

### Sized tic-tac-toe

This variant gives each player 3 kinds of symbols to place of differing sizes:

- 3 small
- 3 medium
- 3 large

The game plays as per the original variant, but you may draw over your opponent's symbol if you use one that is larger.

Required:

- Drag & drop mechanics?
- Live version for 2-player

### Bidding tic-tac-toe

This variant gives both players a set amount of tokens to begin with.

- Each turn, both players make a silent bid, indicating the number of tokens they are willing to give to make a move.
- The player with the higher bid gets to make the move.
- The other player gets the amount that the successful bidder bid.
- Repeat until someone wins the game.

This variant will very likely have to be an online version since I don't think the minimax algorithm translate well to
such a continuous range of options.

### Ultimate tic-tac-toe

This variant is the one whereby there are 9 3x3 grids and your goal is to win on 3 3x3 grids such that they form a line.
Due to the scale, it is quite possible that I will either need to migrate the minimax algorithm to a backend call using
perhaps golang, or just an online version will do.
