import { ThirdPartStrategy } from './strategy.abstract';

export class StrategyRegistry {
    private static strategies: ThirdPartStrategy[] = [];

    static register(strategy: ThirdPartStrategy) {
        this.strategies.push(strategy);
    }

    static getStrategies(): ThirdPartStrategy[] {
        return this.strategies;
    }

    static findStrategy(provider: string): ThirdPartStrategy | undefined {
        return this.strategies.find(strategy => strategy.support(provider));
    }

    static clear() {
        this.strategies = [];
    }
}
