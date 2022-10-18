import React, { useEffect } from "react";

export default function Board() {
  return (
    <div>
      {showConfirmation ? (
        <ConfirmationDialog
          isOpen={showConfirmation}
          handleClose={() => setShowConfirmation(false)}
          submit={write}
          selectedMoveDirection={selectedMoveDirection}
        />
      ) : (
        player &&
        nonce &&
        IDomGame && (
          <div className="grid gap-10 grid-cols-3 grid-rows-3">
            {moveDirections.map((dir, i) => {
              return (
                <Cell
                  key={i}
                  moveDirection={dir}
                  isRestingSquare={dir == 0}
                  nonce={nonce}
                  handleCommitment={handleCommitment}
                  playerAddr={player.addr}
                  playerTokenId={player.tokenId}
                  IDomGame={IDomGame}
                />
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
