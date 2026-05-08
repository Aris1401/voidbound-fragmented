export default class CombatSystem {
    constructor() {
        this.playerStats = null;
        this.combatState = null; 
    }

    setPlayerStats(playerStats) {
        this.playerStats = playerStats;
    }

    setCombatState(combatState) {
        this.combatState = combatState;
    }

    startCombat() {
        // TODO: Start the turn system
    }
}