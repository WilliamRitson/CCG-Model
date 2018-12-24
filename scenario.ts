import { Card } from './card-types/card';
import { Game } from './game';
import { Permanent } from './card-types/permanent';
import { DeckList } from './deckList';

interface ScenarioPlayer {
    initialPermanents: Permanent[];
    lifeTotals: number;
    initialHands: Card[];
    deck?: DeckList;
}
export interface ScenarioData {
    name: string;
    description: string;
    playerSetups: [ScenarioPlayer, ScenarioPlayer];
}

export class Scenario {
    private playerSetups: [ScenarioPlayer, ScenarioPlayer];
    constructor(data: ScenarioData) {
        this.playerSetups = data.playerSetups;
    }

    public apply(game: Game) {
        for (let playerNumber = 0; playerNumber < 2; playerNumber++) {
            const player = game.getPlayer(playerNumber);
            player.addLife(
                this.playerSetups[playerNumber].lifeTotals - player.getLife()
            );

            for (const permanent of this.playerSetups[playerNumber]
                .initialPermanents) {
                game.addCardToPool(permanent);
                player.drawGeneratedCard(permanent);
                game.playCard(player, permanent);
            }
            for (const card of this.playerSetups[playerNumber].initialHands) {
                game.addCardToPool(card);
                player.drawGeneratedCard(card);
            }
        }
    }
}
