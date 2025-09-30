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
import { GoogleStrategy } from './strategy/google/google.strategy';
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
    providers: [ThirdPartService, LocalStrategy, JwtStrategy, GithubStrategy, GoogleStrategy],
})
export class ThirdPartModule implements OnModuleInit {
    constructor(
        private readonly githubStrategy: GithubStrategy,
        private readonly googleStrategy: GoogleStrategy,
    ) {}

    onModuleInit(): any {
        // register all strategies on module init
        StrategyRegistry.register(this.githubStrategy);
        StrategyRegistry.register(this.googleStrategy);
    }
}
