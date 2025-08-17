import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('UserService', () => {
    let service: UserService;
    let repository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            // imports: [TypeOrmModule.forFeature([User])],

            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: 'database.sqlite',
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    // synchronize: true,
                    logger: 'advanced-console',
                }),
                TypeOrmModule.forFeature([User]),
            ],
            providers: [UserService],
            exports: [UserService],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('register', async () => {
        const username = 'clean test';
        const password = '123';
        // hash 加密
        const hashedPassword = await bcrypt.hash(password, 10);
        // 创建用户
        const user = repository.create({
            username,
            password: hashedPassword,
        });
        await repository.save(user);

        // 校验
        const userRes = await service.findOne(username);
        const compareRes = await bcrypt.compare(password, userRes.password);

        expect(compareRes).toEqual(true);
    });
});
