import { Module, OnModuleInit } from '@nestjs/common';
import { ThirdPartService } from './third-part.service';
import { ThirdPartController } from './third-part.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdPartEntity } from './third-part.entity';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from '../auth/local.strategy';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { GithubStrategy } from './strategy/github/github.strategy';
import { StrategyRegistry } from './strategy/strategy.registry';

@Module({
    imports: [
        TypeOrmModule.forFeature([ThirdPartEntity]),
        UserModule,
        AuthModule,
        PassportModule,
        JwtModule.register({
            secret: 'secretKey',
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [ThirdPartController],
    providers: [ThirdPartService, LocalStrategy, JwtStrategy, GithubStrategy],
})
export class ThirdPartModule implements OnModuleInit {
    constructor(private readonly githubStrategy: GithubStrategy) {}

    onModuleInit(): any {
        // register all strategies on module init
        StrategyRegistry.register(this.githubStrategy);
    }
}
