import { createParamDecorator, ExecutionContext, BadRequestException, NotFoundException } from '@nestjs/common';
import { StrategyRegistry } from './strategy.registry';

export const StrategyFromParam = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const provider = request.params.provider; // 从路由参数获取

    if (!provider) {
        throw new BadRequestException('Provider parameter is required in URL');
    }

    const strategy = StrategyRegistry.findStrategy(provider);

    if (!strategy) {
        throw new NotFoundException(`No strategy found for provider: ${provider}`);
    }

    return strategy;
});
