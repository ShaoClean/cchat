import { Test, TestingModule } from '@nestjs/testing';
import { ThirdPartStrategy } from './strategy.abstract';
import { GithubStrategy } from './github/github.strategy';
import { LocalStrategy } from '../../auth/local.strategy';
import { JwtStrategy } from '../../auth/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThirdPartEntity } from '../third-part.entity';
import { UserModule } from '../../user/user.module';
import { ThirdPartService } from '../third-part.service';

describe('StrategyFactory', () => {
    let module: TestingModule;
    let services: ThirdPartStrategy[];

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: 'database.sqlite',
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    // synchronize: true,
                    logger: 'advanced-console',
                }),
                TypeOrmModule.forFeature([ThirdPartEntity]),
                UserModule,
                AuthModule,
                PassportModule,
                JwtModule.register({
                    secret: 'secretKey',
                    signOptions: { expiresIn: '24h' },
                }),
            ],
            providers: [
                ThirdPartService,
                LocalStrategy,
                JwtStrategy,
                GithubStrategy,
                { provide: 'THIRD_PART_STRATEGY', useFactory: (...strategies: ThirdPartStrategy[]) => strategies, inject: [GithubStrategy] },
            ],
        }).compile();
        services = module.get('THIRD_PART_STRATEGY');
    });

    it('github should be supported', async () => {
        const githubStrategy = services.find(strategy => strategy.support('github'));
        expect(githubStrategy).toBeDefined();
    });
});
